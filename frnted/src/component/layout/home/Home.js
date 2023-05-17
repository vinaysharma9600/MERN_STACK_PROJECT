import React,{useEffect} from 'react'
import "./Home.css"
import Product from "./Product.js"
import MetaData from '../MetaData';
import {clearErrors, getProduct} from "../../../Actions/productAction";
import {useSelector,useDispatch} from "react-redux"
import Loader from '../Loader/Loader';
import { useAlert } from 'react-alert';

export default function Home() {

  const alert = useAlert();
  
  

  const dispatch= useDispatch();
  const {loading ,error,products} = useSelector((state)=>state.products);
  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors);
    }
    dispatch(getProduct())
  },[dispatch,error,alert])
  return (
    <>
      {loading ?(<Loader/>):(
        <>
        <MetaData title="Stock Clear"/>
  
        <div className="banner">
          <p>Welcome to Stock Clear</p>
          <h1>Find Amazing Products</h1>
  
          <a href="#container">
              <button>
               Scroll 
              </button>
          </a>
        </div>
        <h2 className="homeHeading">Featured Product</h2>
        <div className="containerc" id='container
        '>
          {products && products.map((product)=> <Product key = {product._id} product ={product}/>)}
        </div>
        
      </>
      )}
    </>
  )
}
