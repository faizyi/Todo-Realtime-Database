let todoInputIcon = document.querySelector('.todoInput');
  let addBtn = document.querySelector('.add-btn');
  todoInputIcon.addEventListener('click', ()=>{
    addBtn.classList.remove('add-btn')

  })


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signOut,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {  getDatabase,ref, set,onValue, update,remove  } from  "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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
 const auth = getAuth();


 let form = document.querySelector('.form');
 let todoInput = document.querySelector('.todoInput');
 let clearAll = document.querySelector('.clearAll');
 let logOut = document.querySelector('.logOut');
 let ul = document.querySelector('.todo-box');
 let userUid = localStorage.getItem('userUid')
 let ids = [];
 
 
 //add Todo
 form.addEventListener('submit',async (e)=>{
   e.preventDefault();
   if(todoInput.value == ''){
       return
     }
     //Add Data
     let random = Math.random() * 2222222222222222
    let id = random.toFixed(0)
     set(ref(db, `${userUid}/${id}`), {
      todo : todoInput.value,
      time : new Date().toLocaleString()
    });
    
    todoInput.value = '';
  
})


//getTodo
let getTodos = function(){
  const starCountRef = ref(db, `${userUid}`);
  onValue(starCountRef, (snapshot) => {
    let data = snapshot.val();
    ul.innerHTML = ''
    for(let key in data){
    let task = data[key].todo
    let taskId = key
    ids.push(key)
    ul.innerHTML += `<li
                   id='' class="task">
                   <p>${task}</p>
                   <div id="todo-setting" class="todo-setting">
                   <abbr title="Edit">
                   <button><i onclick="editTodo(this,'${taskId}')"  id="todo-icon" class='bx bxs-edit-alt'></i></button></abbr>
                   <abbr title="Delete">
                   <button><ion-icon onclick="delTodo('${taskId}')"  id="todo-icon" name="trash-outline"></ion-icon></button>
                   </div></abbr>
                   </li>`
  }
});
  
}

getTodos();

//del Todo
function delTodo(id){
  remove(ref(db, `${userUid}/${id}`))
}



//edit Todo
async function editTodo(e,id){
  let editValue = prompt('Enter Edit value', e.parentNode.parentNode.parentNode.parentNode.childNodes[1].firstChild.nodeValue);
  e.parentNode.parentNode.parentNode.parentNode.childNodes[1].firstChild.nodeValue = editValue;

  await update(ref(db, `${userUid}/${id}`),{
    todo : editValue
  });
}


//clear All
clearAll.addEventListener('click',()=>{
  for(let i=0; i<ids.length; i++){
    remove(ref(db, `${userUid}/${ids[i]}`))
    }
    clearAll.innerHTML = 'Data removed successfully!'
    setTimeout(()=>{
      clearAll.innerHTML = 'Clear All'
    },2000)
})

window.getTodos = getTodos;
window.delTodo = delTodo;
window.editTodo = editTodo;



let logoutUser = document.querySelector('.logout');
logoutUser.addEventListener('click',()=>{
  signOut(auth).then(() => {
    // logoutUser.innerHTML = `<div class='logout-loader'></div>`
    // setTimeout(()=>{
      location.href = './../signin/index.html'
    // },3000)
  }).catch((error) => {
    // logoutUser.innerHTML = `<ion-icon name="log-out-outline"></ion-icon>Log out`
    console.log(error);
  }); 
})
