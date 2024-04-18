import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../navBar/navBar";
import "./Home.css";
function Home() {
  const isLoggedIn = !!localStorage.getItem("Authorization");
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const Interval = setInterval(()=>{
      setScrollPosition((prevPosition) => {
        return prevPosition >= 1600 ?  0 : prevPosition + 1;
      })
    },30);

    return () => clearInterval(Interval);
  },[]);
  function handleLoginBtnClick(e) {
    navigate("/login");
  }
  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ display: "flex", backgroundColor: "aliceblue" }}
      >
        <div className="logo" style={{ display: "flex" }}>
          <img
            src="/OIG2.png"
            alt="college logo"
            style={{ height: "100px", width: "100px" }}
          />
          <p style={{ fontFamily: "cursive" }}>
            Excellent College <br></br> Since 2000
          </p>
        </div>
        <div className="links" style={{ display: "flex" }}>
          <div className="dropdown" style={{ marginLeft: "500px" }}>
            <button className="dropbtn">
              <p> Admission </p>
            </button>
            <div className="dropdown-content row">
              <div className="dropdown-row">
                <div className="coloumn">
                  <h3>Programs offered</h3>
                  <a href="#">Undergraduate</a>
                  <a href="#">Postgraduate</a>
                  <a href="#">Diploma</a>
                  <a href="#">Doctral</a>
                  <a href="#">Fees Structure</a>
                </div>
                <div className="coloumn">
                  <h3>Additional Information</h3>
                  <a href="#">Student Review</a>
                  <a href="#">Scholarship</a>
                  <a href="#">Apply Now</a>
                  <a href="#">How to apply</a>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown" style={{ marginLeft: "50px" }}>
            <button className="dropbtn">
              <p> Placements </p>
            </button>
            <div className="dropdown-content row">
              <div className="dropdown-row">
                <div className="coloumn">
                  <h3>Overview</h3>
                  <a href="#">Placement Overview</a>
                  <a href="#">MileStone Package</a>
                  <a href="#">Placement Statistics</a>
                  <a href="#">Recruiters</a>
                  <a href="#">Placement calender</a>
                </div>
                <div className="coloumn">
                  <h3>Placement Support</h3>
                  <a href="#">Skills Enhancement </a>
                  <a href="#">Counselling</a>
                  <a href="#">FAQ</a>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown" style={{ marginLeft: "50px" }}>
            <button className="dropbtn">
              <p> Faculties </p>
            </button>
            <div className="dropdown-content row">
              <div className="dropdown-row">
                <div className="coloumn">
                  <h3>Faculties </h3>
                  <a href="#">Faculties of engineering </a>
                  <a href="#">Faculties of Management</a>
                  <a href="#">Faculty of Pharmacy</a>
                  <a href="#">Faculty of law</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!isLoggedIn && <button onClick={handleLoginBtnClick}>Login</button>}
      </div>

      <div
        style={{
          backgroundImage: "url(/university.jpeg)",
          backgroundSize: "cover",
          height: "800px",
          width: "100%",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            paddingTop: "70px",
            fontFamily: "revert-layer",
            fontSize: "50px",
          }}
        >
          TAKE THE FIRST STEP TOWARDS BRIGHT CAREER
        </h1>
        <br></br>
        <h1
          style={{
            textAlign: "center",
            fontFamily: "revert-layer",
            fontSize: "50px",
          }}
        >
          ADMISSION OPEN <br></br> 2024-25{" "}
        </h1>
      </div>
      <div className="scroll-container">
          <div className="scroll-element"  style={{ transform: `translateX(${scrollPosition}px)` }}>
            <div className="scroll-image">
              <img src="/Trophy.png" alt="trophy Image" />
              <h3 style={{textAlign:"center"}}>Ranked 1</h3>
              <p style={{textAlign:"center"}}>Number 1 by NAAC</p>
            </div>
            <div className="scroll-image">
              <img src="/Star.png" alt="Star Image" />
              <h3 style={{textAlign:"center"}}>Ranked 1</h3>
              <p style={{textAlign:"center"}}>Amongst Top Private universities</p>
            </div>
            <div className="scroll-image">
              <img src="/Medal.png" alt="Medal Image" />
              <h3 style={{textAlign:"center"}}>Ranked 1</h3>
            </div>
            <div className="scroll-image">
              <img src="/Award.png" alt="Award Image" />
              <h3 style={{textAlign:"center"}}>Ranked 1</h3>
            </div>

            <div className="scroll-image">
              <img src="/Arrow.png" alt="Arrow Image" />
              <h3 style={{textAlign:"center"}}>Ranked 1</h3>
              <p style={{textAlign:"center"}}>In All India Placements</p>
            </div>

          </div>

      </div>
    </>
  );
}

export default Home;
