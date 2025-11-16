import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContenxt } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/frontend_assets/assets'

export const MyOrders = () => {


    const { url, token } = useContext(StoreContenxt)

    const [data, setData] = useState([]);

    const baseUrl = url.endsWith('/') ? url : `${url}/`;
    const apiUrl = `${baseUrl}api/order/userorders`;
    const fetchOrders = async () => {

        const response = await axios.post(apiUrl, {}, { headers: { token } })

        setData(response.data.data)
        console.log(response.data.data)
    }

    useEffect(() => {
        if (token) {

            fetchOrders();

        }

    }, [token])


    return (

        <div className='my-orders'>
            <h2>My Orders</h2>

            <div className="container">

                {data.map((order, index) => {

                    return (

                        <div className="my-orders-order" key={index}>

                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items.map((item, index) => {

                                if (index === order.items.length - 1) {

                                    return item.name + "x" + item.quantity

                                } else {


                                    return item.name + "x" + item.quantity + ", "

                                }

                            })}</p>


                            <p>${order.amount}.00</p>
                            <p>Items :{order.items.length}</p>
                            <p>  <span>&#x25cf;</span> <b>{order.status}</b> </p>
                            <button onClick={fetchOrders}>Track Order</button>

                        </div>
                    )
                })}

            </div>





        </div>


    )
}
