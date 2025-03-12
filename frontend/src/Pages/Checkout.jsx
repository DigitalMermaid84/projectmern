import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import "./CSS/Checkout.css"; // Add styling if needed

const Checkout = () => {
  const { getTotalCartAmount, cartItems, all_product, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // Ensure we only redirect if the cart is *truly* empty
  const hasItems = Object.values(cartItems).some((quantity) => quantity > 0);

  const handlePayment = () => {
    alert("🛒 Payment Successful! Thank you for your order.");
    clearCart(); // ✅ Clear cart only after payment
    navigate("/"); // ✅ Redirect after clearing cart
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      
      {!hasItems ? (
        <p>Your cart is empty. <a href="/cart">Go back to cart</a></p>
      ) : (
        <>
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            {all_product
              .filter((product) => cartItems[product.id] > 0)
              .map((product) => (
                <div key={product.id} className="checkout-item">
                  <p>{product.name} x {cartItems[product.id]}</p>
                  <p>₦{(product.new_price * cartItems[product.id]).toFixed(2)}</p>
                </div>
              ))}
            <h3>Total: ₦{getTotalCartAmount().toFixed(2)}</h3>
          </div>
          <button onClick={handlePayment}>Confirm Payment</button>
        </>
      )}
    </div>
  );
};

export default Checkout;
