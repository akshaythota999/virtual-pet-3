//Create variables here
var dog,happydog,database,foodS,foodstock,realdog;
var fedTime,lastFed1,foodObj,readingGameState,changingGameState;
var bedroom,garden,washroom,bedroomimg,gardenimg,washroomimg,dogimg2;
function preload()
{
  dog=loadImage("images/dogImg.png")
  happydog=loadImage("images/dogImg1.png")
  gardenimg=loadImage("Garden.png")
  washroomimg=loadImage("Wash Room.png")
  bedroomimg=loadImage("Bed Room.png")
  dogimg2=loadImage("deadDog.png")
	//load images here
}

function setup() {
  createCanvas(500,500);
  garden=addImage("gardenimg")
  bedroom=addImage("washroomimg")
  washroom=addImage("bedroomimg")
  realdog=createSprite(250,250,50,50)
  realdog.scale=0.5;
  realdog.addImage(dog)
  database=firebase.database()
  readingGameState=database.ref('gameState')
  readingGameState.on("value",function(data){
    gameState=data.val();
  })
  fedTime=database.ref('feedtime')
  fedTime.on("value",function(data){
    lastFed1=data.val();
  })
  foodstock=database.ref('food')
  foodstock.on("value",readStock)
  foodobj = new Food1()
}


function draw() {  
  background(46,139,87);
  var button=createButton("add food")
    button.position(130,80)
    button.mousePressed(addFood)
  var button1=createButton("feed dog")
    button1.position(130,110)
  if(gameState!="hungry"){
    button.hide();
    button1.hide();
    dog.remove();
  }else{
    button.show();
    button1.show();
    dog.addImage("dogimg2")
  }
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    changingGameState("playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    changingGameState("sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    changingGameState("bathing");
    foodObj.washroom();
  }else{
    changingGameState("hungry");
    foodObj.display();
  }
  text("note:press up arrow to feed dog!")
  textSize(20)
  
  display();
  drawSprites();
  //add styles here

}
function readStock(data){
  foodS=database.val();
}
function writeStock(x){
  if(x<=0){
    x=0
  }else{
    x=x-1;
  }
  database.ref('/').update({
    food:x
  })
}
function addFood(){
  foodS++;
  database.ref('/').update({Food:foodS
  })
}
function feedDog(){
  realdog.addImage("happydog")
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedtime:hour()
  })
}

