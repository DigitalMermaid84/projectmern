import React, { createContext, useState, useEffect } from "react";

// Create ShopContext using createContext
export const ShopContext = createContext();

// Retrieve saved cart from localStorage or set default
const getDefaultCart = () => {
    const savedCart = localStorage.getItem("cartItems");

    if (savedCart) {
        return JSON.parse(savedCart);
    }

    return {}; // Empty cart initially
};

// ShopContextProvider component
const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [authToken, setAuthToken] = useState(localStorage.getItem("auth-token"));

    // ✅ Update `authToken` when it changes in localStorage
    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        setAuthToken(token);
    }, []);

    useEffect(() => {
        fetch("http://localhost:4000/allproduct")
            .then((response) => response.json())
            .then((data) => setAll_Product(data));

        if (authToken) {
            fetch("http://localhost:4000/getcart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "auth-token": authToken,
                    "Content-Type": "application/json",
                },
                body: "",
            })
            .then((response) => response.json())
            .then((data) => setCartItems(data));
        } else {
            setCartItems({}); // 🔥 Clear cart when user logs out
        }
    }, [authToken]); // ✅ Fix: Auth token tracking

    // ✅ Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // ✅ Function to update auth token (for login/logout)
    const updateAuthToken = (token) => {
        setAuthToken(token);
        if (token) {
            localStorage.setItem("auth-token", token);
        } else {
            localStorage.removeItem("auth-token");
            setCartItems({}); // ✅ Clear cart when logging out
        }
    };

    // ✅ Add to cart function
    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

        if (authToken) {
            fetch("http://localhost:4000/addtocart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "auth-token": authToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    };

    // ✅ Remove from cart function
    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[itemId] > 0) {
                updatedCart[itemId] -= 1;
            }
            return updatedCart;
        });

        if (authToken) {
            fetch("http://localhost:4000/removefromcart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "auth-token": authToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    };

    // ✅ Clear cart after checkout
    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem("cartItems"); // Remove from localStorage

        if (authToken) {
            fetch("http://localhost:4000/clearcart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "auth-token": authToken,
                    "Content-Type": "application/json",
                },
                body: "",
            })
            .then((response) => response.json())
            .then((data) => console.log("🛒 Cart Cleared:", data));
        }
    };

    // ✅ Get total cart amount
    const getTotalCartAmount = () => {
        return Object.keys(cartItems).reduce((total, itemId) => {
            const itemInfo = all_product.find((product) => product.id === Number(itemId));
            return total + (itemInfo?.new_price || 0) * cartItems[itemId];
        }, 0);
    };

    // ✅ Get total number of items in cart
    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    };

    // ✅ Provide all state and functions
    const contextValue = {
        all_product,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        getTotalCartItems,
        updateAuthToken, // ✅ Now available to update token
    };

    return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
