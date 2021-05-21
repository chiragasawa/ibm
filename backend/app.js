const express = require("express");
const path = require("path");
// const helmet = require('helmet')
// const xss = require('xss-clean')
const dotenv = require("dotenv");
// const cors = require('cors')
const request = require("request");
const shortid = require("shortid");
const Razorpay = require("razorpay");

// Firebase

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAuthKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// -----------------

//  express

const app = express();
const dirname = path.resolve();
app.use(express.static("public"));
app.use(express.json());
dotenv.config();
app.use(
  express.urlencoded({
    extended: false,
  })
);

// --------------------------

// ENV check

console.log(
  "🚀 ~ file: app.js ~ line 27 ~ process.env.RAZORPAY_SECRET",
  process.env.RAZORPAY_SECRET
);
console.log(process.env.PAYPAL_API);

//  Global Variables

let content = {};

// -----------

//  RazorPay

const razorpay = new Razorpay({
  key_secret: process.env.RAZORPAY_SECRET,
  key_id: process.env.RAZORPAY_ID,
});

//   ----------->> Generate order id

app.post("/payments/razorpay/amount", async (req, res) => {
  const payment_capture = true;
  const receipt = shortid.generate();
  const options = {
    amount: req.body.amount,
    currency: "INR",
    receipt,
    payment_capture,
  };
  try {
    const response = razorpay.orders.create(options, (err, order) => {
      console.log(err);
      console.log(order);
      res.json(order);
    });
  } catch (e) {
    console.log(e);
  }
});

//       ------------->>  Varification route

app.post("payments/razorpay/varification", async (req, res) => {
  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac(
    "sha256",
    process.env.RAZORPAY_VARIFICATION_SECRET
  );
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    db.collection("razorpay").add(req.body);
  } else {
    // pass it
  }
  res.json({ status: "ok" });
});

app.post("/payments/paypal/create-payment", (req, res) => {
  console.log("welcome to paypal");
  console.log(req.body);
  content = req.body;
  request.post(
    process.env.PAYPAL_API + "/v1/payments/payment",
    {
      auth: {
        user: process.env.CLIENT,
        pass: process.env.SECRET,
      },
      body: {
        intent: "sale",

        payer: {
          payment_method: "paypal",
        },

        transactions: [
          {
            amount: {
              total: req.body.amount,
              currency: "USD",
            },
          },
        ],

        redirect_urls: {
          return_url: "https://localhost:3000/payment/success",
          cancel_url: "https://localhost:3000/payment/failed",
        },
      },

      json: true,
    },
    function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      if (response.statusCode > 300) {
        console.error(err, response.body, response.statusCode);
        return res.sendStatus(500);
      }
      res.json({
        id: response.body.id,
      });
    }
  );
});
app.post("/payments/paypal/execute-payment/", function (req, res) {
  console.log("here in second api");
  const paymentID = req.body.paymentID;
  const payerID = req.body.payerID;
  request.post(
    process.env.PAYPAL_API + "/v1/payments/payment/" + paymentID + "/execute",
    {
      auth: {
        user: process.env.CLIENT,
        pass: process.env.SECRET,
      },
      body: {
        payer_id: payerID,
        transactions: [
          {
            amount: {
              total: content.amount,
              currency: "USD",
            },
          },
        ],
      },
      json: true,
    },
    async function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      console.log(
        "🚀 ~ file: app.js ~ line 119 ~ response.statusCode",
        response.statusCode
      );
      if (response.statusCode > 300) {
        console.error(err, response.body);
        return res.sendStatus(500);
      }
      await db.collection("paypal").add({
        frontend: content,
        backend: response.body,
      });

      res.json({
        status: "success",
      });
    }
  );
});
app.get("/payments/success", (req, res) => {
  res.sendStatus(200);
  res.send("success");
});
app.get("/payments/failed", (req, res) => {
  res.sendStatus(200);
  res.send("failed");
});
app.use("/", (req, res) => {
  // res.send('Welcome to Backend')
  res.sendFile(path.resolve(dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("server => 3000");
});
