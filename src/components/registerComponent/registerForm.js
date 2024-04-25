import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./registerForm.css";

function Register() {
  const initialState = {
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    phone: "",
    userRole: "",
  };
  useEffect(() => {
    document.body.classList.add("registerForm-body");
    return () => {
        document.body.classList.remove("registerForm-body");
    };
  }, []);
  const [form, setForm] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  
  
  async function handleSubmit(e) {
    e.preventDefault();
    const URL = "https://backend-6tqr.onrender.com/user";
    const response1 = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response1.json();
    console.log(data);
    if (response1.ok) {
      setSuccessMessage("Registration successful!");
      setForm(initialState);
    } else {
      setErrorMessage(data.message || "An error occurred during registration.");
    }
    setForm(initialState);

  }
  return (
    <>
     
      <div className="registerForm">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} >
          
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            onChange={handleChange}
            value={form.firstName}
          ></input>
          <br />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            onChange={handleChange}
            value={form.lastName}
          ></input>
          <br />
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            onChange={handleChange}
            value={form.age}
          ></input>
          <br />
          <label htmlFor="gender">Gender</label>
          <input
            type="text"
            id="gender"
            name="gender"
            onChange={handleChange}
            value={form.gender}
          ></input>
          <br />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={form.email}
          ></input>
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={form.password}
          ></input>
          <br />
          <label htmlFor="phone">phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            onChange={handleChange}
            value={form.phone}
          ></input>
          <br />
          <label htmlFor="userRole">Role</label>
          <input
            type="text"
            id="userRole"
            name="userRole"
            onChange={handleChange}
            value={form.userRole}
          ></input>
          <br />
          <button>submit</button>
          <p style={{color:"white"}}> Already Registered? <Link to="/login">login </Link> </p>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        
      </div>
    </>
  );
}
export default Register;
