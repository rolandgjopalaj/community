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
    console.log(data)
    addSharedData(data)
}))

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
        '			<h2>'+user+'</h2>'+
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
const commentForm =
    '<br><br>'+
    '<form class="form-block">'+
    '	<div class="col-xs-12">	'+								
    '		<div class="form-group">'+
    '			<textarea class="form-input" required="" placeholder="Your text"></textarea>'+
    '		</div>'+
    '	</div>'+
    '		<input type="submit" value="send" class="btn btn-primary pull-right">'+
    '	</div>'+
    '</form>';


const startNewPostArea = '<div class="be-comment-block">';
const startNewComentsArea = '<div class="be-comment-block">';


//html to add the posts and the comments in the user page
function addSharedData(sharedData)
{
    var newArea="";

    sharedData.forEach(postEl => {   //for each post
        newArea = newArea +
            startNewPostArea+  //add the start post html code
            post(postEl.author,"dd",postEl.post)+   //add the post html code
            startNewComentsArea; //add te start of the comments area html code

        const comm=postEl.comments; //get the comments of a post 
        comm.forEach(commEl =>{  //for each comment
            newArea = newArea + comment(commEl.user,"date",commEl.comment); //add the comment html code

        });
        
        newArea = newArea +commentForm+ '</div></div>';//close the html code
    });

    //add all the html code
    document.getElementById("postsArea").innerHTML =newArea;

}