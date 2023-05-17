import React, { useState } from "react";
import "./Contact.css"

const Contact = () => {
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [address, setAddress] = useState("");
const [mobile, setMobile] = useState("");
const [message, setMessage] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the form data here
    // ...

    // Show an alert message
    window.alert("Thank you for submitting the form. We will contact you soon.");

    // Reset the form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setAddress("");
    setMobile("");
    setMessage("");
};
    return (
        <div className="my-form" >
            <form onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        aria-label="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        aria-label="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="col-12">
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail4"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="col-12">
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword4"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="col-12">
                    <input
                        type="text"
                        className="form-control"
                        id="inputAddress"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="col-12">
                    <input
                        type="number"
                        className="form-control"
                        id="inputMobile"
                        placeholder="Mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">
                        Message
                    </label>
                    <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </form>
        </div>
    )
}

export default Contact
