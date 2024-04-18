import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navBar/navBar";  
import { getUser } from "../../services/api";
function RegisteredStudents() {
    const [details , setDetails ]= useState([]);
    const navigate = useNavigate();
    

    async function fetchData(){
      try{
        const data = await getUser();
        setDetails(data);
      }
      catch(err){
        if(err.name==="TypeError"){
          alert("Session Expired");
          navigate("/login");
        }
      }
        
    }
    useEffect(()=>{
          fetchData();
    },[])
    return (
        <div>
            <Navbar></Navbar>
            <table border="1" style={{borderCollapse:"collapse"}}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th colSpan={3}>Registered Courses</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        details.map((user)=>{
                            return user.courses.length>0 ? (<tr>
                                <td>{user.firstName} </td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                {user.courses.map((course)=><td>{course.title}</td>)}
                            </tr>) : null
                        })
                    }
                </tbody>
            </table>
            
        </div>
    );
}

export default RegisteredStudents;