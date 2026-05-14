import axios from 'axios'
import { env } from './env.js'

const safeGet = async <T>(request: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await request()
  } catch {
    return fallback
  }
}

export const providers = {
  async ipinfo(ip: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get(`https://api.ipinfo.io/lite/${encodeURIComponent(ip)}`, {
          params: { token: env.IPINFO_TOKEN },
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async abuseIpdb(ip: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get('https://api.abuseipdb.com/api/v2/check', {
          params: { ipAddress: ip, maxAgeInDays: 90, verbose: true },
          headers: { Key: env.ABUSEIPDB_API_KEY, Accept: 'application/json' },
          timeout: 10000,
        })
        return data?.data ?? {}
      },
      {},
    )
  },

  async fidroValidate(value: string, type: 'ip' | 'email') {
    return safeGet(
      async () => {
        const { data } = await axios.post(
          'https://fidro.io/api/validate',
          { type, value },
          {
            headers: {
              Authorization: `Bearer ${env.FIDRO_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          },
        )
        return data
      },
      {},
    )
  },

  async virusTotal(url: string) {
    return safeGet(
      async () => {
        const body = new URLSearchParams({ url })
        const submitResponse = await axios.post('https://www.virustotal.com/api/v3/urls', body, {
          headers: {
            accept: 'application/json',
            'x-apikey': env.VIRUSTOTAL_API_KEY,
            'content-type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        })
        const submittedData = submitResponse.data?.data as { id?: string } | undefined
        const analysisId = typeof submittedData?.id === 'string' ? submittedData.id : undefined
        const fallbackUrlId = Buffer.from(url).toString('base64url')
        const lookupId = analysisId || fallbackUrlId

        const { data } = await axios.get(`https://www.virustotal.com/api/v3/urls/${lookupId}`, {
          headers: { accept: 'application/json', 'x-apikey': env.VIRUSTOTAL_API_KEY },
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async urlHaus(url: string) {
    return safeGet(
      async () => {
        const body = new URLSearchParams({ url })
        const { data } = await axios.post('https://urlhaus-api.abuse.ch/v1/url/', body, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async destroyList(url: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get(`${env.DESTROYLIST_BASE_URL}/v1/lookup`, {
          params: { url },
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async userCheckEmail(email: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get(`https://api.usercheck.com/email/${encodeURIComponent(email)}`, {
          headers: { Authorization: `Bearer ${env.USERCHECK_API_KEY}` },
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async emailRep(email: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get(`https://emailrep.io/${encodeURIComponent(email)}`, {
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async rdapDomain(domain: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async whoisXmlSubdomains(domain: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get('https://subdomains.whoisxmlapi.com/api/v1', {
          params: { apiKey: env.WHOISXML_API_KEY, domainName: domain },
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async pulsedive(domain: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get('https://pulsedive.com/api/indicator.php', {
          params: { indicator: domain },
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },

  async userCheckDomain(domain: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get(`https://api.usercheck.com/domain/${encodeURIComponent(domain)}`, {
          headers: { Authorization: `Bearer ${env.USERCHECK_API_KEY}` },
          timeout: 10000,
        })
        return data
      },
      {},
    )
  },
}
