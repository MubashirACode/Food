import React, { useContext } from 'react'
import './Cart.css'
import { StoreContenxt } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
export const Cart = () => {


  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContenxt);

  const navigate = useNavigate()


  // ✅ Safety check
  if (!cartItems || !food_list) {
    return <div>Loading...</div>
  }

  return (

    <>

      <div className='cart'>

        <div className="cart-items">


          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>

          </div>


          <br />
          <hr />

          {food_list.map((item, index) => {


            if (cartItems[item._id] > 0) {
              return (
                <div className="" key={index}>
                  <div className="cart-items-title cart-items-item">

                    <img src={url + "/images/" + item.image} alt="" />
                    <p>{item.name}</p>
                    <p>${item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>${item.price * cartItems[item._id]}</p>
                    <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>

                  </div>
                  <hr />
                </div>
              )
            }

          })}




        </div>

        <div className="cart-bottom">
          <div className="cart-total">

            <h2>Cart Totals</h2>

            <div className="">

              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount}</p>
              </div>

              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>

              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
              </div>

            </div>
            <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
          </div>

          <div className="cart-promocode">
            <div className="">
              <p>If you have a promo code , Enter it here </p>

              <div className="cart-promocode-input">

                <input type="text" name="" id="" placeholder='Promo code' />
                <button>Submint</button>

              </div>

            </div>
          </div>


        </div>
      </div>

    </>
  )
}
