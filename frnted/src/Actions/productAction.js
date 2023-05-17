import axios from "axios"

import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    ADMIN_PRODUCT_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,

    ALL_REVIEW_REQUEST,
    ALL_REVIEW_SUCCESS,
    ALL_REVIEW_FAIL,
    
    CLEAR_ERRORS,
} from "../constants/productconsant";

export const getProduct=(keyword="",currentPage =1,price = [0,25000],category,rating = [0,5])=>async (dispatch)=>{
    try{
        dispatch({
            type:ALL_PRODUCT_REQUEST
        });
        let link = `/products/products?keyword=${keyword}&page=${currentPage}&price[gte] =${price[0]}&price[lte] = ${price[1]}&ratings[gte] = ${rating[0]}&ratings[lte]= ${rating[1]} `;

        if(category){
            link = `/products/products?keyword=${keyword}&page=${currentPage}&price[gte] =${price[0]}&price[lte] = ${price[1]}&category=${category}&ratings[gte] = ${rating[0]}&ratings[lte]= ${rating[1]}`;
        }
       
        const {data} = await axios.get(link);
        

        dispatch({
            type:ALL_PRODUCT_SUCCESS,
            payload:data,
        })

    }catch(error){
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload:error.response.data.message,
        })
    }
};


export const getAdminProduct = ()=>async(dispatch)=>{
    try{
        
        dispatch({type:ADMIN_PRODUCT_REQUEST});
        const {data} = await axios.get("/products/admin/products");
        
        

        dispatch({
            type:ADMIN_PRODUCT_SUCCESS,
            payload:data,
        });
    }catch(error){
        dispatch({
            type: ADMIN_PRODUCT_FAIL,
            payload:error.response.data.message,
        })
    }
}

export const getProductDetails=(id)=>async (dispatch)=>{
    try{
        dispatch({
            type:PRODUCT_DETAILS_REQUEST
        });
        
        const {data} = await axios.get(`/products/product/${id}`);

        

        dispatch({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data,
        })

    }catch(error){
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload:error.response.data.message,
        })
    }
};


//Create Product

export const createProduct = (productData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_PRODUCT_REQUEST });
  
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      
     

      const { data } = await axios.post(
        `/products/create`,
        productData,
        config
      );
  
      dispatch({
        type: NEW_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  };
  

//Delete product

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const { data } = await axios.delete(`/products/${id}`);

    

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};


//Update product

export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.patch(
      `/products/${id}`,
      productData,
      config
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};


//Create new Review
export const newReview = (reviewData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_REVIEW_REQUEST });
  
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  
      const { data } = await axios.put(`/products/review`, reviewData, config);
  
      dispatch({
        type: NEW_REVIEW_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: NEW_REVIEW_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Get All Reviews of a Product
export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEW_REQUEST });

    const { data } = await axios.get(`/products/reviews?id=${id}`);

    dispatch({
      type: ALL_REVIEW_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: ALL_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};



//Celaring errors
export const clearErrors =()=> async (dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS
    });
}