import React from 'react'
import { useSelector } from 'react-redux'
import {Navigate, Route   } from 'react-router-dom'


const ProtectedRoute = ({isAdmin,component : Component , ...rest}) => {
    const {loading , isAuthenticated,user} = useSelector((state) => state.user)
  return (
    <>
       {!loading && ( 
       <Route
            {...rest}
            render = {(props)=>{
                if(!isAuthenticated){
                    return <Navigate to = "/login"/>;
                }
                if(isAdmin === true && user.role!=="admin"){
                  return <Navigate to = "/login"/>;
                }
                return <Component {...props}/>;
            }}
        />
        )}
    </>
  )
}

export default ProtectedRoute
