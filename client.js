//  'async.apply(alert,"xt");
function chDiv(id,text) {
  document.getElementById(id).innerHTML=text;
}
//  GET STATUS OF ALL NODES 
function checkAll(){
  var nodes1=document.getElementsByClassName("stat").length;
//  var timer = window.setInterval(function(){
//    if( k == nodes1 ){
//      window.clearInterval( timer );
//      chDiv("butt","<button onclick='k=0;checkAll()'>Check all</button> Checked at : "+Date());
//      return;
//    }
//    document.getElementById("a"+k).setAttribute("style","background-color:white")
//  },100);
  var timer = window.setInterval(function(){
    if( k == nodes1 ){
      window.clearInterval( timer );
      chDiv("butt","<button onclick='k=0;checkAll()'>Check all</button> Checked at : "+Date());
      return;
    }
    chDiv("butt","cheking..."+(k+1));
    butt(k);
    k++
  },100);
}
//  GET STATUS OF TYPE NODES 
function check(t){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET",window.location.protocol+"//"+window.location.host+"/?t"+t,false);
  xmlHttp.send(null);
};
// GET STATUS OF 1 NODE
function butt(i){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET",window.location.protocol+"//"+window.location.host+"/?"+i,false);
  xmlHttp.send(null);
  document.getElementById("a"+i).innerHTML=xmlHttp.responseText;
// CHANGE STATUS COLOR 
  if (parseInt(xmlHttp.responseText)<1) {
    document.getElementById("a"+i).setAttribute("style","background-color:red")
  } else {
    document.getElementById("a"+i).setAttribute("style","background-color:green") 
  };
};
//butt.async="true";
window.onload = function(){
  chDiv("butt",'<button onclick=\'k=0;checkAll()\'>Check all</button>');
};