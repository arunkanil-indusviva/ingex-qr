const storageKey = "ingex-qr.token"

export function getAccessToken() {
  return localStorage.getItem(storageKey)
}

export function setAccessToken(token: string) {
  localStorage.setItem(storageKey, token)
}

export function clearAccessToken() {
  localStorage.removeItem(storageKey)
}
