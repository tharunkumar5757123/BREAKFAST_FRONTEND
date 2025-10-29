// import React, { useEffect, useState } from "react";
// import { useCart } from "../context/CartContext";
// import "../App.css";

// const CartBar = () => {
//   const { cartItems, removeFromCart, goToBooking } = useCart();
//   const [visible, setVisible] = useState(false);

//   // ✅ Animate bar & show toast only when an item is added
//   useEffect(() => {
//     if (cartItems.length > 0) {
//       setVisible(true);

//       const toast = document.createElement("div");
//       toast.innerText = "🛒 Item added to your cart!";
//       Object.assign(toast.style, {
//         position: "fixed",
//         bottom: "20px",
//         right: "20px",
//         background: "#198754",
//         color: "#fff",
//         padding: "10px 20px",
//         borderRadius: "8px",
//         fontWeight: "bold",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//         zIndex: "9999",
//         transition: "opacity 0.5s ease",
//       });
//       document.body.appendChild(toast);
//       setTimeout(() => {
//         toast.style.opacity = "0";
//         setTimeout(() => toast.remove(), 500);
//       }, 2000);
//     } else {
//       const timeout = setTimeout(() => setVisible(false), 300);
//       return () => clearTimeout(timeout);
//     }
//   }, [cartItems]);

//   if (!visible || cartItems.length === 0) return null;

//   return (
//     <div
//       className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 
//         bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl px-6 py-3 
//         flex items-center justify-between border border-gray-200 
//         w-[90%] max-w-2xl transition-all duration-500
//         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
//       `}
//       style={{ zIndex: 9999 }}
//     >
//       <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
//         {cartItems.map((item) => (
//           <span
//             key={item._id}
//             className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm mr-2 hover:bg-gray-200 transition-colors duration-200"
//           >
//             {item.image ? (
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-5 h-5 rounded-full mr-2"
//               />
//             ) : (
//               <span className="mr-2">🍳</span>
//             )}
//             {item.name} — ₹{item.price}
//             <button
//               onClick={() => removeFromCart(item._id)}
//               className="ml-2 text-red-500 hover:text-red-700 font-bold"
//             >
//               ×
//             </button>
//           </span>
//         ))}
//       </div>

//       <button
//         onClick={goToBooking}
//         className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-2 ml-4 rounded-full hover:scale-105 hover:from-yellow-400 hover:to-orange-400 transition-transform duration-300"
//       >
//         Proceed to Booking →
//       </button>
//     </div>
//   );
// };

// export default CartBar;
import React from 'react'

const CartBar = () => {
  return (
    <div>
      
    </div>
  )
}

export default CartBar
