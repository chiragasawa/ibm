
  // paypal.Buttons({
  //     style:{
  //       color:'black',
  //       background:'white',
  //       shape:'pill'
  //     },
  //   createOrder: function(data, actions) {
  //       const value=((document.querySelector('.amount-preset > span.active')==null ? null : document.querySelector('.amount-preset > span.active').textContent) || document.getElementById('custom-donation').value).replace('₹','')
  //       console.log(value)
  //     return actions.order.create({
  //       purchase_units: [{
  //         amount: {
  //           value: value
  //       }
  //       }]
  //     });
  //   },
  //   onApprove: function(data, actions) {
  //     return actions.order.capture().then(function(details) {
  //       alert('Transaction completed by ' + details.payer.name.given_name);
  //     });
  //   },
  //   onCancel:function(data){
  //       console.log("Payment canceled",data);
  //   }
  // }).render('#paypal-button-container'); // Display payment options on your web page


  paypal.Button.render({
    style:{
            color:'black',
            background:'white',
            shape:'pill',
            width: '100%',
            size:'responsive',
            label:'pay'
          },
    env: 'sandbox', // Or 'production'
    // Set up the payment:
    // 1. Add a payment callback
    payment: function(data, actions) {
      // 2. Make a request to your server
      const payload={}
      payload.amount=((document.querySelector('.amount-preset > span.active')==null ? null : document.querySelector('.amount-preset > span.active').textContent) || document.getElementById('custom-donation').value).replace('₹','')
      payload.firstName=document.getElementById('fName').value
      payload.lastName=document.getElementById('lName').value
      payload.country=document.getElementById("inputCountry").value
      payload.city=document.getElementById('inputCity').value
      payload.postCode=document.getElementById('inputPost').value
      payload.phone=document.getElementById('inputPhone').value
      console.log(payload);
      return actions.request.post('http://localhost:3000/payments/paypal/create-payment/',payload)
        .then(function(res) {
          // 3. Return res.id from the response
          return res.id;
        });
    },
    // Execute the payment:
    // 1. Add an onAuthorize callback
    onAuthorize: function(data, actions) {
      // 2. Make a request to your server
      console.log(data)
     return actions.request.post('http://localhost:3000/payments/paypal/execute-payment/', {
        paymentID: data.paymentID,
        payerID:   data.payerID
      })
        .then(function(res) {
          // 3. Show the buyer a confirmation message.
        });
    }
  }, '#paypal-button');