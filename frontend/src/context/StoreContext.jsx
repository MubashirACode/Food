import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const StoreContenxt = createContext(null);


const StoreContenxtProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token, setToken] = useState("");

    const [food_list, setFoodlist] = useState([]);






    const addtoCart = async (itemId) => {

        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }


        if (token) {
            await axios.post(url + '/api/cart/add', { itemId }, { headers: { token } })

        }


    }


    const removeFromCart = async (itemId) => {

        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        if (token) {

            axios.post(url + '/api/cart/remove', { itemId }, { headers: { token } })

        }

    }


    const getTotalCartAmount = () => {
        // ✅ Check if cartItems or food_list is empty
        if (!cartItems || !food_list || food_list.length === 0) {
            return 0;
        }

        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);

                // ✅ Null check
                if (itemInfo && itemInfo.price) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }

        return totalAmount;
    }


    // fetch Food List from backend and show in frontend 

    const fetchFoodList = async () => {
        // Validate URL
        if (!url || typeof url !== 'string' || !url.startsWith('http')) {
            console.error('Invalid base URL:', url);
            return; // Prevent axios call with invalid URL
        }

        // Ensure base URL ends with a slash
        const baseUrl = url.endsWith('/') ? url : `${url}/`;
        const apiUrl = `${baseUrl}api/food/list`;

        try {
            console.log('Fetching food list from:', apiUrl); // Debug log
            const response = await axios.get(apiUrl);
            if (response.data.success) {
                setFoodlist(response.data.data);
            } else {
                console.error('Failed to fetch food list:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching food list:', error.message);
        }
    };


    const loadCartData = async (token) => {


        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } })

        setCartItems(response.data.cartData);

    }


    useEffect(() => {

        async function loadData() {
            await fetchFoodList()
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }

        }

        loadData()

    }, [])

    const contextValue = {

        food_list,
        cartItems,
        setCartItems,
        addtoCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken


    }


    return (
        <StoreContenxt.Provider value={contextValue}>
            {props.children}
        </StoreContenxt.Provider>
    )

}

export default StoreContenxtProvider;


