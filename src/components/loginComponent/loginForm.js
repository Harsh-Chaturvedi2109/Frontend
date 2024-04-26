import { Link } from "react-router-dom";
import  "./loginForm.css";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { Spin } from "antd";

function Login() {

  const initialState ={
    email :"",
    password :""
}
const [loginForm, setLoginForm] = useState(initialState);
const[error,setError] = useState("");
const navigate = useNavigate();
const [loading,setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("loginForm-body");
    return () => {
        document.body.classList.remove("loginForm-body");
    };
}, []);
    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        console.log(loginForm);
        const response = await fetch("http://localhost:8080/login",{
            'method':'POST',
            body:JSON.stringify(loginForm),
            headers:{
                'Content-Type':'application/json'
            }
        })

        const data = await response.json();
        console.log(data);
        if(response.ok){
            localStorage.setItem("Authorization",data.token);
            localStorage.setItem("Role",data.role);
            setLoading(false);
            navigate('/Home');
        }
        else{
            setError(data.message);
            console.log("Error",data.err);
        }
    }
    function handleChange(e){
        console.log(e.target.name,e.target.value);
        setLoginForm({
            ...loginForm,
            [e.target.name]:e.target.value
        })
        setError("");
    }
  return (
    <div className="loginContainer" style={{backgroundColor:"black"}}>
      <div className="background">
        <div className="shape" />
        <div className="shape" />
      </div>
      {loading && (<div>
      <Spin size="large" fullscreen = {true}/>
      </div>)}
      <form onSubmit={handleSubmit}>
        <h3>Login Here</h3>
        <label htmlFor="email">Email</label>
        <input type="text" placeholder="Email" id="email" name="email" value={loginForm.email} onChange={handleChange} />
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" id="password" name="password" value={loginForm.password} onChange={handleChange} />
        <button>Log In</button>
        <div>
            Don't have an Account?<Link to="/">Register</Link>
        </div>
        {error && <p style={{ color: "white" }}>{error}</p>}
      </form>
      
    </div>
  );
}

export default Login;
