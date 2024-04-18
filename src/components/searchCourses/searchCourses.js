import { useState } from "react";
import Navbar from "../navBar/navBar";

function SearchCourses(){

    const [query,setQuery]= useState("");
    const [results,setResults] = useState([]);
    async function handleSearch(e){
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/user/references?query=${query}`);
            const data = await response.json();
            console.log("Data",data);
            setResults(data.result);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }
    function trimUrlPrefix(url) {
        const prefixToRemove = "http://localhost:3000/url?q=";
        return url.startsWith(prefixToRemove) ? url.substring(prefixToRemove.length) : url;
    }
    function handleLinkClick(e, url) {
        e.preventDefault(); // Prevent default link behavior
        window.open(trimUrlPrefix(url), "_blank"); // Open the trimmed URL in a new tab
    }
    return(<>
            <Navbar></Navbar>
        <form onSubmit={handleSearch}>
            <input type="text" placeholder="Search courses" value={query} onChange={(e)=>setQuery(e.target.value)} name="search" />
            <button>Submit</button>
        </form>

        <ul>
                {results?.map((result, index) => (
                    <li key={index}>
                        <a href={result.url} onClick={(e) => handleLinkClick(e, result.url)} rel="noopener noreferrer">{result.title}</a>
                    </li>
                ))}
        </ul>
    </>)
}

export default SearchCourses;