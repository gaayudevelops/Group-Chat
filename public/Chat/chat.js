
const socket = io('http://localhost:3000');

// socket.on('connect', ()=> {
//     displayMessages ('You joined')
// })

socket.on('recieve-message', (userid,message) =>{
    displayOthersMessages(userid,message);
})


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


// const clientName = decodedtoken.name;
// displayMessages("You Joined")

async function displayOthersMessages(data) {
    
    try {
        const userId = data.userid
        const token = localStorage.getItem('token');
        await axios.get(`http://localhost:3000/user/get-user?id=${userId}`,{ headers: { Authorization: token } })
        .then((response) => {
            const name = response.data.User.name;
            const messageBox = document.getElementById("messages");
            const messageElement = document.createElement('div')
            messageElement.innerText = name +" : "+ data.message;
            messageBox.append(messageElement);
        });
    } catch (error) {
        document.body.innerHTML += `<h2>${error}</h2>`;
        console.log(error);
    }

    // const messageBox = document.getElementById("messages");
    // // messageBox.innerHTML = "";
    // // messageBox.innerHTML = "<h1>Messages:</h1>";
    
    // const messageElement = document.createElement('div')
    // messageElement.innerText = message;
    // messageBox.append(messageElement);
};

function displayMyMessages(message) {

    const messageBox = document.getElementById("messages");
    const messageElement = document.createElement('div')
    messageElement.innerText = "You : " +message;
    messageBox.append(messageElement);
};


var form = document.getElementById('chat-form');
form.addEventListener('submit', SaveToBackend);

async function SaveToBackend(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const decodedtoken = parseJwt(token);
    const userid = decodedtoken.userId;

    const message = event.target.message.value;
    const groupid = event.target.groupid.value;
    const toid = event.target.personid.value;

    displayMyMessages(message)
    
    socket.emit('send-message', message,groupid,toid,userid);
 

    const obj = {
        message,
        toid,
        groupid,
    }
    try {
        const token = localStorage.getItem('token');
        await axios.post("http://localhost:3000/message/add-message", obj, { headers: { Authorization: token } })
        .then(() => {
            document.getElementById("inputmessage").value = "";
        });
    } catch (error) {
        document.body.innerHTML += `<h2>${error}</h2>`;
        console.log(error);
    }
}



// window.addEventListener("DOMContentLoaded", async() => {

//     try {
//       const localStorageData = JSON.parse(localStorage.getItem("Messages"));
//       console.log(localStorageData)
//       let lastMessageId;
//       if (localStorageData == null) {
//           lastMessageId = 0;
//       } else {
//           lastMessageId = localStorageData[localStorageData.length - 1].id;
//       }
//       let mergeMessage = [];
//       console.log(lastMessageId)
  
//       await axios.get(`http://localhost:3000/message/get-messages?id=${lastMessageId}`) 
//       .then((response) => {
  
//           if (response.data.allMessages.length > 0) {
  
//             if (localStorageData) {
//               mergeMessage = localStorageData.concat(response.data.allMessages);
            
//             } else {
//               mergeMessage = response.data.allMessages;
//             }
//             if (mergeMessage.length > 10) {
//               let messagesToremove = mergeMessage.length - 10;
//               for (let i = 0; i < messagesToremove; i++) {
//                   mergeMessage.shift();
//               }
//             }
      
//           } else {
//             mergeMessage = JSON.parse(localStorage.getItem("Messages"));
//           }

//           localStorage.setItem("Messages", JSON.stringify(mergeMessage));
    
//           const messageBox = document.getElementById("messages");
//           messageBox.innerHTML = "";
//           messageBox.innerHTML = "<h1>Messages:</h1>";
    
//           for (let i = 0; i < mergeMessage.length; i++) {
//             const msgdiv = document.createElement("div");
//             msgdiv.classList.add("msgdiv");
//             const name = document.createElement("div");
//             name.innerHTML = `<p>${mergeMessage[i].name} :</p>`;
//             name.style.textDecoration ='underline';
//             msgdiv.appendChild(name);
//             const message = document.createElement("div");
//             message.innerHTML = `<p>${mergeMessage[i].message}</p>`;
//             message.style.fontStyle='italic';
//             msgdiv.appendChild(message);
//             messageBox.appendChild(msgdiv);
//           }
//       }); 
//     } catch (error) {
//       document.body.innerHTML += `<h2>${error}</h2>`;
//       console.log(error);
//     }
  
// });


// // setInterval(() =>{
// //     const localStorageData = JSON.parse(localStorage.getItem("Messages"));
// //     let lastMessageId;
// //     if (localStorageData == null) {
// //         lastMessageId = 0;
// //     } else {
// //         lastMessageId = localStorageData[localStorageData.length - 1].id;
// //     }
// //     let mergeMessage = [];

// //     axios.get(`http://localhost:3000/message/get-messages?id=${lastMessageId}`) 
// //     .then((response) => {

// //         if (response.data.allMessages.length > 0) {

// //           if (localStorageData) {
// //             mergeMessage = localStorageData.concat(messages.data);
// //           } else {
// //             mergeMessage = response.data.allMessages;
// //           }
// //           if (mergeMessage.length > 10) {
// //             let messagesToremove = mergeMessage.length - 10;
// //             for (let i = 0; i < messagesToremove; i++) {
// //                 mergeMessage.shift();
// //             }
// //           }
          
// //         } else {
// //           mergeMessage = JSON.parse(localStorage.getItem("Messages"));
// //         }
// //         localStorage.setItem("Messages", JSON.stringify(mergeMessage));
  
// //         const messageBox = document.getElementById("messages");
// //         messageBox.innerHTML = "";
// //         messageBox.innerHTML = "<h1>Messages:</h1>";
  
// //         for (let i = 0; i < mergeMessage.length; i++) {
// //           const msgdiv = document.createElement("div");
// //           msgdiv.classList.add("msgdiv");
// //           const name = document.createElement("div");
// //           name.innerHTML = `<p>${mergeMessage[i].name} :</p>`;
// //           name.style.textDecoration ='underline';
// //           msgdiv.appendChild(name);
// //           const message = document.createElement("div");
// //           message.innerHTML = `<p>${mergeMessage[i].message}</p>`;
// //           message.style.fontStyle='italic';
// //           msgdiv.appendChild(message);
// //           messageBox.appendChild(msgdiv);
// //         }
// //     })
// //     .catch((err) => {
// //         console.log(err);
// //     });

// // }, 10000);


const creategroup = document.getElementById("creategrpform");
creategroup.addEventListener("submit", async (event) => {
  
    event.preventDefault();
    const groupname = document.getElementById("grpname").value;
    let groupdetails = {
        groupname: groupname,
    };

    try {
        const token = localStorage.getItem('token');
        await axios.post("http://localhost:3000/group/create-group", groupdetails, {headers: { Authorization: token }})
        .then((response) => {
           alert(response.data.message);
           document.getElementById("grpname").value = "";
        });
    } catch (error) {
         document.body.innerHTML += `<h2>${error}</h2>`;
         console.log(error);
    }
});

window.addEventListener("DOMContentLoaded", async() => {

    try {
        const token = localStorage.getItem('token');
        await axios.get("http://localhost:3000/user/get-users", {headers: { Authorization: token }})
        .then((response) => {
            const otherUsers = response.data.allOtherUsers;
            if (otherUsers){
                document.getElementById("persons").innerHTML = "";
                const personsBox = document.getElementById("persons");
    
                for (let i = 0; i < otherUsers.length; i++) {
                  const peersondiv = document.createElement("button");
                  peersondiv.innerHTML = `<p>${otherUsers[i].name}</p>`;
                  peersondiv.classList.add("groupdiv");
                  peersondiv.setAttribute("id", `${otherUsers[i].id}`);
                  personsBox.appendChild(peersondiv);
                }
            }else {
                alert(response.data.message);
            }
        
        });
    }catch (error) {
       document.body.innerHTML += `<h2>${error}</h2>`;
       console.log(error);
    }
});

window.addEventListener("DOMContentLoaded", async() => {

    try {
        const token = localStorage.getItem('token');
        await axios.get("http://localhost:3000/group/get-groups", {headers: { Authorization: token }})
        .then((response) => {
            const usergroups = response.data.usersGroups;
            if (usergroups){
                document.getElementById("groups").innerHTML = "";
                const groupsBox = document.getElementById("groups");
    
                for (let i = 0; i < usergroups.length; i++) {
                  const groupdiv = document.createElement("button");
                  groupdiv.innerHTML = `<p>${usergroups[i].name}</p>`;
                  groupdiv.classList.add("groupdiv");
                  groupdiv.setAttribute("id", `${usergroups[i].id}`);
                  groupsBox.appendChild(groupdiv);
                }
            }else {
                alert(response.data.message);
            }
        
        });
    }catch (error) {
       document.body.innerHTML += `<h2>${error}</h2>`;
       console.log(error);
    }
});



const groupsBox = document.getElementById("groups");
groupsBox.addEventListener("click", async (event) => {
    
    event.preventDefault();
    try {
        var groupid = event.target.parentNode.id;
        document.getElementById("groupid").value = groupid;
        socket.emit('join-room',groupid);
        
        const token = localStorage.getItem('token');
        const decodedtoken = parseJwt(token);
        const clientName = decodedtoken.name;
        
        await axios.get(`http://localhost:3000/message/get-group-messages/?grpid=${groupid}`, {headers: { Authorization: token }})
        .then((response) => {
          const groupmessages = response.data.allGroupMessages;
          const messageBox = document.getElementById("messages");
          messageBox.innerHTML = "";
          messageBox.innerHTML = "<h1>Messages:</h1>";
    
          for (let i = 0; i < groupmessages.length; i++) {

            const nameAndMessage = document.createElement("div");
            if(groupmessages[i].name === clientName){
                nameAndMessage.innerText = `You : ${groupmessages[i].message}`;  
            }else {
                nameAndMessage.innerText = `${groupmessages[i].name}: ${groupmessages[i].message}`; 
            }
            messageBox.appendChild(nameAndMessage); 
          }
        });
    }catch (error) {
      document.body.innerHTML += `<h2>${error}</h2>`;
      console.log(error);
    }
});

const personsBox = document.getElementById("persons");
personsBox.addEventListener("click", async (event) => {
    
    event.preventDefault();
    try {
        var personid = event.target.parentNode.id;
        document.getElementById("personid").value = personid;
        
        const token = localStorage.getItem('token');
        const decodedtoken = parseJwt(token);
        const clientName = decodedtoken.name;
        await axios.get(`http://localhost:3000/message/get-personal-messages/?prsnid=${personid}`, {headers: { Authorization: token }})
        .then((response) => {
          const personalmessages = response.data.allPersonalMessages;
          const messageBox = document.getElementById("messages");
          messageBox.innerHTML = "";
          messageBox.innerHTML = "<h1>Messages:</h1>";
    
          for (let i = 0; i < personalmessages.length; i++) {
            const nameAndMessage = document.createElement("div");
            if(personalmessages[i].name === clientName){
                nameAndMessage.innerText = `You : ${personalmessages[i].message}`;  
            }else {
                nameAndMessage.innerText = `${personalmessages[i].name}: ${personalmessages[i].message}`; 
            }
            messageBox.appendChild(nameAndMessage); 
          }
        });
    }catch (error) {
      document.body.innerHTML += `<h2>${error}</h2>`;
      console.log(error);
    }
});

const adduser = document.getElementById("adduserform");
adduser.addEventListener("submit", async(event) => {

    event.preventDefault();
    try {
        const userEmailId = document.getElementById("adduseremail").value;
        const groupid = document.getElementById("groupid").value;
        const makeadmin = document.getElementsByName("makeadmin");
        var adminpower;
        if (makeadmin[0].checked) {
            adminpower = "on";
        } else {
            adminpower = "off";
        } 

        let adduserdetails = {
          userEmail: userEmailId,
          groupid: groupid,
          makeadmin: adminpower
        };
        const token = localStorage.getItem('token');
        await axios.post("http://localhost:3000/group/add-user-to-group", adduserdetails, {headers: { Authorization: token } })
        .then((response) => {
            alert(response.data.message);
        });
    }catch (error) {
      document.body.innerHTML += `<h2>${error}</h2>`;
      console.log(error);
    } 
});


const removeuser = document.getElementById("removeuserform");
removeuser.addEventListener("submit", async(event) => {

    event.preventDefault();
    try {
        const userEmailId = document.getElementById("removeuseremail").value;
        const groupid = document.getElementById("groupid").value;
  
        let removeUserDetails = {
          removeUserEmail: userEmailId,
          groupid: groupid,
        };
        const token = localStorage.getItem('token');
        await axios.post("http://localhost:3000/group/remove-user-from-group", removeUserDetails, {headers: { Authorization: token } })
        .then((response) => {
            alert(response.data.message);
        });
    }catch (error) {
      document.body.innerHTML += `<h2>${error}</h2>`;
      console.log(error);
    } 
});



