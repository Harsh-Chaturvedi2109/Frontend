export async function getUser() {
    console.log("Get user called")
    try{
        const response = await fetch("http://localhost:8080/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        },
      });
      const data = await response.json();
      console.log("DATA",data);
        const userDetails = data.doc.map((user) => {
            const { _id, __v, ...rest } = user;
            console.log(rest.courses);
            return rest;
          });
          return userDetails;
      
    }
    catch(err){
      if(err.name==="TypeError"){
        console.log("Error",err);
      };
      throw err;
    }
    
  }