import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstant";

import axios from "axios";

//Add to cart
export const addItemsToCart = (id, quantity) => async (dispatch,getState) => {
  const { data } = await axios.get(`/products/product/${id}`);
 
  
  dispatch({
    type: ADD_TO_CART,
    payload:{ 
      product: data.data._id,
      name: data.data.name,
      price: data.data.price,
      image: data.data.images[0].url,
      stock: data.data.Stock,
      quantity,}
    
  });

  localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
};


//Remove From Cart

export const removeItemsFromCart = (id)=>async(dispatch,getState)=>{
  dispatch({
    type:REMOVE_CART_ITEM,
    payload:id,
  });
  localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
}

//Save Shipping Info

export const saveShippingInfo = (data)=> async(dispatch)=>{
  dispatch({
    type:SAVE_SHIPPING_INFO,
    payload:data,

  });
  localStorage.setItem("shippinInfo",JSON.stringify(data))
}