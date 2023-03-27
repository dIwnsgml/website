const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signInConfirm = document.getElementById("signInConfirm");
const signUpConfirm = document.getElementById("signUpConfirm");
const signincontainer = document.getElementById("sign-in-container");
const signupcontainer =document.getElementById("sign-up-container");


signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");

});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

signUpConfirm.addEventListener('click', () => {
    const userName = document.getElementById("")
    fetch('http://localhost:1000/api/login', {

    })
        .then(response => response.json())
        .then(loginData => {
            document.cookies = `login=loginData`
        })
});

signInConfirm.addEventListener("click", () => {

});