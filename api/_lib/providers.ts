import axios from 'axios'
import { env } from './env.js'

type VirusTotalSubmitResponse = {
  data?: {
    id?: string
  }
}

const DESTROYLIST_DEFAULT_BASE_URL = 'https://cors-bypasser-pro.vercel.app/proxy?url='
const ANTIDEO_HOURLY_LIMIT = 10
const HOUR_MS = 1000 * 60 * 60
const IPQUALITYSCORE_DEFAULT_BASE_URL = 'https://www.ipqualityscore.com/api/json/url'

let antideoWindowStart = Date.now()
let antideoRequestCount = 0

const toProviderError = (provider: string, error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const message =
      (typeof error.response?.data === 'object' &&
      error.response?.data &&
      'message' in (error.response.data as Record<string, unknown>) &&
      typeof (error.response.data as Record<string, unknown>).message === 'string'
        ? (error.response.data as Record<string, unknown>).message
        : error.message) || `${provider} unavailable`

    return {
      available: false,
      error: message,
      ...(typeof status === 'number' ? { status_code: status } : {}),
    }
  }

  return {
    available: false,
    error: error instanceof Error ? error.message : `${provider} unavailable`,
  }
}

const safeProviderGet = async (provider: string, request: () => Promise<Record<string, unknown>>) => {
  try {
    const data = await request()
    return { available: true, ...data }
  } catch (error) {
    return toProviderError(provider, error)
  }
}

const extractDomain = (value: string) => {
  try {
    const normalizedValue = value.includes('://') ? value : `http://${value}`
    return new URL(normalizedValue).hostname
  } catch {
    console.warn('DestroyList domain extraction failed; using raw input')
    return value
  }
}

const isLikelyDomainInput = (value: string) => {
  const trimmed = value.trim()
  if (trimmed.includes('://')) return false
  if (trimmed.includes('/')) return false
  if (trimmed.includes('?') || trimmed.includes('#')) return false
  return trimmed.length > 0
}

const canCallAntideo = () => {
  const now = Date.now()
  if (now - antideoWindowStart >= HOUR_MS) {
    antideoWindowStart = now
    antideoRequestCount = 0
  }
  if (antideoRequestCount >= ANTIDEO_HOURLY_LIMIT) {
    return false
  }
  antideoRequestCount += 1
  return true
}

export const providers = {
  async ipinfo(ip: string) {
    if (!env.IPINFO_TOKEN) {
      return { available: false, error: 'Missing IPINFO_TOKEN' }
    }
    return safeProviderGet('IPInfo', async () => {
      const { data } = await axios.get(`https://api.ipinfo.io/lite/${encodeURIComponent(ip)}`, {
        params: { token: env.IPINFO_TOKEN },
        timeout: 10000,
      })
      return (data as Record<string, unknown>) ?? {}
    })
  },

  async abuseIpdb(ip: string) {
    if (!env.ABUSEIPDB_API_KEY) {
      return { available: false, error: 'Missing ABUSEIPDB_API_KEY' }
    }
    return safeProviderGet('AbuseIPDB', async () => {
      const { data } = await axios.get('https://api.abuseipdb.com/api/v2/check', {
        params: { ipAddress: ip, maxAgeInDays: 90, verbose: true },
        headers: { Key: env.ABUSEIPDB_API_KEY, Accept: 'application/json' },
        timeout: 10000,
      })
      return (data?.data as Record<string, unknown>) ?? {}
    })
  },

  async antideoIpHealth(ip: string) {
    if (!env.ANTIDEO_API_KEY) {
      return { available: false, rate_limited: false, error: 'Missing ANTIDEO_API_KEY' }
    }
    if (!canCallAntideo()) {
      return { available: false, rate_limited: true, error: 'Antideo hourly limit reached' }
    }

    const result = await safeProviderGet('Antideo', async () => {
      const { data } = await axios.get(`https://api.antideo.com/ip/health/${encodeURIComponent(ip)}`, {
        headers: { apiKey: env.ANTIDEO_API_KEY },
        timeout: 10000,
      })
      return { rate_limited: false, ...(data as Record<string, unknown>) }
    })

    if (result.available) {
      return result
    }

    return {
      ...result,
      rate_limited: false,
      IP: ip,
      health: { toxic: false, proxy: false, spam: false },
    }
  },

  async fidroValidate(value: string, type: 'ip' | 'email') {
    if (!env.FIDRO_API_KEY) {
      return { available: false, error: 'Missing FIDRO_API_KEY' }
    }
    return safeProviderGet('Fidro', async () => {
      const { data } = await axios.post(
        'https://fidro.io/api/validate',
        { type, value },
        {
          headers: {
            Authorization: 'Bearer ' + env.FIDRO_API_KEY,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      )
      return (data as Record<string, unknown>) ?? {}
    })
  },

  async virusTotal(url: string) {
    if (!env.VIRUSTOTAL_API_KEY) {
      return { available: false, error: 'Missing VIRUSTOTAL_API_KEY' }
    }
    try {
      if (isLikelyDomainInput(url)) {
        const domain = extractDomain(url)
        const { data } = await axios.get(`https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`, {
          headers: { accept: 'application/json', 'x-apikey': env.VIRUSTOTAL_API_KEY },
          timeout: 10000,
        })
        return { available: true, ...(data as Record<string, unknown>) }
      }

      const body = new URLSearchParams({ url })
      let analysisId: string | undefined
      try {
        const submitResponse = await axios.post('https://www.virustotal.com/api/v3/urls', body, {
          headers: {
            accept: 'application/json',
            'x-apikey': env.VIRUSTOTAL_API_KEY,
            'content-type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        })
        const submittedData = (submitResponse.data as VirusTotalSubmitResponse | undefined)?.data
        analysisId = typeof submittedData?.id === 'string' ? submittedData.id : undefined
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error'
        console.warn(`VirusTotal URL submission failed (${message}), falling back to base64url lookup`)
        analysisId = undefined
      }

      const fallbackUrlId = Buffer.from(url).toString('base64url')
      const lookupId = analysisId || fallbackUrlId

      const { data } = await axios.get(`https://www.virustotal.com/api/v3/urls/${lookupId}`, {
        headers: { accept: 'application/json', 'x-apikey': env.VIRUSTOTAL_API_KEY },
        timeout: 10000,
      })
      return { available: true, ...(data as Record<string, unknown>) }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        try {
          const domain = extractDomain(url)
          const { data } = await axios.get(`https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`, {
            headers: { accept: 'application/json', 'x-apikey': env.VIRUSTOTAL_API_KEY },
            timeout: 10000,
          })
          return { available: true, ...(data as Record<string, unknown>) }
        } catch (fallbackError) {
          return toProviderError('VirusTotal', fallbackError)
        }
      }
      return toProviderError('VirusTotal', error)
    }
  },

  async destroyList(url: string) {
    return safeProviderGet('DestroyList', async () => {
      const domain = extractDomain(url)
      const baseUrl = env.DESTROYLIST_BASE_URL?.trim() || DESTROYLIST_DEFAULT_BASE_URL
      const isProxyBase = baseUrl.includes('/proxy?url=')
      const requestUrl = isProxyBase
        ? `${baseUrl}https://api.destroy.tools/v1/check?domain=${encodeURIComponent(domain)}`
        : `${baseUrl}/v1/check`
      const { data } = await axios.get(requestUrl, {
        ...(isProxyBase ? {} : { params: { domain } }),
        timeout: 10000,
      })
      return (data as Record<string, unknown>) ?? {}
    })
  },

  async ipQualityScoreUrl(url: string) {
    if (!env.IPQUALITYSCORE_API_KEY) {
      return { available: false, error: 'Missing IPQUALITYSCORE_API_KEY' }
    }
    return safeProviderGet('IPQualityScore', async () => {
      const { data } = await axios.get(
        `${IPQUALITYSCORE_DEFAULT_BASE_URL}/${encodeURIComponent(env.IPQUALITYSCORE_API_KEY)}/${encodeURIComponent(url)}`,
        {
          timeout: 10000,
        },
      )
      return (data as Record<string, unknown>) ?? {}
    })
  },

  async userCheckEmail(email: string) {
    if (!env.USERCHECK_API_KEY) {
      return { available: false, error: 'Missing USERCHECK_API_KEY' }
    }
    return safeProviderGet('UserCheck', async () => {
      const { data } = await axios.get(`https://api.usercheck.com/email/${encodeURIComponent(email)}`, {
        headers: { Authorization: 'Bearer ' + env.USERCHECK_API_KEY },
        timeout: 10000,
      })
      return (data as Record<string, unknown>) ?? {}
    })
  },

  async emailRep(email: string) {
    return safeProviderGet('EmailRep', async () => {
      const { data } = await axios.get(`https://emailrep.io/${encodeURIComponent(email)}`, {
        timeout: 10000,
      })
      return (data as Record<string, unknown>) ?? {}
    })
  },

  async rdapDomain(domain: string) {
    return safeProviderGet('RDAP', async () => {
      const { data } = await axios.get(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
        timeout: 10000,
      })
      return (data as Record<string, unknown>) ?? {}
    })
  },

  async whoisXmlSubdomains(domain: string) {
    if (!env.WHOISXML_API_KEY) {
      return { available: false, error: 'Missing WHOISXML_API_KEY' }
    }
    return safeProviderGet('WhoisXML', async () => {
      const { data } = await axios.get('https://subdomains.whoisxmlapi.com/api/v1', {
        params: { apiKey: env.WHOISXML_API_KEY, domainName: domain },
        timeout: 10000,
      })
      return (data as Record<string, unknown>) ?? {}
    })
  },

  async pulsedive(domain: string) {
    return safeProviderGet('Pulsedive', async () => {
      const { data } = await axios.get('https://pulsedive.com/api/indicator.php', {
        params: { indicator: domain },
        timeout: 10000,
      })
      if (typeof data?.error === 'string' && data.error.toLowerCase().includes('indicator not found')) {
        return { found: false, message: data.error, indicator: domain, risk: 'none' }
      }
      return { found: true, ...(data as Record<string, unknown>) }
    })
  },

  async userCheckDomain(domain: string) {
    if (!env.USERCHECK_API_KEY) {
      return { available: false, error: 'Missing USERCHECK_API_KEY' }
    }
    return safeProviderGet('UserCheck', async () => {
      const { data } = await axios.get(`https://api.usercheck.com/domain/${encodeURIComponent(domain)}`, {
        headers: { Authorization: 'Bearer ' + env.USERCHECK_API_KEY },
        timeout: 10000,
      })
      return (data as Record<string, unknown>) ?? {}
    })
  },
}
