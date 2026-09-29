let sequence = 800

export function nextId(prefix: string) {
  sequence += 1
  return `${prefix}_${sequence}`
}
