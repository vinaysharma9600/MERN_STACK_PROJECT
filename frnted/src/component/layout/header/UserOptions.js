import React from 'react'
import "./header.css";
import { SpeedDial,SpeedDialAction } from '@material-ui/lab';
import  DashboardIcon from '@material-ui/icons/Dashboard';
import Backdrop  from '@material-ui/core/Backdrop';
import PersonIcon  from '@material-ui/icons/Person';
import  ExitToAppIcon  from '@material-ui/icons/ExitToApp';
import  ListAltIcon  from '@material-ui/icons/ListAlt';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { logout } from '../../../Actions/userAction';
import { useDispatch , useSelector} from 'react-redux';
import  ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const UserOptions = ({user}) => {
    const [open,setOpen] = useState(false);

    const {cartItems} = useSelector((state)=>state.cart);

    let navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

    function dashboard(){
      navigate("/admin/dashboard");
    }
    function orders(){
      navigate("/orders");
    }
    function account(){
      navigate("/account");
    }
    function cart(){
      navigate("/cart");
    }
    function logoutUser(){
      dispatch(logout());
      alert.success("Logout Successfully");
    }

    const options = [
      {icon :<ListAltIcon/>, name:"Orders",func:orders},
      {icon:<PersonIcon/>,name:"Profile",func:account},
      {icon:<ShoppingCartIcon style={{color:cartItems.length > 0? "green":"unset"}} />,name:`${cartItems.length}`,func:cart},  

      {icon:<ExitToAppIcon/>,name:"Logout",func:logoutUser},
    ];

    if(user.role ==="admin"){
      options.unshift( {icon:<DashboardIcon/>,name:"Dashboard",func:dashboard})
    }

  return (
    <>
        <Backdrop open={open} style={{zIndex:"10"}}/>
        <SpeedDial
            ariaLabel='SpeedDial tooltip example'
            onClose={()=>setOpen(false)}
            onOpen = {()=>setOpen(true)}
            style={{zIndex: "11"}}
            open = {open}
            direction='down'
            icon = {<img className='speedDialIcon' src = {user.profileImage.url?user.profileImage.url:"/Profile.png"} alt = "Profile"/>}
            alt = "Profile"
            className='speedDial'
        >
            {options.map((item)=>(
               <SpeedDialAction 
               key={item.name}
               icon ={item.icon}  tooltipTitle = {item.name}
               onClick={item.func}
               tooltipOpen = {window.innerWidth<=600?true:false}/>
            ))}
        </SpeedDial>
    </>
  )
}

export default UserOptions
