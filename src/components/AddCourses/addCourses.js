import { useState } from "react"
import Navbar from "../navBar/navBar";

function AddCourses(){
    const initialState = {
        title : "",
        courseCode : "",
        duration : "",
        Field : "",
        credits:""
    }
    const [formData,setFormData] = useState(initialState);
    function handleChange(e){
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const res = await fetch("https://backend-6tqr.onrender.com/course/addCourse",{
                method:"POST",
                body:JSON.stringify(formData),
                headers:{
                    "Content-Type":"application/json",
                    Authorization:"Bearer "+localStorage.getItem("Authorization")
                }
            })
            const data = await res.json();
            console.log(data);
            if(res.ok){
                console.log(data.message);
                alert('Course Added Successfully');
                setFormData(initialState);
            }
            else{
                alert(data.message);
            }
        }
        catch(err){
            console.log(err);
            alert(err);
        }
        

    }
    return(
        <>
            <Navbar></Navbar>
            <h1>Add Courses</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title of the Course</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}/>
                    <br/>
                    <br/>
                    <label htmlFor="courseCode">Code of the Course</label>
                    <input type="text" id="courseCode" name="courseCode" value={formData.courseCode} onChange={handleChange}/>
                    <br/>
                    <br/>
                    <label htmlFor="credits">Credits of the Course</label>
                    <input type="text" id="credits" name="credits" value={formData.credits} onChange={handleChange}/>
                    <br/>
                    <br/>
                    <label htmlFor="duration">Duration of the Course</label>
                    <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange}/>
                    <br/>
                    <br/>
                    <label htmlFor="Field">Course Field</label>
                    <input type="text" id="Field" name="Field" value={formData.Field} onChange={handleChange}/>
                    <br/>
                    <br/>
                    <button type="submit">Add Course</button>
                </form>
            </div>
        </>
    )
}

export default AddCourses