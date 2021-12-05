let userList = []
    let reciepient = null;
    let chatRecord = {}
    const currentUser = prompt("Enter user user name")
    const ws = new WebSocket(`ws://127.0.0.1:8080/${currentUser}`)

    ws.onopen = function(){
        console.log("connected")
    }

    ws.onmessage = function(event){
      console.log("event data on message", event)
      const data = JSON.parse(event.data)
      if(data.hasOwnProperty("users")){
        userList = data.users;
        createChatRecordlookup()
        creatUserListDoms(data.users)
      }
      else {
        let chatSpace = document.getElementById("messages")
        let messageEle = document.createElement("p");
        const timestamp = event.timeStamp;
        data.sender == currentUser ?  chatRecord[data.sender].record.push({msg : data.message, timestamp, reciepient: data.target}) : chatRecord[data.sender].record.push({msg : data.message, timestamp});
        messageEle.style = data.sender == currentUser ? "margin:2px;padding: 2px;text-align: right;vwidth: 95%;" : "margin:2px;padding: 2px;text-align: left;vwidth: 95%;"
        messageEle.innerText = data.message
        chatSpace.appendChild(messageEle)
        console.log("chatrecord", chatRecord)
      }
    }

    function creatUserListDoms(listData){
     let userlistEle = document.getElementById("user-list");
     userlistEle.innerHTML = ""
     listData.forEach(element => {
        let userElement = document.createElement("li");
        userElement.innerText = element;
        userlistEle.appendChild(userElement)
        userElement.style = "list-style : none; padding : 10px; background: grey;color: white;width: 100px;border-bottom: 1px solid white;border-right: 1px solid white;"
        userElement.addEventListener("click", () => {
            reciepient = userElement.innerText;
            let chatSpace = document.getElementById("messages")
            chatSpace.innerHTML = ""
            let userChatHistory = [...chatRecord[currentUser].record.filter(f => f.reciepient == reciepient), ...chatRecord[reciepient].record ].sort((a,b) => {
               return  a.timestamp > b.timestamp ? 1 : a.timestamp < b.timestamp ? -1 : 0 
            })

            userChatHistory.forEach(chat => {
                let chatSpace = document.getElementById("messages")
                let messageEle = document.createElement("p");
                messageEle.style = chat.hasOwnProperty("reciepient") ? "margin:2px;padding: 2px;text-align: right;vwidth: 95%;" : "margin:2px;padding: 2px;text-align: left;vwidth: 95%;"
                messageEle.innerText = chat.msg;
                chatSpace.appendChild(messageEle)
            })
            console.log("user chat history", userChatHistory)
        })
     });

    }

    function createChatRecordlookup(){
        chatRecord = userList.reduce((lookup, user) => {
           if(lookup.hasOwnProperty(user)) return lookup;
           else lookup[user] = {record : []}
           return lookup;
        }, {})
    }

    function sendMeassage(){
        const msg = document.getElementById("message").value;
        ws.send(JSON.stringify({message: msg, sender: currentUser, target: reciepient}))

    }
