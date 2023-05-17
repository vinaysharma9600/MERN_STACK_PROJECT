import React from 'react'
import { Link } from 'react-router-dom'
import { Rating } from '@material-ui/lab';


export default function Product({product}) {
  const options={
       
    size:'small',
    value:product.ratings,
    readOnly:true,
    precision:0.5,

};
  return (
    <Link className='productCard' to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options}/>{" "}
        <span className='review mx-3'>({product.numofReviews} Reviews)</span>
      </div>
      <span className='price'>{`₹${product.price}`}</span>
    </Link>
  )
}
