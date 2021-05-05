//to create a request 
const request ={
    method: "post",
    headers: {
        "Content-Type" : "application/json"
    },
    body: JSON.stringify({type: ""})
}

fetch("/user_data", request).then(res=>res.json().then(data=>{

    document.getElementById("username").innerText= data.user;
    document.getElementById("message").innerText= data.message;
    document.getElementById("data").innerText= data.data;
    document.getElementById("kot").innerText= data.kot;
    
}))

fetch("/shared_data", request).then(res=>res.json().then(data=>{
    
    document.getElementById("autor").innerText= data.autor;
    document.getElementById("coment").innerText= data.coment;
    
}))