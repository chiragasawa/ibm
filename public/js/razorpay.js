// const options = {
//   key: 'rzp_test_iupa952HoHvqVm', // Enter the Key ID generated from the Dashboard
//   amount: (
//     100 *
//     parseInt(
//       (
//         (document.querySelector('.amount-preset > span.active') == null
//           ? null
//           : document.querySelector('.amount-preset > span.active')
//             .textContent) || document.getElementById('custom-donation').value
//       ).replace('₹', '')
//     )
//   ).toString(), // Amount is in cu/rrency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//   currency: 'INR',
//   name: 'Acme Corp',
//   description: 'Donation',
//   image: 'https://example.com/your_logo',
//   // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//   handler: function (response) {
//     alert(response.razorpay_payment_id)
//     alert(response.razorpay_order_id)
//     alert(response.razorpay_signature)
//   },
//   prefill: {
//   name:"chirag asawa"
//   },
  
//   theme: {
//     color: '#3399cc'
//   }
// }
// let rzp1 = new Razorpay(options)
// rzp1.on('payment.failed', function (response) {
//   alert(response.error.code)
//   alert(response.error.description)
//   alert(response.error.source)
//   alert(response.error.step)
//   alert(response.error.reason)
//   alert(response.error.metadata.order_id)
//   alert(response.error.metadata.payment_id)
// })
// document.getElementById('rzp-button1').onclick = async function (e) {
//   e.preventDefault()
//   options.amount = (
//     100 *
//     parseInt(
//       (
//         (document.querySelector('.amount-preset > span.active') == null
//           ? null
//           : document.querySelector('.amount-preset > span.active')
//             .textContent) || document.getElementById('custom-donation').value
//       ).replace('₹', '')
//     )
//   ).toString()
//   options.order_id = await fetch(
//     '/payments/razorpay/amount',
//     {
//       // Adding method type
//       method: 'POST',

//       // Adding body or contents to send
//       body: JSON.stringify({
//         amount: options.amount
//       }),

//       // Adding headers to the request
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8',
//         'Access-Control-Allow-Origin': '*'
//       }
//     }
//   ).then((data) => {
//     console.log(data)
//     data.json()
//   }).then(data => console.log(data))
//   rzp1 = new Razorpay(options)

//   rzp1.open()
// }
const options = {
  key: 'rzp_test_mJwqE5M7qVenay', // Enter the Key ID generated from the Dashboard
  amount: (
    100 *500
  ).toString(), // Amount is in cu/rrency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  currency: 'INR',
  name: 'Acme Corp',
  description: 'Donation',
  image: 'https://example.com/your_logo',
  // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  handler: function (response) {
    alert(response.razorpay_payment_id)
    alert(response.razorpay_order_id)
    alert(response.razorpay_signature)
  },
  prefill: {
  name:"chirag asawa"
  },
  
  theme: {
    color: '#3399cc'
  }
}
let rzp1 = new Razorpay(options)
rzp1.on('payment.failed', function (response) {
  alert(response.error.code)
  alert(response.error.description)
  alert(response.error.source)
  alert(response.error.step)
  alert(response.error.reason)
  alert(response.error.metadata.order_id)
  alert(response.error.metadata.payment_id)
})
document.getElementById('rzp-button1').onclick = async function (e) {
  e.preventDefault()
  options.amount = (
    100 *500
  ).toString()
  options.order_id =await axios.post('/payments/razorpay/amount',{amount:options.amount}).then((info,err)=>{
    console.log(info);
    // console.log("err",err.data)
  return info.data.id;
  })
  console.log(options.order_id)
  rzp1 = new Razorpay(options)

  rzp1.open()
}
