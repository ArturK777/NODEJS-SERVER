var fs = require('fs');
var http = require('http');
var url = require('url');

var LIST = process.argv[2];
// READ LOCAL NODELIS.TXT 
var nodeList = fs.readFileSync(LIST,'utf-8').toString().split('\r\n');
var nodeArr = [];
var nodeTypes = [];
var nType = 0;
var nodes = 0;
for (j=0; j<nodeList.length; j++){
  var nodeStr = nodeList[j].split(";");
  if (nodeStr[0].substring(0,2)==='//' || nodeStr[0]==='') continue;
  else if (nodeStr[0].substring(0,1)==='#') {
    nodeTypes.push({"no":nType,"type":nodeStr[1],"count":0});
    if (nType>0) nodeTypes[nType-1].count=nodes;
    nType++;
    nodes = 0;
    continue;
  }
  nodeArr.push({
    "no" : j,
    "name": nodeStr[0],
    "url" : nodeStr[1],
    "port": nodeStr[2],
    "path": nodeStr[3],
    "user": nodeStr[4],
    "pass": nodeStr[5],
    "type": nType,
    "date": new Date().valueOf(),
    "id"  : '',
    "stat": -1
  });
  nodes++
}
nodeTypes[nType-1].count=nodes;
console.log(nodeTypes);
//  REQUEST HANDLER
function clientJS(response) {
  console.log("Request handler 'clientJS' was called.");
  response.write(fs.readFileSync("client.js"));
  response.end();
}
function start(response) {
  console.log("Request handler 'start' was called.");
  var body = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
//    '<script type="text/javascript" src="https://rawgit.com/caolan/async/master/lib/async.js"></script>'+
    '<script type="text/javascript" src="client.js"></script>'+
    '</head><body><div id="butt"></div>'+
    table()+
    '</body></html>';
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
}
//  DRAW TABLE
function table(){
  var shift=0
  var tabl = '<table border="1"><tbody><tr>'
  for (t=0;t<nodeTypes.length;t++){
    tabl += '<th>'+nodeTypes[t].type+' : '+nodeTypes[t].count+'</th>'+
    '<td><button onclick="check('+t+')">CHECK</button></td>';
  }
  tabl += '</tr><tr>';
  for (t=0;t<nodeTypes.length;t++){
//    var divLetter = String.fromCharCode(97+t);
    tabl += '<td colspan="2"><table><tbody div id=t'+t+'>';
    for (i=0; i<nodeTypes[t].count; i++) {
      tabl += '<tr><td>'+(i+shift)+'</td><td> '+nodeArr[i+shift].name+
      ' </td><td class="stat"><div id=a'+(i+shift)+'>---</div></td>'+
      ' <td><button onclick="butt('+(i+shift)+')">CHK</button>'+
      '</td></tr>'
    }
    tabl += '</tbody></table></td>'
    shift+=i;
   }   
  tabl += '</tr></tbody></table>';
  return tabl
}
//  NODE TYPES POLL
function typePoll(t, answer){
  answer.end();
}
//  NODE POLL
function nodePoll (i, answer){
  var opt = {
    hostname: nodeArr[i].url,
    port: nodeArr[i].port,
    path: nodeArr[i].path,
    auth: nodeArr[i].user+":"+nodeArr[i].pass,
//    agent:false
  };
  var reqNode = http.get(opt, function (response) {
    console.log(nodeArr[i].name+' onLine. Status: ' + response.statusCode+' - '+http.STATUS_CODES[response.statusCode]);
    nodeArr[i].stat = response.statusCode;
    answer.write(response.statusCode.toString());                               
    answer.end();
    reqNode.end();
  })
  reqNode.setTimeout( 5000, function(){
    console.log(' timeOut'+nodeArr[i].name);
    nodeArr[i].stat = 0;
    answer.write('0');
    answer.end();
    reqNode.end();
  });  
  reqNode.on('error', function() {
    console.log(nodeArr[i].name+' offLine');   
//  console.error;
    nodeArr[i].stat = 0;
    answer.write('0');
    answer.end();
    reqNode.end();
  })
}
//  ROUTER
var handle = {
  "/" : start,
  "/client.js" : clientJS
}
function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  if (sear=url.parse(pathname).search){
    var sear1=sear.slice(1);
    if (sear1.substring(0,1)==='t'){      // TYPE GROUP POLL
      var t=sear1.slice(1);
      console.log("CHECK TYPE "+t+' - '+nodeTypes[t].type);  
      typePoll(t,response)
    } else {                              // 1 NODE POLL
      console.log("Check node "+sear1+' - '+nodeArr[sear1].name+' '+nodeArr[sear1].url+':'+nodeArr[sear1].port);
      nodePoll(sear1,response);
    }  
  } else if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }
}
// SERVER 
function server(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).path;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }
  http.createServer(onRequest).listen(88);
  console.log("Server has started.");
}

server(route,handle);