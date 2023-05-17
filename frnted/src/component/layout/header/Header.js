import React from "react";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Stock Clear</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse " id="navbarSupportedContent">
            <ul className="navbar-nav m-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active mx-2" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active mx-2" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active mx-2" to="/about">About us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active mx-2" to="/contact">Contact</Link>
              </li>
             

            </ul>
            <form className="d-flex">
              
            <Link className="btn btn-outline-success mx-2" to="/search"><i className="fa-solid fa-magnifying-glass"></i></Link>
            <Link className="btn btn-outline-success mx-2 " to="/login"><i className="fa-solid fa-user "></i></Link>
            <Link className="btn btn-outline-danger " aria-current="page" to="/cart"><i className="fa-solid fa-cart-shopping mx-3"></i></Link>

            </form>
            
          </div>
        </div>
      </nav>
    </>
  );
}
