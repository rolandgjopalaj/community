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

fetch("/user_data", request("")).then(res=>res.json().then(data=>{

    document.getElementById("username").innerText= data.user;
    document.getElementById("message").innerText= data.message;
    document.getElementById("data").innerText= data.data;
    document.getElementById("kot").innerText= data.kot;
    
}))

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
function post(user, date, _post)
{
    const post=
        '<div class="be-comment">'+
        '	<div class="be-img-comment">'+	
        '		<img src="userimg" alt="" class="be-ava-comment">'+
        '	</div>'+
        '	<div class="be-comment-content">'+
        '		<span class="be-comment-name">'+
        '			<h2>'+user+'</h2>'+
        '		</span>'+
        '		<span class="be-comment-time">'+
        '			<i class="fa fa-clock-o"></i>'+
        '			'+date+''+
        '		</span>'+
        '		<p class="be-comment-text">'+
        '		'+_post+''+
        '		</p>'+
        '	</div>'+
        '</div>';
    return post;
}

//html to create a comment
function comment(user, date, comment)
{
    const comm=
        '<div class="be-comment">'+
        '	<div class="be-img-comment">'+	
        '		<img src="userimg" alt="" class="be-ava-comment">'+
        '	</div>'+
        '	<div class="be-comment-content">'+
        '		<span class="be-comment-name">'+
        '			<h4>'+user+'</h4>'+
        '		</span>'+
        '		<span class="be-comment-time">'+
        '			<i class="fa fa-clock-o"></i>'+
        '			'+date+''+
        '		</span>'+
        '		<p class="be-comment-text">'+
        '		'+comment+''+
        '		</p>'+
        '	</div>'+
        '</div>';
    return comm;
}

//html to create a form
function commentForm(post)
{
    const commForm =
    '<br><br>'+
    '<form class="form-block" action="/addComment" method="post">'+
    '	<div class="col-xs-12">	'+								
    '		<div class="form-group">'+
    '           <input type="hidden" id="post" name="post" value="'+post+'">'+
    '			<textarea id="comm" name="comm" class="form-input" required="" placeholder="Your text"></textarea>'+
    '		</div>'+
    '	</div>'+
    '		<input type="submit" value="send" class="btn btn-primary pull-right">'+
    '	</div>'+
    '</form>';
    return commForm
}


const startNewPostArea = '<div class="be-comment-block">';
const startNewComentsArea = '<div class="be-comment-block">';


//html to add the posts and the comments in the user page
function addSharedData(sharedData)
{
    var newArea="";
    const posts=sharedData[0]
    const comments=sharedData[1]

    posts.forEach(postEl => {   //for each post
      
        newArea = newArea +
            startNewPostArea+  //add the start post html code
            post(postEl.name,"dd",postEl.content)+   //add the post html code
            startNewComentsArea; //add te start of the comments area html code

        const comms = comments.filter(el => el.post==postEl.id);

        console.log(comms)
        comms.forEach(commEl =>{  //for each comment
            newArea = newArea + comment(commEl.name,"date",commEl.content); //add the comment html code
        });
        
        newArea = newArea +commentForm(postEl.id)+ '</div></div>';//close the html code
    });

    //add all the html code
    document.getElementById("postsArea").innerHTML =newArea;

}