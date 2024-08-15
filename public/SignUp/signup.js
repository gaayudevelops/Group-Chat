var form=document.getElementById('signup-form');

form.addEventListener('submit',SaveToBackend);

async function SaveToBackend(event){
    event.preventDefault();

    const name = event.target.username.value;
    const email = event.target.useremail.value;
    const phoneno = event.target.userphoneno.value;
    const password = event.target.password.value;

    const obj = {
       name,
       email,
       phoneno,
       password
    }

    try {
        const response = await axios.post("http://localhost:3000/user/signup", obj);
        alert(response.data.message);
        window.location.href="../Login/login.html"
        
       
    } catch (error) {
        alert(error);
        document.body.innerHTML+=`<h2>${error}</h2>`;
        console.log(error);
    }
   
}



    