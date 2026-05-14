export const sanitizeInput = (value: string) =>
  value.replace(/[<>"'`;]/g, '').trim().slice(0, 512)

export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T =>
  Object.entries(obj).reduce((acc, [key, val]) => {
    if (typeof val === 'string') {
      acc[key as keyof T] = sanitizeInput(val) as T[keyof T]
    } else {
      acc[key as keyof T] = val as T[keyof T]
    }
    return acc
  }, {} as T)
