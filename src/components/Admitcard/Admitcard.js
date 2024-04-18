import { useEffect, useRef } from "react";
import Navbar from "../navBar/navBar";
import { getUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import generatePDF from "react-to-pdf";
function Admitcard() {
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const pdfComponent = useRef()
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <fieldset ref={pdfComponent}>
        <legend style={{ textAlign: "center" }}><h1>Admit Card</h1></legend>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th colSpan={5}>
                <h1>Excellent College of Engineering</h1>
              </th>
              <th colSpan={2} rowSpan={2}>
                <img
                  src="/OIG2.png"
                  alt="college logo"
                  style={{ height: "200px", width: "200px" }}
                ></img>
              </th>
            </tr>
            <tr>
              <th colSpan={5}>
                <h3> Department of Computer Science and Engineering </h3>
              </th>
            </tr>
            <tr>
              <th
                colSpan={7}
                style={{
                  borderRightStyle: "hidden",
                  borderLeftStyle: "hidden",
                  textAlign: "center",
                }}
              >
                {" "}
                <h3> Student's Personal Details </h3>{" "}
              </th>
            </tr>
            <tr>
              <th colSpan={2} rowSpan={2}>
                User profile pic <br></br>
                <img
                  src={details[0]?.profilePic}
                  alt="profile pic"
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                  }}
                />
              </th>
              <th rowSpan={1}>First Name</th>
              <th rowSpan={1}>{details[0]?.firstName}</th>
              <th>Last Name</th>
              <th>{details[0]?.lastName}</th>
            </tr>
            <tr>
              <th>Email</th>
              <th>{details[0]?.email}</th>
              <th>Age</th>
              <th>{details[0]?.age}</th>
            </tr>
            <tr>
              <th
                colSpan={7}
                style={{
                  borderRightStyle: "hidden",
                  borderLeftStyle: "hidden",
                  textAlign: "center",
                }}
              >
                <h3> Registered Courses </h3>{" "}
              </th>
            </tr>
            </thead>
        </table>
        <table border='1' style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
                <tr>
                    <th>S.No.</th>
                    <th>Exam Date</th>
                    <th>Course Name</th>
                    <th>Course Code</th>
                    <th>Credit</th>
                </tr>
            </thead>
            <tbody>
                {details[0]?.courses.map((course,index)=>(
                    <tr>
                        <td style={{textAlign:"center"}}>{index+1}</td>
                        <td style={{textAlign:"center"}}>10-05-2024</td>
                        <td style={{textAlign:"center"}}>{course.title}</td>
                        <td style={{textAlign:"center"}}>{course.courseCode}</td>
                        <td style={{textAlign:"center"}}>{course.credits}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <h3 style={{textAlign:"center"}}>Exam Details</h3>
        <h2>Exam Timing: 10:00 AM - 12:30 PM</h2>
        <h2>Exam Center : Excellent Institute of Technology,Indore</h2>
        <br></br>
        <br></br>
        <br></br>
        <h2 style={{textAlign:"right"}}>Student Signature</h2>
      </fieldset>
      <button onClick={()=>generatePDF(pdfComponent,{filename:"Admit Card"})}>Download Admit Card</button>
    </>
  );
}

export default Admitcard;
