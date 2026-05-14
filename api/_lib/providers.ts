import axios from 'axios'
import { env } from './env.js'

const PROVIDER_TIMEOUT_MS = 7000
const PROVIDER_MEMO_TTL_MS = 1000 * 60 * 3

const providerCache = new Map<string, { value: unknown; expiresAt: number }>()
const inFlightProviderCalls = new Map<string, Promise<unknown>>()

const safeGet = async <T>(request: () => Promise<T>, fallback: T | null): Promise<T | null> => {
  try {
    return await request()
  } catch {
    return fallback
  }
}

const memoizedProviderCall = async <T>(cacheKey: string, request: () => Promise<T>): Promise<T | null> => {
  const now = Date.now()
  const cached = providerCache.get(cacheKey)
  if (cached && cached.expiresAt > now) {
    return cached.value as T
  }

  const inFlight = inFlightProviderCalls.get(cacheKey)
  if (inFlight) {
    return inFlight as Promise<T | null>
  }

  const promise = request()
    .then((value) => {
      if (value !== null) {
        providerCache.set(cacheKey, { value, expiresAt: now + PROVIDER_MEMO_TTL_MS })
      }
      return value
    })
    .finally(() => {
      inFlightProviderCalls.delete(cacheKey)
    })

  inFlightProviderCalls.set(cacheKey, promise)
  return promise
}

export const providers = {
  async ipinfo(ip: string) {
    const key = `ipinfo:${ip}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const { data } = await axios.get(`https://api.ipinfo.io/lite/${encodeURIComponent(ip)}`, {
              params: { token: env.IPINFO_TOKEN },
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data
          },
          null,
        ),
    )
  },

  async abuseIpdb(ip: string) {
    const key = `abuseipdb:${ip}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const { data } = await axios.get('https://api.abuseipdb.com/api/v2/check', {
              params: { ipAddress: ip, maxAgeInDays: 90, verbose: true },
              headers: { Key: env.ABUSEIPDB_API_KEY, Accept: 'application/json' },
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data?.data ?? null
          },
          null,
        ),
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
            timeout: PROVIDER_TIMEOUT_MS,
          },
        )
        return data
      },
      null,
    )
  },

  async virusTotal(urlId: string) {
    const key = `virustotal:${urlId}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const { data } = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
              headers: { 'x-apikey': env.VIRUSTOTAL_API_KEY },
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data
          },
          null,
        ),
    )
  },

  async urlHaus(url: string) {
    const key = `urlhaus:${url}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const body = new URLSearchParams({ url })
            const { data } = await axios.post('https://urlhaus-api.abuse.ch/v1/url/', body, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data
          },
          null,
        ),
    )
  },

  async destroyList(url: string) {
    const key = `destroylist:${url}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const { data } = await axios.get(`${env.DESTROYLIST_BASE_URL}/v1/lookup`, {
              params: { url },
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data
          },
          null,
        ),
    )
  },

  async userCheckEmail(email: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get(`https://api.usercheck.com/email/${encodeURIComponent(email)}`, {
          headers: { Authorization: `Bearer ${env.USERCHECK_API_KEY}` },
          timeout: PROVIDER_TIMEOUT_MS,
        })
        return data
      },
      null,
    )
  },

  async emailRep(email: string) {
    return safeGet(
      async () => {
        const { data } = await axios.get(`https://emailrep.io/${encodeURIComponent(email)}`, {
          timeout: PROVIDER_TIMEOUT_MS,
        })
        return data
      },
      null,
    )
  },

  async rdapDomain(domain: string) {
    const key = `rdap:${domain}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const { data } = await axios.get(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data
          },
          null,
        ),
    )
  },

  async whoisXmlSubdomains(domain: string) {
    const key = `whoisxml:${domain}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const { data } = await axios.get('https://subdomains.whoisxmlapi.com/api/v1', {
              params: { apiKey: env.WHOISXML_API_KEY, domainName: domain },
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data
          },
          null,
        ),
    )
  },

  async pulsedive(domain: string) {
    const key = `pulsedive:${domain}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const { data } = await axios.get('https://pulsedive.com/api/indicator.php', {
              params: { indicator: domain },
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data
          },
          null,
        ),
    )
  },

  async userCheckDomain(domain: string) {
    const key = `usercheck-domain:${domain}`
    return memoizedProviderCall(
      key,
      () =>
        safeGet(
          async () => {
            const { data } = await axios.get(`https://api.usercheck.com/domain/${encodeURIComponent(domain)}`, {
              headers: { Authorization: `Bearer ${env.USERCHECK_API_KEY}` },
              timeout: PROVIDER_TIMEOUT_MS,
            })
            return data
          },
          null,
        ),
    )
  },
}
