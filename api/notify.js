export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN
  const CHAT_ID = process.env.VITE_TELEGRAM_CHAT_ID
  const { text } = req.body || {}

  if (!TOKEN || !CHAT_ID || !text) {
    return res.status(500).json({ ok: false, error: 'Missing config or text' })
  }

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${encodeURIComponent(CHAT_ID)}&text=${encodeURIComponent(text)}&parse_mode=HTML`
  const r = await fetch(url)
  const data = await r.json()
  return res.status(200).json(data)
}
