import React, { useState } from 'react'
import { assets } from '../../assets/frontend_assets/assets'
import './LoginPopup.css'
import { useEffect } from 'react'
import { useContext } from 'react'

import axios from "axios"
import { StoreContenxt } from '../../context/StoreContext'



export const LoginPopup = ({ setShowLogin }) => {

    const { url, setToken } = useContext(StoreContenxt);
    const [currState, setCurrState] = useState("Login")

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",

    })


    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }


   const onLogin = async (event) => {
        event.preventDefault();

        // Validate base URL
        if (!url || typeof url !== 'string' || !url.startsWith('http')) {
            console.error("Invalid base URL from StoreContext:", url);
            alert("Error: Invalid API URL. Please contact support.");
            return;
        }

        // Ensure base URL ends with a slash
        const baseUrl = url.endsWith('/') ? url : `${url}/`;
        let newUrl = baseUrl;

        // Append the appropriate endpoint
        if (currState === "Login") {
            newUrl += "api/user/login";
        } else {
            newUrl += "api/user/register";
        }

        try {
            console.log("Making request to URL:", newUrl); // Debug log
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("API request error:", error.message);
            alert(`Failed to ${currState.toLowerCase()}: ${error.message}`);
        }
    };

    useEffect(() => {
        console.log("Form data:", data);
        console.log("Base URL from StoreContext:", url); // Debug log
    }, [data, url]);

    return (


        <div className='login-popup'>


            <form onSubmit={onLogin} action="" className='login-popup-container'>

                <div className="login-popup-title">

                    <h2>{currState}</h2>

                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />

                </div>


                <div className="login-popup-inputs">

                    {currState === 'Login' ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}

                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email ' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>

                <button type='submit'>{currState === 'Sign Up' ? 'Create account' : 'Login'}</button>

                <div className="login-popup-condition">

                    <input type="checkbox" required />
                    <p>By continuing , i agree to the trems od use & privacy policy.</p>

                </div>

                {currState === "Login" ? <p>Create a new account ? <span onClick={() => setCurrState("Sign Up")}>Click here</span> </p> : <p>Already have an account ? <span onClick={() => setCurrState("Login")}>Login here</span></p>}




            </form>

        </div>
    )
}
