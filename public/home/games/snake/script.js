let direction="right"; //set the start direction to right
let score=0;
//////////////
// Snake (x,y)
let x = [];
let y = [];

///////////////
//  FRUIT (x,y)
let xFruit = 300;
let yFruit = 300;

let snakeLen = 5;//the length of the snake

//the start position of the snake 
x[0] =40;
y[0] =100;

function setup()
{
    createCanvas(500, 500);
    frameRate(15); //to slow it down
    stroke("red");
    strokeWeight(10);
}

function draw()
{
    background(0);
    document.getElementById("lblScore").innerText=String("score "+score);//to show the score on the page
    
    point(xFruit, yFruit); //the fruit object
    
    for(i=0;i<snakeLen;i++)
    {
      line(x[i],y[i],x[i+1],y[i+1]); //the snake object
    }

    if(goControll()!=true)
    {
      headMove();
      fruitControll();
      bodyMove();
    }else{
      document.getElementById("GO").innerText=String("Game Over !!!!");
    }
}

/////////////////////////////////////
//     GAME OVER CONTROLL
function goControll()
{
  let gameover=false;
  if(x[0]>=500 || x[0]<=0 || y[0]>=500 || y[0]<=0)
  {
    direction="null";
    gameover=true;
  }
  for(i=2;i<snakeLen;i++)
  {
    if(x[0]==x[i] && y[0]==y[i])
    {
      direction="null";
      gameover=true;

    }
  }
  return gameover;
}

/////////////////////////////////////
//     FRUIT CONTROLL
function fruitControll()
{
  if(x[0]==xFruit && y[0]==yFruit)
  {
    xFruit=parseInt((Math.random()*48)+1)*10;
    yFruit=parseInt((Math.random()*48)+1)*10;
    snakeLen++;
    score++;
  }
}

/////////////////////////////////////
//      THE BODY MOVE
function bodyMove()
{
  let auxAX =x[0];
  let auxAY =y[0];

  for(i=0;i<snakeLen-1;i++)
  {
    let auxBX = x[i+1];
    let auxBY = y[i+1];

    x[i+1] = auxAX;
    y[i+1] = auxAY;

    auxAX = auxBX;
    auxAY = auxBY;
  }
}

/////////////////////////////////////
//      The HEAD MOVE
function headMove()
{
  switch(direction)
  {
    case "up": y[0]-=10;
    break;
    case "down": y[0]+=10;
    break;
    case "left": x[0]-=10;
    break;
    case "right": x[0]+=10;
    break;
    case "null":;
    break;
  }
}

/////////////////////////////////////
//         THE DIRECTION
document.onkeydown = function(e) { 
    switch (e.keyCode) { 
        case 37: 
        if (direction !== 'right') {
          direction = 'left';
        }
        break; 
        case 38: 
        if (direction !== 'down') {
          direction = 'up';
        }
        break; 
        case 39: 
        if (direction !== 'left') {
          direction = 'right';
        }
        break; 
        case 40: 
        if (direction !== 'up') {
          direction = 'down';
        }
        break; 
        case 80: alert("Press OK to continue");
        break;
    } 
  };

////////////////////////////////////////
//SET THE DIRECTION BY USING THE BUTTONS
btn=document.getElementById("btnUp");
btn.addEventListener("click",(e)=>{
    if(direction!=="down")
    {
        direction="up"
    }
})
btn=document.getElementById("btnRight");
btn.addEventListener("click",(e)=>{
    if(direction!=="left")
    {
        direction="right"
    }
})
btn=document.getElementById("btnLeft");
btn.addEventListener("click",(e)=>{
    if(direction!=="right")
    {
        direction="left"
    }
})
btn=document.getElementById("btnDown");
btn.addEventListener("click",(e)=>{
    if(direction!=="up")
    {
        direction="down"
    }
})