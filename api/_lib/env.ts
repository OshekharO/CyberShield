export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  IPINFO_TOKEN: process.env.IPINFO_TOKEN ?? '',
  ABUSEIPDB_API_KEY: process.env.ABUSEIPDB_API_KEY ?? '',
  ANTIDEO_API_KEY: process.env.ANTIDEO_API_KEY ?? '',
  VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY ?? '',
  IPQUALITYSCORE_API_KEY: process.env.IPQUALITYSCORE_API_KEY ?? '',
  DESTROYLIST_BASE_URL: process.env.DESTROYLIST_BASE_URL ?? '',
  USERCHECK_API_KEY: process.env.USERCHECK_API_KEY ?? '',
  FIDRO_API_KEY: process.env.FIDRO_API_KEY ?? '',
  WHOISXML_API_KEY: process.env.WHOISXML_API_KEY ?? '',
}

export const requireEnv = (key: keyof typeof env) => {
  if (!env[key]) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return env[key]
}
