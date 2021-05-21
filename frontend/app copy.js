const express = require('express')
const helmet = require('helmet')
const xss = require('xss-clean')
const dotenv = require('dotenv')
const cors = require('cors')
const request = require('request')


const app = express()

// set security HTTP headers
app.use(helmet())
dotenv.config()
// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(
  express.urlencoded({
    extended: true
  })
)

// sanitize request data
app.use(xss())

// enable cors
app.use(cors())
app.options('*', cors())
console.log(process.env.PAYPAL_API)

app.post('/payments/paypal/create-payment', (req, res) => {
  console.log('welcome to paypal')
  request.post(
    process.env.PAYPAL_API + '/v1/payments/payment',
    {
      auth: {
        user: process.env.CLIENT,
        pass: process.env.SECRET
      },
      body: {
        intent: 'sale',

        payer: {
          payment_method: 'paypal'
        },

        transactions: [
          {
            amount: {
              total: '5.99',
              currency: 'USD'
            }
          }
        ],

        redirect_urls: {
          return_url: 'https://localhost:5000/payment/success',
          cancel_url: 'https://localhost:5000/payment/failed'
        }
      },

      json: true
    },
    function (err, response) {
      if (err) {
        console.error(err)
        return res.sendStatus(500)
      }
      if (response.statusCode !== 200) {
        console.error(err)
        return res.sendStatus(500)
      }
      // console.log(response)
      // 3. Return the payment ID to the client
      res.json({
        id: response.body.id
      })
    }
  )
})
app.post('/payments/paypal/execute-payment/', function (req, res) {
  const paymentID = req.body.paymentID
  const payerID = req.body.payerID
  request.post(process.env.PAYPAL_API + '/v1/payments/payment/' + paymentID +
    '/execute',
  {
    auth:
      {
        user: process.env.CLIENT,
        pass: process.env.SECRET
      },
    body:
      {
        payer_id: payerID,
        transactions: [
          {
            amount:
          {
            total: '10.99',
            currency: 'USD'
          }
          }]
      },
    json: true
  },
  function (err, response) {
    if (err) {
      console.error(err)
      return res.sendStatus(500)
    }
    console.log('🚀 ~ file: app.js ~ line 119 ~ response.statusCode', response.statusCode)
    if (response.statusCode !== 200) {
      console.error(err)
      return res.sendStatus(500)
    }
    res.json(
      {
        status: 'success'
      })
  })
})
app.get('/payments/success', (req, res) => {
  res.sendStatus(200)
  res.send('success')
})
app.get('/payments/failed', (req, res) => {
  res.sendStatus(200)
  res.send('failed')
})
app.use('/', (req, res) => {
  res.send('Welcome to Backend')
})

app.listen(3000, () => {
  console.log('server => 5000')
})
