// div.addEventListener('click',(event)=>{
//     console.log(event);
//     get(event.path[2].className);
// });
// Add a click event listener to the child element
// document.querySelector(".bookMarkedDiv").addEventListener("click", function(event) {
//     // Get the parent element of the child element
//     var parentElement = event.target.parentElement;
//     // Get the grandparent element of the child element
//     var grandparentElement = parentElement.parentElement;
//     console.log("Grandparent element:", grandparentElement);
//   });



// const { json } = require("body-parser");
// const { response } = require("express");

  
// let parent = document.getElementById("backgroundImg");
// parent.addEventListener("click", function(event) {
//   if (event.target.classList.contains("bookMarkedContainer")) {
//     console.log(event.target.innerHTML);
//   }
// });

// let title = document.getElementsByClassName('title')[0];
// title.addEventListener('click',(event)=>{
// // console.log(event.path[4].className)
// get(event.path[4].className);
// })
// const get = (some =>{
// console.log(some);
// })

//get dom elements
var loginDiv = document.getElementsByClassName('login')[0];
var loginOrSignUpContainer = document.getElementById('loginOrSignupContainer');
var repeatPassword = document.getElementsByClassName('repeatPasswordInputBox')[0];
var signUpText = document.getElementsByClassName('signInUpText')[0];
var loginBtn = document.getElementById('loginBtn');
var changeText = document.getElementsByClassName('changeDisplaytext')[0];
var changeBtnText = document.getElementsByClassName('changeSignUpBtnText')[0];
let username = document.getElementsByClassName('username')[0];
let password = document.getElementsByClassName('password')[0];
var userId = 0;
// let repeatPasswordText = document.getElementsByClassName('repeatPassword')[0];

//hide error message
window.addEventListener('load',()=>{
    let errorMsgRePwd = document.getElementsByClassName('errorMsgRepeatPassword')[0];
    let errorMsgPwd = document.getElementsByClassName('errorMsgUserName')[0];
    let errorMsgUserName = document.getElementsByClassName('errorMsgPassword')[0];
    if(errorMsgPwd != null&& errorMsgRePwd!=null&&errorMsgUserName!=null){
        errorMsgPwd.style.display = "none";
        errorMsgRePwd.style.display = "none";
        errorMsgUserName.style.display = "none";
    }
    const urlParms = new URLSearchParams(window.location.search);
    userId = urlParms.get('id');
    if(userId != undefined){
        let elements = document.querySelectorAll('.bookMarked');
        for(let i = 0; i <elements.length;i++){
            elements[i].setAttribute('userId',userId)
        }
    }
})
// get username from url
const getUserName = ()=>{
    let url = window.location.href;
    let userName = url.slice(url.indexOf('=')+1);
    return userName;
}
// bookmarked movies updated
const updateBookMarked = (img)=>{
console.log(img);
let bookMarked = img.src.includes('empty')?true:false;
let userIdServer = img.getAttribute('userId');
if(bookMarked){
    console.log("ii")
    img.src='assets/icon-bookmark-full.svg'
    rendeBookMarked(img.id,userIdServer,true);

}
else{
    img.src='assets/icon-bookmark-empty.svg'
    rendeBookMarked(img.id,userIdServer,false);
}
}
// render bookmarked

function rendeBookMarked(img,userid,value){
    fetch('/indexupdate',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
           "id":img,"value":value,"userId":userId
        }),
    }).then(response=>{
        if(response.status == 200){
             console.log('ok');
        }
    }).catch(err=>{
        console.log(err)
    });
}
// redirect page
const home =()=>{
    console.log('home');
  window.location.href=`/indexuser?id=${userId}`;
}
const movies =()=>{
  window.location.href=`/indexmovies?id=${userId}`;
}
const series =()=>{
  window.location.href=`/indextvseries?id=${userId}`;
}
const bookmark = ()=>{
window.location.href=`/indexbookmark?id=${userId}`;
}

// create signin
const createSignIn = ()=>{
    if(repeatPassword != null && loginDiv != null && loginOrSignUpContainer != null && signUpText != null && loginBtn != null && changeText != null && changeBtnText != null){
        repeatPassword.style.display='none';
        loginDiv.style.height='40vh';
        // loginOrSignUpContainer.style.height='45vh';
        signUpText.innerHTML = 'Sign In';
        loginBtn.value='Login to your account';
        loginBtn.setAttribute('onclick','loginCheck()');
        changeText.innerHTML='Don’t have an account?';
        changeBtnText.innerHTML = 'Sign Up';
        changeBtnText.setAttribute('onclick','createSignUp()');
    }
}
//create signup
const createSignUp=()=>{
    if(repeatPassword != null && loginDiv != null && loginOrSignUpContainer != null && signUpText != null && loginBtn != null && changeText != null && changeBtnText != null){
    repeatPassword.style.display='block';
    loginDiv.style.height='50vh';
    loginOrSignUpContainer.style.height='55vh';
    signUpText.innerHTML = 'Sign Up';
    loginBtn.value='Create an account';
    changeText.innerHTML='Already have a account?';
    changeBtnText.innerHTML = 'Sign In';
    loginBtn.setAttribute('onclick','SignUpCheck()')
    changeBtnText.setAttribute('onclick','createSignIn()');
    }
}

// check signup form
const SignUpCheck = ()=>{
if(username.value !=""&& password.value !=""){
    let data = {
        "userName":username.value,
        "password":window.btoa(password.value)
    }
   console.log(data);
   postUserdata(data)
}
}
// // check login form
const loginCheck = ()=>{
    if(username.value !=""&& password.value !=""){
        checkUser(username.value,password.value);
    }
}
// send data to server
async function postUserdata(UserData){
    fetch('/index',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
           UserData
        }),
    }).then(response=>{
        if(response.status == 200){
            createSignIn();
        }
        else{
            alert('please hang in there')
        }
    }).catch(err=>{
        console.log(err)
    });
}
async function checkUser(userName,password){
    let UserData = {
        "userName":userName,
        "password":password
    }
    fetch('/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
           UserData
        }),
    }).then(response=>{
        return response.json();
    }).then(data=>{
        console.log(data);
        if(data.status == 200){
             window.location.href=`/indexuser?id=${data.id}`;
        }
        else{
            document.getElementsByClassName('errorMsgPassword')[0].style.display='block';
            document.getElementsByClassName('errorMsgPassword')[0].innerHTML='Please enter a valid details';
        }
    }).catch(err=>{
        console.log(err)
    });
}


// let trendMovie = document.getElementById("backgroundImg");
// if(trendMovie != null){
//     trendMovie.addEventListener('click',()=>{
//         alert('gfcvhbn');
//     })
// }


function playVideo(value){
   console.log(value);
   value = value.getAttribute('value');
   console.log(value);
    var video = document.getElementsByTagName('video')[0];
    var sources = video.getElementsByTagName('source');
    sources[0].src = value;
    video.load();
document.getElementsByClassName('videoContainer')[0].style.visibility='visible';
let elements = document.querySelectorAll('.bookMarkedDiv');
let playbutton =document.querySelectorAll('.playButtonWHole');
for (var i = 0; i < playbutton.length; i++){
    playbutton[i].style.display = "none";
}
for (var i = 0; i < elements.length; i++){
    elements[i].style.display = "none";
}
}
function stopVideo(){
    document.getElementsByClassName('videoContainer')[0].style.visibility='hidden';
    var video = document.getElementsByTagName('video')[0];
    video.muted = true;
    var sources = video.getElementsByTagName('source');
    sources[0].src = "";
    let elements = document.querySelectorAll('.bookMarkedDiv');
    let playbutton =document.querySelectorAll('.playButtonWHole');
    for (var i = 0; i < playbutton.length; i++){
        playbutton[i].style.display = "flex";
    }
for (var i = 0; i < elements.length; i++){
    elements[i].style.display = "flex";
}
    }


// let encrypt = window.btoa("nathan")
// console.log(encrypt);
// console.log(window.atob(encrypt));
