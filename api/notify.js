export default async function handler(req, res) {
  const TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN
  const CHAT_ID = process.env.VITE_TELEGRAM_CHAT_ID

  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Missing env vars', TOKEN: !!TOKEN, CHAT_ID: !!CHAT_ID })
  }

  const text = req.method === 'GET'
    ? '🧪 Test /api/notify GET'
    : (req.body && req.body.text)

  if (!text) return res.status(400).json({ ok: false, error: 'Missing text' })

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${encodeURIComponent(CHAT_ID)}&text=${encodeURIComponent(text)}&parse_mode=HTML`
  const r = await fetch(url)
  const data = await r.json()
  return res.status(200).json(data)
}
