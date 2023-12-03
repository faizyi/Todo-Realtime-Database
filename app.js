let password = document.querySelector('.signupPassword');
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
 import { getAuth,createUserWithEmailAndPassword, onAuthStateChanged,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
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
 const db = getDatabase(app);
 const auth = getAuth(app);
 const provider = new GoogleAuthProvider();


 let form = document.querySelector('.form');
 let signupName = document.querySelector('.signupName')
 let signupEmail = document.querySelector('.signupEmail');
 let signupPassword  = document.querySelector('.signupPassword');
 let signupBtn = document.querySelector('.signup-btn');
 let signupContainer = document.querySelector('.signup-container');


 form.addEventListener('submit', (e)=>{
    e.preventDefault();
    signupBtn.style.backgroundColor = 'rgb(153, 149, 149)' 
    signupBtn.innerHTML = `<div class='loader'></div>`

    let userData ={
      signupname : signupName.value,
      signupemail : signupEmail.value,
      signuppassword : signupPassword.value
    }

    createUserWithEmailAndPassword(auth, userData.signupemail, userData.signuppassword)
  .then(async (userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // console.log(user);
    
    await set(ref(db, 'Users/' + user.uid), {
        ...userData,
        userid : user.uid
        });
       
      location.href = './signin/index.html'
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    signupBtn.style.backgroundColor = 'black' 
    signupBtn.innerHTML = 'Sign Up'
    signupContainer.style.display = 'none'
    // Swal.fire("This account is already registered!");
    let timerInterval;
Swal.fire({
  title: "This account is already registered!",
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
  signupContainer.style.display = 'block'
});
  });
 })




//  continue with google;
 let google = document.querySelector('.google');
 google.addEventListener('click', ()=>{
  signInWithPopup(auth, provider)
  .then(async(result) => {
    let googleUserEmail = result.user.email;
    let googleUserUid = result.user.uid;
    await set(ref(db, 'Users/' + googleUserUid), {
        signupemail : googleUserEmail,
        userid : googleUserUid
        });
    google.innerHTML = `<div class='googleloader'></div>`
    localStorage.setItem('userUid', googleUserUid)

    location.href = './Todo/index.html'


  }).catch((error) => {
    console.log(error);
    google.innerHTML = `Continue With Google`

  });
 })
