import React, { useContext, useEffect } from 'react'

import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContenxt } from '../../context/StoreContext'
import axios from 'axios'

export const Verify = () => {

    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")

    const { url } = useContext(StoreContenxt)


    const baseUrl = url.endsWith('/') ? url : `${url}/`;
    const apiUrl = `${baseUrl}api/order/verify`;

    const verifyPayment = async () => {

        const response = await axios.post(apiUrl, { success, orderId })

        if (response.data.success) {

            navigate("/myorders")

        } else {

            navigate("/")


        }

    }


    useEffect(() => {
        verifyPayment()
    }, [])

    return (

        <div className='verify'>
            <div className="spinner"></div>



        </div>


    )
}
