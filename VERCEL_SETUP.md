# Vercel Environment Variables Setup

To deploy this application on Vercel, you need to set up the following environment variables in your Vercel project settings:

## Required Environment Variables

### Database
```
DATABASE_URL=postgresql://your_neon_connection_string
```
- Get this from your Neon PostgreSQL dashboard
- This is required for all data storage (users, products, cart, orders, etc.)

### OTP Service
```
ARKESEL_API_KEY=your_arkesel_api_key
```
- Get this from your Arkesel dashboard
- This is required for sending SMS and email OTPs

## Optional Environment Variables

### Paystack (for payments)
```
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_CALLBACK_URL=https://your-domain.com/api/paystack/callback
```

## How to Set Up in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable with its value
5. Click "Save"
6. Redeploy your application

## Important Notes

- Make sure to add the DATABASE_URL and ARKESEL_API_KEY for the application to work
- Without these variables, OTP sending and account creation will fail
- The application uses PostgreSQL for persistent storage, so DATABASE_URL is critical
