import { Resend } from 'resend'

// Only initialize Resend if API key is configured and not a placeholder
const resend = process.env.RESEND_API_KEY && 
  process.env.RESEND_API_KEY.length > 0 &&
  !process.env.RESEND_API_KEY.includes('[') &&
  !process.env.RESEND_API_KEY.includes('your_') &&
  process.env.RESEND_API_KEY !== 're_'
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export { resend }
