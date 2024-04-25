import { useEffect, useState } from "react"
import Navbar from "../navBar/navBar";
import Modal from "react-modal";
import "./Academic.css";
import {EmailShareButton,FacebookShareButton,WhatsappShareButton,WhatsappIcon,FacebookIcon,EmailIcon} from "react-share";
function Academic(){
    const [userDetails, setUserDetails] = useState([]);
    const[isModalOpen,setIsModalOpen] = useState(false);
    const[isShareModalOpen,setIsShareModalOpen] = useState(false);
    const[formData,setFormData] = useState({});
    const[addedDetails,setAddedDetails] = useState(false)
    const[show,setShow] = useState(false);
    const[currentPageUrl,setCurrentPageUrl] = useState(window.location.href);
    async function handleSubmit(e){
        try{
            e.preventDefault();
            if(show){
                setShow(false);
                return;
            }
            const res = await fetch(`https://backend-6tqr.onrender.com/user/academicDetails`,{
                method:"GET",
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
                }
            })
            const data = await res.json()
            setUserDetails(data.user);
            setShow(true);
            console.log(userDetails);
            console.log(userDetails[0]);
            console.log(userDetails[0].academicDetails[0])
            console.log(userDetails[0].academicDetails[0].higherSecondary.percentage)
        }
        catch(err){
            console.log(err);
        }
        
    }
    function handleAddDetails(e){
        setIsModalOpen(true);
    }
    function handleCloseModal(e){
        setIsModalOpen(false);
    }
    function handleChange(e){
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        })
        console.log(formData)
    }
    async function handleFormSubmit(e){
        try{
                e.preventDefault();
            const res = await fetch("https://backend-6tqr.onrender.com/user/addAcademicDetails",{
                method:"POST",
                body: JSON.stringify(formData),
                headers:{
                    Authorization: "Bearer" + " " + localStorage.getItem("Authorization"),
                    "Content-Type": "application/json",
                }
            })
            console.log("Response",res);
            const data = await res.json();
            console.log("Data",data)
            if(res.ok){
                await setIsModalOpen(false);
                alert("Details Added Successfully");
            }
            else{
                alert(data.message);
            }
            setAddedDetails(true);
            setFormData({});
        }
        catch(err){
            alert(err);
            console.log(err);
        }

        
    }

    function handleShareButton(e){
        setIsShareModalOpen(true);
    }
    function handleCloseShareModal(){
        setIsShareModalOpen(false);
    }

    function handleCopyURL(e){
        navigator.clipboard.writeText(currentPageUrl)
            .then(() => {
                alert('URL copied to clipboard!');
            })
            .catch((error) => {
                console.error('Failed to copy URL: ', error);
            });
    }
    useEffect(()=>{
        document.body.classList.add("academic-body");

        return()=>{
            document.body.classList.remove("academic-body");
        }
    })
    return(
        <div className="academic">
        <Navbar></Navbar>
            <button onClick={handleSubmit}>{show ? "Hide Details" : "Get Details"}</button>
            
            { show && userDetails.some(user => user.academicDetails.length > 0) && <div>
                <table border="1" style={{borderCollapse:"collapse"}}>
                    <thead>
                        <tr>
                            <th> S. No.</th>
                            <th> Name </th>
                            <th>H.S Percentage</th>
                            <th>H.S passing yr</th>
                            <th>S.S. percentage</th>
                            <th>S.S yr</th>
                            <th>F.O.S</th>
                            <th>Percentage</th>
                            <th>Passing Yr</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userDetails.map((user,index)=>(
                            <tr key={user.email}>

                                <td>{index+1}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.academicDetails[0]?.higherSecondary?.percentage || '-'}</td>
                                <td>{user.academicDetails[0]?.higherSecondary?.passingYear || '-'}</td>
                                <td>{user.academicDetails[0]?.seniorSecondary?.percentage || '-'}</td>
                                <td>{user.academicDetails[0]?.seniorSecondary?.passingYear || '-'}</td>
                                <td>{user.academicDetails[0]?.fieldOfStudy ||'-'}</td>
                                <td>{user.academicDetails[0]?.graduation?.percentage || '-'}</td>
                                <td>{user.academicDetails[0]?.graduation?.passingYear || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> }
            {userDetails.length!==0 && !userDetails.some(user => user.academicDetails.length > 0) && localStorage.getItem("Role").toLowerCase()==='employee' &&!addedDetails && <div>

                <p> Academic Details Not added yet , please add</p>
                <button onClick={handleAddDetails}>Add details </button>
            </div>}
            <div className="shareButton">
                <button onClick={handleShareButton}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmn69jO9diHFK9wCLlbvs7iZLVARvZejZiKEDO_x2rAg&s" alt="share" style={{width:"30px",height:"30px"}}></img>
                </button>
            </div>
            {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Add Details Modal"
            ariaHideApp={false}
            className={"modal-content"}
          >
            <div>
                <h2>Add Academic Details</h2>
                <button onClick={handleCloseModal} className="close-btn">
                Close
                </button>

                <form onSubmit={handleFormSubmit}>
                    <p>Higher Secondary</p> <br/>
                    <label htmlFor="HSPercent">Percentage</label>
                    <input type="number" id="HSPercent" onChange={handleChange} name="higherSecondary.percentage"></input>
                    <label htmlFor="HSyear">Passing Year</label>
                    <input type="number" id="HSyear" onChange={handleChange} name="higherSecondary.passingYear"></input>

                    <p>Senior Secondary </p> <br/>
                    <label htmlFor="SSPercent">Percentage</label>
                    <input type="number" id="SSPercent" onChange={handleChange} name="seniorSecondary.percentage"></input>
                    <label htmlFor="SSyear">Passing Year</label>
                    <input type="number" id="SSyear" onChange={handleChange} name="seniorSecondary.passingYear"></input>

                    <p> Graduation </p> <br/>
                    <label htmlFor="FOS">Field of Study</label>
                    <input type="text" id="FOS" onChange={handleChange} name="fieldOfStudy"></input>
                    <label htmlFor="ugPercent">Percentage</label>
                    <input type="number" id="ugPercent" onChange={handleChange} name="graduation.percentage"></input>
                    <label htmlFor="ugyear">Passing Year</label>
                    <input type="number" id="ugyear" onChange={handleChange} name="graduation.passingYear"></input>

                    <p>Post Graduation</p> <br/>
                    <label htmlFor="pgPercent">Percentage</label>
                    <input type="number" id="pgPercent" onChange={handleChange} name="postGraduation.percentage"></input>
                    <label htmlFor="pgYear">Passing Year</label>
                    <input type="text" id="pgYear" onChange={handleChange} name="postGraduation.passingYear"></input>

                    <br/>
                    <button>Submit</button>
                </form>
            </div>
          </Modal>
        )}

        {isShareModalOpen && (
            <Modal
            isOpen={isShareModalOpen}
            onRequestClose={handleCloseShareModal}
            contentLabel="Share Modal"
            ariaHideApp={false}
            className={"modal-content"}
            > 
                <h3 style={{textAlign:"center"}}>Share</h3>  
                <div style={{display:"flex",justifyContent:"center", }}>
                    <WhatsappShareButton url="https://web.whatsapp.com/" style={{margin:"15px"}}>
                        <WhatsappIcon size={32} round= {true} />
                    </WhatsappShareButton>

                    <FacebookShareButton url="https://www.facebook.com/" style={{margin:"15px"}}>
                        <FacebookIcon size={32} round= {true} />
                    </FacebookShareButton>
                    <EmailShareButton url="https://www.gmail.com/" style={{margin:"15px"}}>
                        <EmailIcon size={32} round= {true} />
                    </EmailShareButton>
                </div>
                <div >
                    <input type="text" value={currentPageUrl} readOnly style={{ width: "80%", marginBottom: "10px" }} />
                    <button onClick={handleCopyURL}>Copy URL</button>
                </div>
            </Modal>
        )}
        </div>
    )
}

export default Academic