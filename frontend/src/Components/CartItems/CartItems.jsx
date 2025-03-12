import React, { useContext, useEffect } from 'react';
import "./CartItems.css";
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import remove_icon from '../Assets/Frontend_Assets/cart_cross_icon.png';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems = {}, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // Debugging: Ensure cart items are updating
  useEffect(() => {
    console.log("🔄 Cart Items Updated:", cartItems);
  }, [cartItems]);

  const handleCheckout = () => {
    if (Object.values(cartItems).every(quantity => quantity === 0)) {
      alert("🛒 Your cart is empty!");
      return;
    }

    alert("✅ Checkout successful! Redirecting to payment...");
    navigate("/checkout");
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product
        .filter((product) => cartItems[product.id] > 0) 
        .map((product) => {
          const quantity = cartItems[product.id] || 0; // Ensure quantity is retrieved
          const totalPrice = (product.new_price * quantity).toFixed(2);

          console.log(`🛒 Product: ${product.name}, Quantity: ${quantity}`); // Debugging

          return (
            <div key={product.id}>
              <div className="cartitems-format cartitems-format-main">
                <img
                  src={product.image}
                  alt={product.name}
                  className="carticon-product-icon"
                  onError={(event) => (event.target.src = "/assets/frontend_assets/fallback.png")}
                />
                <p>{product.name}</p>
                <p>₦{product.new_price}</p>
                
                {/* ✅ Display quantity inside an input field */}
                <input 
                  type="number" 
                  className="quantity-btn" 
                  value={quantity} 
                  readOnly 
                />
                <p>₦{totalPrice}</p>
                <img
                  src={remove_icon}
                  onClick={() => {
                    console.log(`❌ Removing Product ID: ${product.id}`);
                    removeFromCart(product.id);
                  }}
                  alt="Remove item"
                  className="remove-icon"
                />
              </div>
              <hr />
            </div>
          );
        })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>₦{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>₦{getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>Enter Your Promo Code Here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>

      {Object.keys(cartItems).length === 0 ||
      Object.values(cartItems).every((quantity) => quantity === 0) ? (
        <p>🛒 Your cart is empty!</p>
      ) : null}
    </div>
  );
};

export default CartItems;
