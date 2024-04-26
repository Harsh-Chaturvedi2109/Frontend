import { useEffect, useState } from "react";
import Navbar from "../navBar/navBar";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/api";
function SelectCourse() {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([]);
    const [details, setDetails] = useState([]);
    const[selectedCourse,setSelectedCourse]= useState("");
    const[selectedCourses,setSelectedCourses]= useState([]);
    const[enrolledCourses,setEnrolledCourses] = useState([]);
    const[show,setShow] = useState(false);
    const[totalCredits,setTotalCredits] = useState(0);
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
    async function getAllCourses() {
        try {
            const res = await fetch("https://backend-6tqr.onrender.com/course/getAllCourses", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("Authorization")
                }
            });
            const data = await res.json();
            console.log(data.courses);
            setCourses(data.courses); 
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }
    async function handleEnroll(e){

        if(selectedCourses.length === 0){
            alert("Please select at least one course");
            return
        }
        try{
                const res = await fetch("https://backend-6tqr.onrender.com/course/enrollCourse", {
                method: "PATCH",
                body:JSON.stringify({courseCode:selectedCourses}),
                headers:{
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("Authorization")
                }
            })

            console.log("Response",res);
            const data = await res.json();
            if(!res.ok){
                alert(data.message);
            }
            alert(data.message);
            setSelectedCourses([]);
            setTotalCredits(0);
            setSelectedCourse("");
        }
        catch(err){
            console.log(err);

        }
        
    }

    async function getEnrolledCourses(){
        try{
            const res = await fetch("https://backend-6tqr.onrender.com/course/getEnrolledCourses", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("Authorization")
                }
            })
            const data = await res.json();
            console.log(data.enrolledCourses);
            setEnrolledCourses(data.enrolledCourses);
            setShow(true);
        }
        catch(err){
            console.log(err);
        }
    }
    function handleSelectCourse(e){
        if(selectedCourses.includes(selectedCourse)){
            alert("Course already selected");
            return;
        }
        const selectedCourseDetails = courses.find(course => course.courseCode === selectedCourse);
        const credits = selectedCourseDetails ? selectedCourseDetails.credits : 0;
        if (totalCredits + credits <= 24) {
            setSelectedCourses([...selectedCourses, selectedCourse]);
            setTotalCredits(totalCredits + credits);
        } else {
            alert("Total credits exceed 24. You cannot select more courses.");
        }
    }

    
    function handleRemoveCourse(courseToRemove){
        const courseDetails = courses.find(course => course.courseCode === courseToRemove);

        setTotalCredits(totalCredits-courseDetails.credits);
        setSelectedCourses(selectedCourses.filter((c) => c !== courseToRemove))
    }
    useEffect(() => {
        getAllCourses();
        getEnrolledCourses();
        fetchData();
    }, []);
    return (
        <>
            <Navbar />
            {enrolledCourses.length>0 ?  (<div>
                <h1> Courses already selected,see Enrolled Courses? </h1>
                <button onClick={getEnrolledCourses}>Enrolled Courses</button>
                {show && enrolledCourses.length>0 && <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Title</th>
                                    <th>Field</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrolledCourses.map((course) => (
                                    <tr key={course.courseCode}>
                                        <td>{course.courseCode}</td>
                                        <td>{course.title}</td>
                                        <td>{course.Field}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => setShow(false)}>Close</button>
                    </div>}
                </div>) :
                (
                    <div>
                            {details[0] && <div>
                        <p>First Name</p>
                        <input type="text" defaultValue={details[0].firstName} disabled></input>
                        <p>Last Name</p>
                        <input type="text" defaultValue={details[0].lastName} disabled></input>
                        </div>
                    }
                    <p>Select Courses</p>
                    <select defaultValue="" onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option disabled hidden value=''>Select Course</option>
                        {courses.map((course) => (
                            <option key={course.courseCode} value={course.courseCode}>{course.title}</option>
                        ))}
                    </select>
                    <br/>
                    <br/>
                    {selectedCourses.length> 0 && <div>
                        <p>Selected Courses</p> 
                        { selectedCourses.map((course) => (
                                <div key={course}>
                                    <input type="text" value={course} disabled></input>
                                    <button onClick={() => handleRemoveCourse(course)}>X</button>
                                    <br></br>
                                </div>
                            ))}
                    </div>
                        
                    }

                    <button onClick={handleSelectCourse}>Select Course</button>
                    <br/>
                    <br/>
                    <button onClick={handleEnroll}>Enroll Selected Courses</button>
                    <br/>
                    <br/>
                    
                    
                    {show && enrolledCourses.length===0 && <p>No Courses Enrolled</p>}

                    <p>Total Credits :{totalCredits}</p>
                    </div>
                )
            }
            


        </>
    );
}

export default SelectCourse;
