NODEJS-SERVER
=============

NODEJS-SERVER is a simple "is alive" monitoring of local network.
It poll nodes (Roters, APs, Cameras, ...) by IP:PORT [user:pass] and put results on a single HTML page
Run: node server.js <nodelist.txt>, then go localhost:88 by browser.
NodeList is a .txt file containing nodes parameters.
Format of nodeList:
// - comment
#;Groupe name // required at least 1
NodeName;192.168.0.1;8096;index.html;admin;password
^Name   ;^local IP  ;^port;^page    ;^user;^pass
