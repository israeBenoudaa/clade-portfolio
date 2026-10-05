const TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

async function send(text) {
  if (!TOKEN || !CHAT_ID) return
  try {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${encodeURIComponent(CHAT_ID)}&text=${encodeURIComponent(text)}&parse_mode=HTML`
    await fetch(url)
  } catch (err) {
    console.error('[Telegram]', err)
  }
}

export function notifyProspect({ prenom, nom, email, telephone, type_projet, budget, localisation }) {
  const lines = [
    '🏛 <b>Nouveau prospect — Portfolio</b>',
    '',
    `👤 ${prenom || ''} ${nom || ''}`.trim(),
    `📧 ${email}`,
    telephone ? `📞 ${telephone}` : null,
    type_projet ? `🏗 ${type_projet}` : null,
    budget ? `💰 Budget : ${budget}` : null,
    localisation ? `📍 ${localisation}` : null,
  ].filter(l => l !== null).join('\n')
  return send(lines)
}

export function notifyCandidat({ prenom, nom, email, telephone, poste_vise, departement }) {
  const lines = [
    '📋 <b>Nouvelle candidature — Portfolio</b>',
    '',
    `👤 ${prenom || ''} ${nom || ''}`.trim(),
    `📧 ${email}`,
    telephone ? `📞 ${telephone}` : null,
    poste_vise ? `💼 Poste : ${poste_vise}` : null,
    departement ? `🏢 Département : ${departement}` : null,
  ].filter(l => l !== null).join('\n')
  return send(lines)
}
