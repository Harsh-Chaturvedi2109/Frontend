import { Drawer, Button, Menu } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navBar.css";
import { getUser } from "../../services/api";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("Authorization");
  const isAdmin = isLoggedIn && localStorage.getItem("Role").toLowerCase() === "admin";
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [details,setDetails] = useState([])

  async function fetchData(){
    try{
        const data = await getUser();
        if (data instanceof Error) {
            console.error("Error:", data.message);
            alert("Session Expired");
        } 
        else{
            setDetails(data);
        }
        
    }
    catch(err){
        console.log("Error",err);
    }
    
}
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    if(isLoggedIn && !isAdmin){
        fetchData();
      }
    

    handleResize(); 

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="navBar">
      {isMobile ? (
        <>
          <Button type="primary" onClick={() => setIsVisible(true)} className="drawer-button">
            <img src="https://www.svgrepo.com/show/506800/burger-menu.svg" alt="open" style={{ height: "30px", width: "30px" }} />
          </Button>
          <Drawer title="Links" placement="left" closable={false} visible={isVisible} onClose={() => setIsVisible(false)} className="ant-drawer-content">
            <div className="ant-drawer-body">
              <ul>
                <li>
                  <Link to="/Home" className="nav-Link" onClick={() => setIsVisible(false)}>Home</Link>
                </li>
                <li>
                  <Link to="/About" className="nav-Link" onClick={() => setIsVisible(false)}>About Us</Link>
                </li>
                <li>
                  <Link to="/welcome" className="nav-Link" onClick={() => setIsVisible(false)}>User Details</Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/search" className="nav-Link" onClick={() => setIsVisible(false)}>Search User</Link>
                  </li>
                )}
                <li>
                  <Link to="/Academic" className="nav-Link" onClick={() => setIsVisible(false)}>Academic</Link>
                </li>
                {!isAdmin && details.length > 0 && details[0] && details[0].courses.length > 0 && (
                    <li>
                      <Link to="/examRegistration" className="nav-Link" onClick={() => setIsVisible(false)}>Exam Registration</Link>
                    </li>
                )}
              </ul>
            </div>
          </Drawer>
        </>
      ) : (
      <div className="Navbar" style={{width: "100%"}}>
      
        <div>
        <Menu mode="horizontal">
          <Menu.Item key="home">
            <Link to="/Home" className="nav-Link">Home</Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link to="/About" className="nav-Link">About Us</Link>
          </Menu.Item>
          <Menu.Item key="userDetails">
            <Link to="/welcome" className="nav-Link">User Details</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="searchUser">
              <Link to="/search" className="nav-Link">Search User</Link>
            </Menu.Item>
          )}
          <Menu.Item key="academic">
            <Link to="/Academic" className="nav-Link">Academic</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="Add course">
                <Link to='/AddCourse' className="nav-Link">Add Course</Link>
            </Menu.Item>
          )}
          {!isAdmin && (
            <Menu.Item key="Select course">
                <Link to='/SelectCourse' className="nav-Link">Select Course</Link>
            </Menu.Item>
          )}
          {isAdmin&&(
            <Menu.Item key="Registered Students">
                <Link to='/RegisteredStudents' className="nav-Link">Registered Students</Link>
            </Menu.Item>
          )

          }
          {!isAdmin && details.length > 0 && details[0] && details[0].courses.length > 0 && (
            <Menu.Item key="Exam Registration">
              <Link to="/examRegistration" className="nav-Link">Exam Registration</Link>
            </Menu.Item>
          )}
          {!isAdmin && details.length > 0 && details[0] && details[0].isRegisteredForExam && (
            <Menu.Item key="Admit Card">
              <Link to="/admitCard" className="nav-Link">Admit Card</Link>
            </Menu.Item>
          )}
          {!isAdmin && (
            <Menu.Item key="Refrences">
              <Link to="/references" className="nav-Link">References</Link>
            </Menu.Item>
          )}
        </Menu>
        </div>
      </div>
      )}
    </div>
  );
}

export default Navbar;