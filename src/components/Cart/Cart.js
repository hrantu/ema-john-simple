import React from 'react';


const Cart = (props) => {
    const cart = props.cart;
    // const total = cart.reduce((total, prd) => total + prd.price, 0);
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const product = cart[i];
        total = Math.round(total + product.price * product.quantity);
    }

    let shipping = 0;
    if(total >35){
        shipping=0;
    }
    else if(total > 15){
        shipping=4.99;
    }
    else if(total> 0){
        shipping = 12.99;
    }

    const tax = Math.floor(total/10);
    return (
        <div>
          <h4 className="bg-success">Order Summary</h4>
          <p>Items ordered: {cart.length}</p>
          <p>Product Price: {total}</p>
          <p><small>Shipping Cost: {shipping}</small></p>
          <p><small>Tax: {tax}</small></p>
          <p>Total Price: {total + shipping + tax}</p>
          <br/>
          {
              props.children
          }
          
        </div>
    );
};

export default Cart;<h4>Order Summary</h4>