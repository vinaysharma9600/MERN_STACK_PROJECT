import React from 'react'
import playstore from "../../../images/playstore.png"
import Appstore from "../../../images/Appstore.png"
import "./footer.css"
export default function footer() {
  return (
    <footer id="footer">

      <div className='leftFooter'>
        <h4>Download OUR APP</h4>
        <p>Download App for Android and Ios Mobile </p>
        <img src={playstore} alt="playstore" />
        <img src={Appstore} alt="Appstore" />
      </div>
      <div className='midFooter'>
        <h1>Stock Clear</h1>
        <p>Copyrights 2023 &copy; Stock Clear</p>
      </div>
      <div className='RightFooter'>
        <h2>Follow us </h2>
        <a href="/"><i className="fa-brands fa-instagram mx-2"></i>INSTAGRAM</a>
        <a href="/"><i className="fa-brands fa-facebook mx-2"></i>FACEBOOK</a>
        <a href="/"><i className="fa-brands fa-twitter mx-2"></i>TWITTER</a>
      </div>


    </footer> 
  )
}
