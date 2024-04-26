import { useEffect, useState } from "react";
import Navbar from "../navBar/navBar";
import "./Search.css";
import { Spin } from "antd";
function Search() {


    useEffect(()=>{
      document.body.classList.add("search-body");

      return()=>{
        document.body.classList.remove("search-body");
      }
    })
    const[searchedDetails,setSearchedDetails] = useState([]);
    const[errorMessage,setErrorMessage] = useState("")
    const[searchText, setSearchText] = useState("")
    const[isLoading,setIsLoading] = useState(false);
    const[isSearched,setIsSearched] = useState(false);
    const[searchKey, setSearchKey] = useState("");

    //for handling Search

  function handleSearchChange(e){
    setErrorMessage("");
    setSearchText(e.target.value);
  }
  async function handleSearch(e){
    e.preventDefault();
    setIsLoading(true);
    if(searchText.trim()==='' && searchKey.trim()===''){
      setErrorMessage("Please Enter a text to search");
      return;
    }
    const URL = `https://backend-6tqr.onrender.com/user/search?key=${searchKey}&value=${searchText}`;
    const res = await fetch(URL,{
      method:"GET",
      headers:{
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`
      }
    })
    const data = await res.json();
    if(res.ok){
      console.log(data.user);
      const userDetails = data.user.map((user) => {
        const { _id, __v, ...rest } = user;
        return rest;
      });
      setSearchedDetails(userDetails);
      setIsLoading(false);
      setIsSearched(true);
      setSearchText("");

    
    }
    else{
      setErrorMessage(data.message)
    }
    
  }
  function handleBack(e){
    e.preventDefault();
    setIsSearched(false);
  }

  return (
    <div className="search">
     <Navbar></Navbar>
      <div className="search-form">
        <select
          onChange={(e) => {
            console.log(e.target.value);
            setSearchKey(e.target.value);
          }}
          defaultValue=""
        >
          <option hidden disabled value="">
            Search Criteria
          </option>
          <option id="email" value="email">
            email
          </option>
          <option id="fname" value="firstName">
            First Name
          </option>
          <option id="lname" value="lastName">
            Last Name
          </option>
          <option id="role" value="userRole">
            Role
          </option>
        </select>
        <input
          type="search"
          onChange={handleSearchChange}
          value={searchText}
          id="search"
        ></input>
        <button onClick={handleSearch}>Search</button>

        {isSearched && <button onClick={handleBack}>Back</button>}
      </div>
      {isSearched && isLoading && (<div>
        <Spin size="large" fullscreen={true}></Spin>
      </div>)}
      {isSearched && <div>
        <table border="1">
            <thead>
                <tr>
                    <th>S.No.</th>
                    <th>Profile Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>User Role</th> 
                </tr>
                
            </thead>
            <tbody>
               { searchedDetails.map((user,index)=>(
                <tr key={user.email}>
                    <td>
                        {index+1}
                    </td>
                    <td><img src={user.profilePic} style={{height:"50px", width:"50px"}} alt="profilePic"></img></td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.age}</td>
                    <td>{user.gender}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.userRole}</td>
                </tr>

               )

               )}
            </tbody>
        </table>
      </div>}
      {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
    </div>
  );
}

export default Search;
