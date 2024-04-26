//Imports
import { useEffect, useState, useRef } from "react";
import "./welcome.css";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd"; // for loader
import Popup from "reactjs-popup";
import Modal from "react-modal";
import generatePDF from "react-to-pdf"; // for downloading as PDF
import * as XLSX from "xlsx"; // for downloading as excel
import Navbar from "../navBar/navBar";
import { getUser } from "../../services/api";
//Welcome Function

function Welcome() {
  //Hooks
  const navigate = useNavigate();
  const pdfComponent = useRef(null);
  //States
  const [details, setDetails] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [image, setImage] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  //Specifically for pagination
  const recordsPerPage = 4;
  const last = currentPage * recordsPerPage;
  const first = last - recordsPerPage;
  const currentData = details.slice(first, last);
  const totalPage = Math.ceil(details.length / recordsPerPage);

  //Function for opening and closing Modal
  function handleEdit(user) {
    setIsEditModalOpen(true);
    setSelectedUser(user);
  }
  function handleCloseModal() {
    setIsEditModalOpen(false);
  }

  //For logout button
  

  // For handling the changes while editing
  function handleChange(e) {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  }
  //For update request from Modal
  async function handleSubmit(e) {
    e.preventDefault();
    const email = selectedUser.email;
    const URL = `https://backend-6tqr.onrender.com/user/${email}`;
    const response = await fetch(URL, {
      method: "PATCH",
      body: JSON.stringify(selectedUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + localStorage.getItem("Authorization"),
      },
    });
    console.log(response);
    const data = await response.json();
    if (response.ok) {
      alert("Updated Successfully,Refresh Once to see changes");
      handleCloseModal();
    } else {
      console.log(data.message);
    }
  }

  // for handling Profile pic submission
  function handleFileChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const image = reader.result;
      setImage(image);
    };
  }
  async function handleFileSubmit(e, email, close) {
    e.preventDefault();
    close();
    setIsLoading(true);
    const response = await fetch(
      `https://backend-6tqr.onrender.com/user/uploadProfilePic/${email}`,
      {
        method: "POST",
        body: JSON.stringify({ image }),
        headers: {
          Authorization: "Bearer" + " " + localStorage.getItem("Authorization"),
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      fetchData();
      setImage("");
    } else {
      alert(data.message);
    }
    setIsLoading(false);
  }

  // For handling delete functionality
  function handleCheckBox(e, email) {
    setErrorMessage("");
    setSuccessMessage("");
    if (e.target.checked) {
      setUsersToDelete([...usersToDelete, email]);
    } else {
      setUsersToDelete(
        usersToDelete.filter((userEmail) => userEmail !== email)
      );
    }
  }
  async function handleDelete(close) {
    console.log(usersToDelete);
    const URL = "https://backend-6tqr.onrender.com/user/deleteSelectedUser";
    const response = await fetch(URL, {
      method: "DELETE",
      body: JSON.stringify(usersToDelete),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + localStorage.getItem("Authorization"),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      setErrorMessage(data.message);
      close();
    } else {
      setSuccessMessage(data.message);
      fetchData();
      setUsersToDelete([]);
      close();
    }
    console.log(data);
  }

  // For fetching the user's Details

  async function fetchData() {
    try {
      setIsLoading(true);
      const data = await getUser();
      if (data instanceof Error) {
        console.error("Error:", data.message);
        throw data;
      }

      setIsLoading(false);
      setDetails(data);

      if (localStorage.getItem("Role") === "admin") {
        setIsAdmin(true);
      }
    } catch (err) {
      if (err.name === "TypeError") {
        alert("Session Expired");
        navigate("/login");
      } else {
        console.error("Error in fetchData:", err);
      }
    }
  }

  //For exporting as Excel
  function exportToExcel() {
    const filteredDetails = details.map(({ token, password, ...rest }) => {
      return rest;
    });
    const wb = new XLSX.utils.book_new();
    const ws = new XLSX.utils.json_to_sheet(filteredDetails);
    XLSX.utils.book_append_sheet(wb, ws, "User Details");
    XLSX.writeFile(wb, "user-details.xlsx");
  }
  // For handling pagination
  function handlePrev() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function handleNext() {
    if (currentPage !== totalPage) {
      setCurrentPage(currentPage + 1);
    }
  }
  useEffect(() => {
    document.body.classList.add("welcome-body");

    fetchData();

    return () => {
      document.body.classList.remove("welcome-body");
    };
  }, []);

  return (
    <>
      <Navbar></Navbar>
      {localStorage.getItem("Role").toLowerCase() === "admin" ? (<div ref={pdfComponent} className="welcome-component">        
        
        <p>Welcome, You are logged in {isAdmin && <span> as Admin</span>}</p>
        <br />
        

        <h2>User Details</h2>
        <div>
          {loading && (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <Spin size="large" fullscreen={true}  />
            </div>
          )}
          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Delete</th>
                <th>Profile Pic</th>
                <th>Edit Profile Pic</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>User Role</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user, index) => (
                <tr key={user.email}>
                  <td>{first + index + 1}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckBox(e, user.email)}
                    />
                  </td>
                  <td>
                    <img
                      src={user.profilePic}
                      alt="profilePic"
                      style={{ height: "70px", width: "70px", padding: "0px" }}
                    ></img>
                  </td>
                  <td>
                    <Popup
                      trigger={
                        <input type="file" onChange={handleFileChange}></input>
                      }
                      modal
                      nested
                    >
                      {(close) => (
                        <div>
                          <pre>Make selected image as profile pic?</pre>
                          <button
                            onClick={(e) =>
                              handleFileSubmit(e, user.email, close)
                            }
                          >
                            Yes
                          </button>
                          <button onClick={() => close()}>No</button>
                        </div>
                      )}
                    </Popup>
                  </td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.age}</td>
                  <td>{user.gender}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.userRole}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Popup
              trigger={<button className="delete-btn">Delete Selected</button>}
              modal
              nested
            >
              {(close) => (
                <div className="popup-overlay">
                  <div className="popup-content">
                    <pre>Are You Sure You want to delete Selected Entries?</pre>
                    <button onClick={() => handleDelete(close)}>Yes</button>
                    <button onClick={() => close()}>No</button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
          <div>
            <button
              className="download-btn pdf-btn"
              onClick={() =>
                generatePDF(pdfComponent, { filename: "user-details" })
              }
            >
              Convert To PDF
            </button>
            <button className="download-btn xlsx-btn" onClick={exportToExcel}>
              Download xlsx
            </button>
          </div>
          <div className="button-container">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="prev-btn"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPage}
              className="next-btn"
            >
              Next
            </button>
          </div>
          
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>) :(<div>
        <div className="user-profilePic">
          <img src={details[0]?.profilePic} alt="profilePic" className="image"></img>
        
          <div className="user-details">
        <Popup
                      trigger={
                        <input type="file" onChange={handleFileChange}></input>
                      }
                      modal
                      nested
                    >
                      {(close) => (
                        <div>
                          <pre>Make selected image as profile pic?</pre>
                          <button
                            onClick={(e) =>
                              handleFileSubmit(e, details[0].email, close)
                            }
                          >
                            Yes
                          </button>
                          <button onClick={() => close()}>No</button>
                        </div>
                      )}
                    </Popup>
          <div className="user-details-heading">
            <h1>Profile</h1>
          </div>
          <div className="user-details-body">
            <p>First Name: {details[0]?.firstName}</p>
            <p>Last Name: {details[0]?.lastName}</p>
            <p>Email: {details[0]?.email}</p>
            <p>Age : {details[0]?.age}</p>
            <p>Gender : {details[0]?.gender}</p>
            <p>Role : {details[0]?.userRole}</p>
            <p>Edit : <button onClick={()=>handleEdit(details[0])}>Edit</button></p>
          </div>
        </div>
        </div>
        
      </div>)}


      {isEditModalOpen && (
            <Modal
              isOpen={isEditModalOpen}
              onRequestClose={handleCloseModal}
              contentLabel="Edit Modal"
              ariaHideApp={false}
              className={"modal-content"}
            >
              <h2>Edit information</h2>
              <button onClick={handleCloseModal} className="close-btn">
                Close
              </button>
              <div>
                <form onSubmit={handleSubmit}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={selectedUser.firstName}
                    onChange={handleChange}
                  />{" "}
                  <br></br>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={selectedUser.lastName}
                    onChange={handleChange}
                  />{" "}
                  <br></br>
                  <label htmlFor="age">age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={selectedUser.age}
                    onChange={handleChange}
                  />{" "}
                  <br></br>
                  <label htmlFor="gender">Gender</label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={selectedUser.gender}
                    onChange={handleChange}
                  />
                  <br></br>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleChange}
                    disabled
                  />{" "}
                  <br></br>
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={selectedUser.phone}
                    onChange={handleChange}
                  />
                  <br></br>
                  <label htmlFor="userRole">Role</label>
                  <input
                    type="text"
                    id="userRole"
                    name="userRole"
                    value={selectedUser.userRole}
                    onChange={handleChange}
                  />{" "}
                  <br></br>
                  <button type="submit">Save</button>
                </form>
              </div>
            </Modal>
          )}
    </>
  );
}
export default Welcome;
