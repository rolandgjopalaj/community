//to create a request 
function request(type){
    const req ={
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({type: type})
    }
    return req
}

fetch("/nations", request("")).then(res=>res.json().then(data=>{
    addSharedData(data)
}))


function option(codice, nome)
{
    var x = '<option value="'+codice+'">'+nome+'</option>'
    return x
}


//html to add the nations 
function addSharedData(sharedData)
{
    var newArea='<select name="nazione" id="nazione">';
    
    sharedData.forEach(nation => {   //for each nation
        newArea = newArea + option(nation.codice, nation.nome)
    });

    newArea=newArea+'</select>';
    //add all the html code
    document.getElementById("nationsArea").innerHTML =newArea;

}