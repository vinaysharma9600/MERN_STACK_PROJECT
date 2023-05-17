import React,{useEffect} from 'react'
import SideNav from './SideNav.js';
import "./dashboard.css";
import {Link} from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";

import { getAdminProduct } from '../../Actions/productAction';
import { getAllOrders } from '../../Actions/orderAction.js';
import { getAllUsers } from '../../Actions/userAction.js';

const DashBoard = () => {
  
  let outofStock = 0;
  const dispatch = useDispatch();

  const {products} = useSelector((state)=>state.products);
  const {orders} = useSelector((state)=>state.allOrders);
  const {users} = useSelector((state)=>state.allUsers);




 products && 
    products.forEach((item)=>{
    if(item.Stock === 0){
      outofStock +=1;
    }
 });

 let totalAmount = 0;
 orders && orders.forEach((item)=>{
  totalAmount += item.totalPrice;
 })

 useEffect(()=>{
 
  dispatch(getAdminProduct());
  dispatch(getAllOrders());
  dispatch(getAllUsers());
},[dispatch]);

  const lineState = {
    labels:["Initial Amount","Amount Earned"],
    datasets:[
      {
        label:"TOTAL AMOUNT",
        backgroundColor:["green"],
        hoverBackgroundColor:["rgb(197,72,49)"],
        data:[0,totalAmount]
      },
    ]
  };
  console.log(outofStock);
  const doughnutState = {
    labels:["Out of Stock","inStock"],
    datasets:[
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outofStock,products.length - outofStock],
      },
    ]
  }

  return (
    <div className='dashboard'>
      <SideNav/>
      <div className='dashboardContainer'>
      <h1 >Dashboard</h1>
      <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br />{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        <div className="chart">
          <div className="lineChart">
            <Line data={lineState} />
          </div>

          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>

        </div> 
       

     

      </div>
    </div>
  )
}

export default DashBoard
