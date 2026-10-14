import type { VercelRequest, VercelResponse } from '@vercel/node'

const allowedTypes = new Set(['Job or internship', 'Freelance project', 'Collaboration', 'Professional networking', 'General enquiry'])
const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : ''

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })
  const origin = req.headers.origin
  const host = req.headers.host
  if (origin && host) {
    try { if (new URL(origin).host !== host) return res.status(403).json({ error: 'Request origin was not accepted.' }) }
    catch { return res.status(403).json({ error: 'Request origin was not accepted.' }) }
  }
  const body = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {}
  // Honeypot: silently accept bot submissions without sending email.
  if (text(body.website, 200)) return res.status(200).json({ ok: true })
  const name = text(body.name, 100)
  const email = text(body.email, 254)
  const type = text(body.type, 60)
  const subject = text(body.subject, 160)
  const message = text(body.message, 5000)
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !allowedTypes.has(type) || subject.length < 3 || message.length < 10) {
    return res.status(400).json({ error: 'Please check the form fields and try again.' })
  }
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) return res.status(503).json({ error: 'Message delivery is not configured yet. Please contact Edwin by email instead.' })
  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [to], reply_to: email,
        subject: `[Portfolio / ${type}] ${subject}`,
        text: `New message from Edwin Darko's portfolio\n\nName: ${name}\nEmail: ${email}\nEnquiry: ${type}\nSubject: ${subject}\n\nMessage:\n${message}`,
      }),
    })
    if (!delivery.ok) {
      // Avoid returning provider details or secrets to the browser.
      console.error('Contact email provider returned status:', delivery.status)
      return res.status(502).json({ error: 'The email service could not deliver your message. Please try email instead.' })
    }
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact email delivery failed:', error instanceof Error ? error.message : 'Unknown error')
    return res.status(502).json({ error: 'The email service could not deliver your message. Please try email instead.' })
  }
}
