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
    
    document.getElementById("user1").innerText= data.autor;
    document.getElementById("coment").innerText= data.coment;
    
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
var div = document.createElement("div");

const newArea = startNewPostArea + 
                post("userr","dd","p1")+
                startNewComentsArea+
                comment("user","date","comm")+
                comment("user1","date2","comm2")+
                commentForm+
                '</div></div>';

div.innerHTML =newArea;

document.body.appendChild(div);