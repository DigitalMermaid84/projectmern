import React from 'react'
import './Breadcrum.css'
import arrow_icon from "../Assets/Frontend_Assets/breadcrum_arrow.png"


// export default Breadcrum
const Breadcrum = (props) => {
    const {product} = props;
  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product?.category} <img src={arrow_icon} alt="" /> {product?.name}
    </div>
  )
}


export default Breadcrum

// const Breadcrum = ({ product }) => {
//     console.log("Product in Breadcrum:", product); // Debugging log

//     return (
//         <div className='breadcrum'>
//             HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> 
//             {product?.category || "Unknown Category"} <img src={arrow_icon} alt="" /> 
//             {product?.name || "Unknown Product"}
//         </div>
//     )
// }