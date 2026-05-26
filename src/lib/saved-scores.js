const SCORES_KEY   = 'vsf-saved-scores'
const WATCHLIST_KEY = 'vsf-role-watchlist'

export function saveRun({ role, region, cvText, scores }) {
  const entry = { id: Date.now(), date: new Date().toISOString(), role, region, cvText, scores }
  const updated = [entry, ...getRuns()].slice(0, 10)
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(updated)) } catch {}
}

export function getRuns() {
  try { return JSON.parse(localStorage.getItem(SCORES_KEY) || '[]') } catch { return [] }
}

export function deleteRun(id) {
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(getRuns().filter(r => r.id !== id))) } catch {}
}

export function getWatchlist() {
  try { return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]') } catch { return [] }
}

export function addToWatchlist(role) {
  const list = [role, ...getWatchlist().filter(r => r.toLowerCase() !== role.toLowerCase())].slice(0, 8)
  try { localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list)) } catch {}
}

export function removeFromWatchlist(role) {
  try { localStorage.setItem(WATCHLIST_KEY, JSON.stringify(getWatchlist().filter(r => r.toLowerCase() !== role.toLowerCase()))) } catch {}
}
