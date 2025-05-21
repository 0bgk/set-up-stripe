import express from 'express'
import Stripe from 'stripe'
import { env } from './env.js';

const app = express()
const stripe = new Stripe(env.STRIPE_PRIVATE_API_KEY, {
  apiVersion: '2025-04-30.basil',
}) 

app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204) 
  }
  next()
})

app.post('/create-payment-intent', async (_req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    })

    res.send({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'custom',
      line_items: [
        {
          // Provide the exact Price ID (e.g. price_1234) of the product you want to sell
        price: "price_1RQnhZRqfXHOaZkLvcTYOfoz",
        quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${env.APP_URL}/return.html?session_id={CHECKOUT_SESSION_ID}`,
    })

    res.send({ clientSecret: session.client_secret })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id)

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
