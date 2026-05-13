import axios from 'axios'

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
