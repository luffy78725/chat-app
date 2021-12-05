import {createServer} from 'http';
import {parse} from 'url';
import { WebSocketServer } from 'ws';


const server = createServer();

const wss = new WebSocketServer({noServer: true});

const socketsLookuop = new Map();
const userList = [];

wss.on("connection", (ws , request) => {
 socketsLookuop.set(request.url.replace("/",""), ws);
 userList.push(request.url.replace("/",""))
 socketsLookuop.forEach((item) => {
   item.send(JSON.stringify({users :  userList}))
   
  })

 ws.on("message", (data) => {
   socketsLookuop.forEach((cl, i) => {
     if(ws == cl || JSON.parse(data.toString()).target == i)
     cl.send(data.toString())
   })
 })

})

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket,head, (ws) => {
        wss.emit('connection', ws ,request)
    })
})


server.listen(8080)
console.log("server is listening on port 8080")