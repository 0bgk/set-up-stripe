# Stripe Checkout Project

This project includes a basic API and frontend to handle payments using Stripe.

## Setup Instructions

Before running any tests:

1. In the root of both `api/` and `app/` folders, create a file named `env.js` with the following content:

```js
const env = {
  APP_URL: '',
  API_URL: '',
  STRIPE_PUBLISHABLE_API_KEY: '',
  STRIPE_PRIVATE_API_KEY: '',
}
```

2. To start the API, navigate to the `api` folder and run:

```bash
yarn dev
```

3. To run the frontend (`app`), either open the HTML file directly in your browser or start a local server, for example:

```bash
python -m http.server
```

## Updating the Product

To enable purchases, update the product `price` inside the following API endpoint:

```js
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'custom',
      line_items: [
        {
          // Replace this with your own Price ID
          price: "price_1RQnhZRqfXHOaZkLvcTYOfoz",
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${env.APP_URL}/return.html?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

📌 **Make sure to replace the `price` value with your own Price ID created in Stripe.**
