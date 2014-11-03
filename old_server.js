
http.createServer(function (req, res) {
  var path = url.parse(req.url).path;
  var sear = url.parse(req.url).search;
  console.log(path, " - ", sear);
  if (path === '/'){
    for (k=0; k<nodeArr.length; k++){
//      nodePoll(k, res);
      res.write(nodeArr[k].name+' : '+nodeArr[k].stat.toString()+'<br>');
    }
//    res.write(nodeArr.toString());
    res.end();
//    for (y=0; y<nodeArr.length; y++){
//      console.log(nodeArr[0,[y]]);
//    }
  }
  else if (sear){
//    res.write(nodeArr[1].toString());
    res.write(nodeArr[1].name + ' : ');
    nodePoll(1,res);
    console.log(nodeArr[1].stat);
  }
})
.listen(8080);

