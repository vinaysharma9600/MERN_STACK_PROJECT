import './App.css';

import Header from './component/layout/header/Header.js';
import { BrowserRouter as Router ,Routes, Route,Navigate} from 'react-router-dom';
import webfont from "webfontloader";
import React ,{useState}from 'react';
import Footer from './component/layout/footer/footer';
import Home from "./component/layout/home/Home.js";
import ProductDetails from './component/Product/ProductDetails.js'
import ProductPage from "./component/Product/ProductPage.js";
import Search from "./component/Product/Search.js";
import LoginSignup from './component/User/LoginSignup';
import store from "./store";
import { loadUser } from './Actions/userAction';
import UserOptions from "./component/layout/header/UserOptions.js";
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from './component/User/ResetPassword.js';

import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from 'axios';
import PaymentProceed from "./component/Cart/PaymentProceed.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js"

import DashBoard from "./component/admin/DashBoard.js"

import ProductList from "./component/admin/ProductList.js"
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from "./component/admin/UpdateProduct.js"
import OrderList from "./component/admin/OrderList.js"
import UpdateOrder from "./component/admin/UpdateOrder.js"
import UserLists from "./component/admin/UserLists.js";
import UpdateUser from "./component/admin/UpdateUser.js";
import ProductReviews from "./component/admin/ProductReviews.js"
import Contact from "./component/layout/Contact.js"
import About from "./component/layout/About.js"

function App() {

const {isAuthenticated,user} = useSelector(state=>state.user);

  
  const [stripeApiKey,setStripeApiKey] = useState("");

  async function getStripeApiKey(){
    const {data} = await axios.get("/payments/stripeApiKey");
    

    setStripeApiKey(data.stripeApiKey);
  }

  React.useEffect(()=>{
    webfont.load({
      google:{
        families:["Roboto","Droid Sans","chilanka"]
      }
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  },[])
  return (
   
    <Router>
       <Header/>
       {isAuthenticated && <UserOptions user = {user}/> }
       <Routes>
          <Route  path="/" exact element={<Home/>}/>
          <Route  path="/contact" exact element={<Contact/>}/>
          <Route  path="/about" exact element={<About/>}/>
          <Route  path="/product/:id" exact element={<ProductDetails/>}/>
          <Route  path="/products" exact element={<ProductPage/>}/> 
          <Route  path="products/:keyword" exact element={<ProductPage/>}/>
          <Route  path="/search" exact element={<Search/>}/>   
          {!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/password/update" exact element={<UpdatePassword/>}/>}
          {!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/account" exact element={<Profile/>}/>}
          {!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/me/update" exact element={<UpdateProfile/>}/>}
          {!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/shipping" exact element={<Shipping/>}/>}

          
           {!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/process/payment" exact element={<PaymentProceed stripeApiKey= {stripeApiKey}/>}/>}
           {!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/success" exact element={<OrderSuccess/>}/>}

           {!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/orders" exact element={<MyOrders/>}/>}

          <Routes>
            {!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/order/confirm" exact element={<ConfirmOrder/>}/>}{!isAuthenticated ? <Navigate to = "/login"/>:<ProtectedRoute  path="/order/:id" exact element={<OrderDetails/>}/>}
          </Routes>
            
          
         
          
          <Route  path="/password/forgot" exact element={<ForgotPassword/>}/>
          <Route  path="/password/resetpassword/:token" exact element={<ResetPassword/>}/>

          <Route  path="/login" exact element={<LoginSignup/>}/>
          <Route  path="/cart" exact element={<Cart/>}/>

          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/dashboard" exact element={<DashBoard/>}/>}

          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/products" exact element={<ProductList/>}/>}
          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/product" exact element={<NewProduct/>}/>}
          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/product/:id" exact element={<UpdateProduct/>}/>}
          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/orders" exact element={<OrderList/>}/>}
          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/order/:id" exact element={<UpdateOrder/>}/>}
          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/users" exact element={<UserLists/>}/>}

          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/user/:id" exact element={<UpdateUser/>}/>}
          {!isAuthenticated || user.role !=="admin" ? <Navigate to = "/login"/>:<ProtectedRoute isAdmin = {true} path="/admin/reviews" exact element={<ProductReviews/>}/>}
       </Routes>

       
        
       <Footer/>
    </Router>
   
  );
}

export default App;
