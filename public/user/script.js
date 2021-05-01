const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user')

document.getElementById("username").innerText= user;

//to create a request based on the type 
function request(type){
    const req ={
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({type: type})
    }
    return req;
}

fetch("/user_data", request("user-data")).then(res=>res.json().then(data=>{
    
    document.getElementById("message").innerText= data.message;
    document.getElementById("data").innerText= data.data;
    document.getElementById("kot").innerText= data.kot;
    
}))

fetch("/shared_data", request("shared-data")).then(res=>res.json().then(data=>{
    
    document.getElementById("autor").innerText= data.autor;
    document.getElementById("coment").innerText= data.coment;
    
}))