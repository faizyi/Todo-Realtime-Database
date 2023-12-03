let password = document.querySelector('.signinPassword');
let eyeIcon = document.querySelector('.eye-icon');
eyeIcon.addEventListener('click',()=>{
  if(password.type == 'password'){
    password.type = 'text'
    eyeIcon.src = './../IMG/Show.png'
  }else{
    password.type = 'password'
    eyeIcon.src = './../IMG/Hide.png'
  }
})

password.addEventListener('click', ()=>{
  eyeIcon.classList.remove('eye-icon')
})



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {  getDatabase,ref, set,onValue } from  "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyB8H6dSo_vkfhWvhxLINJqNMqF8VDe3NK0",
  authDomain: "todo-realtime-729b1.firebaseapp.com",
  databaseURL: "https://todo-realtime-729b1-default-rtdb.firebaseio.com",
  projectId: "todo-realtime-729b1",
  storageBucket: "todo-realtime-729b1.appspot.com",
  messagingSenderId: "979401593793",
  appId: "1:979401593793:web:9a371a6804d60c03011540",
  measurementId: "G-9GE5BRBCDV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);;
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


let form = document.querySelector('.form');
let signinEmail = document.querySelector('.signinEmail');
let signinPassword  = document.querySelector('.signinPassword');
let signinBtn = document.querySelector('.signin-btn');
let signinContainer = document.querySelector('.signin-container');

form.addEventListener('submit', (e)=>{
    e.preventDefault();

    signinBtn.style.backgroundColor = 'rgb(153, 149, 149)' 
    signinBtn.innerHTML = `<div class='loader'></div>`

    signInWithEmailAndPassword(auth, signinEmail.value, signinPassword.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // console.log(user.email);
    localStorage.setItem('userUid', user.uid);
    location.href = './../Todo/index.html'
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);

    signinBtn.style.backgroundColor = 'black' 
    signinBtn.innerHTML = 'Log In'
    signinContainer.style.display = 'none'

    let timerInterval;
    Swal.fire({
      title: "Invalid Email/Password!",
      // html: "I will close in <b></b> milliseconds.",
      // timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        // Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      signinContainer.style.display = 'block'
      /* Read more about handling dismissals below */
      // if (result.dismiss === Swal.DismissReason.timer) {
      //   console.log("I was closed by the timer");
      // }
    });
  });


})




//continue with google;
let google = document.querySelector('.google');
google.addEventListener('click', ()=>{
 signInWithPopup(auth, provider)
 .then(async(result) => {
   let googleUserEmail = result.user.email;
   let googleUserUid = result.user.uid;
   google.innerHTML = `<div class='googleloader'></div>`
   localStorage.setItem('userUid', googleUserUid)
   await set(ref(db, 'Users/' + googleUserUid), {
       signupemail : googleUserEmail,
       userid : googleUserUid
       });

   location.href = './../Todo/index.html'


 }).catch((error) => {
   console.log(error);
   google.innerHTML = `Continue With Google`

 });
})