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
/*
fetch("/user_data", request("")).then(res=>res.json().then(data=>{

    document.getElementById("username").innerText= data.user;
    document.getElementById("message").innerText= data.message;
    document.getElementById("data").innerText= data.data;
    document.getElementById("kot").innerText= data.kot;
    
}))*/

async function getSharedData()
{
    var sharedData=[]
    await fetch("/posts", request("")).then(res=>res.json().then(data=>{
        sharedData.push(data)
    }))
    await fetch("/comments", request("")).then(res=>res.json().then(data=>{
        sharedData.push(data)
    }))
    addSharedData(sharedData)
}
getSharedData()


/////////////////////////////////
//           HTML
//html to create a post
function post(user, date, post_, userimg)
{
    const post=
    '<div class="card gedf-card">'+
    '    <div class="card-header">'+
    '        <div class="d-flex justify-content-between align-items-center">'+
    '            <div class="d-flex justify-content-between align-items-center">'+
    '                <div class="mr-2">'+
    '                    <img class="rounded-circle" width="45" src="'+userimg+'" alt="">'+
    '                </div>'+
    '                <div class="ml-2">'+
    '                    <div class="h5 m-0">'+user+'</div>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="card-body">'+
    '        <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>Date , time</div>'+
    '       <p class="card-text">'+post_+
    '        </p>'+
    '        <hr class="line">'+
    '       Comments: 90'+
    '       <hr class="line">'
    return post;
}

//html to create a comment
function comment(user, date, comment, userimg)
{
    const comm=
        '<div class="text-muted h7 mb-2">'+
        '    <i class="fa fa-clock-o"></i>'+
        '    <img class="rounded-circle" width="45" src="'+userimg+'" alt=""> &nbsp; '+
        user+' Date , time'+
        '</div>'+
        '<p class="card-text postDiv">'+
        comment+
        '</p>'
    return comm;
}

//html to create a form
function commentForm(post)
{
    const commForm =
    '<form action="" class="card-body" action="/addComment" method="post">'+
    '   <textarea class="form-control" id="comm" name="comm" rows="3" placeholder="What are you thinking?"></textarea>'+
    '   <input type="hidden" id="post" name="post" value="'+post+'">'+
    '   <br>'+
    '   <button type="submit" class="btn btn-primary">Comment</button>'+
    '</form>'
    return commForm
}

const startNewComentsArea = '<div class="card-body2">';


//html to add the posts and the comments in the user page
function addSharedData(sharedData)
{
    var newArea="";
    const posts=sharedData[0]
    const comments=sharedData[1]
    posts.forEach(postEl => {   //for each post
      
        newArea = newArea +
            post(postEl.name,"dd",postEl.content,postEl.photo)+   //add the post html code
            startNewComentsArea; //add te start of the comments area html code

        const comms = comments.filter(el => el.post==postEl.id);

        console.log(comms)
        comms.forEach(commEl =>{  //for each comment
            newArea = newArea + comment(commEl.name,"date",commEl.content, commEl.photo); //add the comment html code
        });
        
        newArea = newArea + '</div>'+commentForm(postEl.id)+'</div></div><br>';//close the html code
    });

    //add all the html code
    document.getElementById("postsArea").innerHTML =newArea;

}