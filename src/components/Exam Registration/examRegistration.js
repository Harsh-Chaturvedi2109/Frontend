import Navbar from "../navBar/navBar"
import { useEffect, useState } from "react";
import { getUser } from "../../services/api"; 
import {Link, useNavigate } from "react-router-dom";
import { Spin } from "antd";
function ExamRegistration(){
    const navigate = useNavigate();
    const[details,setDetails] = useState([]);
    const[selectedCourses,setSelectedCourse] = useState([]);
    const[isRegistered, setIsRegistered] = useState(false);
    const[isLoading, setIsLoading] = useState(false);
    async function fetchData() {
        try {
            const data = await getUser();
            if (data instanceof Error) {
                console.error("Error:", data.message);
                throw data;
            }
            setDetails(data);
            
        } catch (err) {
            if (err.name === "TypeError") {
                alert("Session Expired");
                navigate("/login");
            } else {
                console.error("Error in fetchData:", err);
            }
        }
    }
    

    function handleCheckBoxChange(e,course){
        if(e.target.checked){
            setSelectedCourse([...selectedCourses,course.courseCode]);
        }
        console.log(selectedCourses);
    }
    async function handleRegister(){

        try{
            if(details[0].courses.length!== selectedCourses.length){
                alert("Please select all courses");
                return;
            }
            else{
                setIsLoading(true);
                const res = await  fetch("http://localhost:8080/user/registerForExam",{
                    method:"POST",
                    headers:{
                        Authorization: "Bearer" + " " + localStorage.getItem("Authorization"),
                    }
                })
                if(res.ok){
                    const data = await res.json();
                    alert(data.message);
                    setIsRegistered(true);
                    setIsLoading(false);
                }
    
            }

        }
        catch(err){
            console.log("Error",err);
        }
        
    }

    useEffect(()=>{
        fetchData();   
    },[])
    return(
        <>
            <Navbar></Navbar>
            {isLoading && (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <Spin size="large" />
            </div>
          )}
            {details.length>0 && !details[0].isRegisteredForExam && !isRegistered ? (<div>

            <h1 style={{textAlign:"center"}}> Exam Registration</h1>
            <h4>First Name : {details[0]?.firstName}</h4>
            <h4>Last Name : {details[0]?.lastName}</h4>
            <h4>Email : {details[0]?.email}</h4>

            <h2>Registered Course</h2>
            <table border="1" style={{borderCollapse:"collapse"}}>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Select Course</th>
                        <th>Course Name</th>
                        <th>Course Code</th>
                        <th>Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {details[0]?.courses.map((course,index)=>(
                        <tr>
                            <td>{index+1}</td>
                            <td><input type="checkbox" onChange={(e)=>handleCheckBoxChange(e,course)}></input> </td>
                            <td>{course.title}</td>
                            <td>{course.courseCode}</td>
                            <td>{course.credits}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleRegister}>Register</button>
            </div>)
            : (<div>
                <h1 style={{textAlign:"center"}}>You are already registered for exam</h1>
                <h1>Print Admit Card?</h1>
                <Link to="/admitCard"><button>Admit Card</button></Link>
            </div>)}
        </>
    )
}

export default ExamRegistration