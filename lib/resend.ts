import { Resend } from 'resend'

// Only initialize Resend if API key is configured
const resend = process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('[')
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export { resend }
