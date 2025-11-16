import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContenxt } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContenxt)

    const [data, setData] = useState({


        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""


    })


    const onChangeHandler = (event) => {

        const name = event.target.name;

        const value = event.target.value;

        setData(data => ({ ...data, [name]: value }))

    }


    const pleaceOrder = async (event) => {
        event.preventDefault();

        if (!url || typeof url !== 'string' || !url.startsWith('http')) {
            console.error('Invalid base URL from StoreContext:', url);
            alert('Error: Invalid API URL. Please contact support.');
            return;
        }

        if (!token) {
            console.error('No authentication token found');
            alert('Error: Please log in to place an order.');
            return;
        }

        const orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                const itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo);
            }
        });

        if (orderItems.length === 0) {
            alert('Error: Your cart is empty.');
            return;
        }

        if (!data || Object.keys(data).length === 0) {
            alert('Error: Please provide a valid address.');
            return;
        }

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2
        }

        const baseUrl = url.endsWith('/') ? url : `${url}/`;
        const apiUrl = `${baseUrl}api/order/place`;

        try {
            console.log('Placing order to URL:', apiUrl);
            console.log('Order data:', orderData);
            const response = await axios.post(apiUrl, orderData, {
                headers: { token },
            });

            if (response.data.success) {
                const { session_url } = response.data;
                if (!session_url || !session_url.startsWith('https://')) {
                    throw new Error('Invalid session URL');
                }
                window.location.replace(session_url);
            } else {
                alert(`Error: ${response.data.message || 'Failed to place order'}`);
            }
        } catch (error) {
            console.error('Error placing order:', error.message);
            alert(`Failed to place order: ${error.message}`);
        }
    };

    const navigate = useNavigate()

    useEffect(() => {


        if (!token) {
            navigate('/cart')
        }
        else if(getTotalCartAmount()===0)
{

    navigate('/cart')

}

    }, [token])



    return (

        <form onSubmit={pleaceOrder} className='place-order'>


            <div className="place-order-left">
                <p className='title'>Delivery Information</p>


                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
                </div>


                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />

                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-fields">
                    <input required name='zipcode' onChange={onChangeHandler} value={data.city} type="text" placeholder='Zip Code' />
                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>







                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' id="" />



            </div>



            <div className="place-order-right">
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
                    <button type='submit' >PROCEED TO PAYMENT</button>
                </div>
            </div>

        </form>
    )
}

export default PlaceOrder