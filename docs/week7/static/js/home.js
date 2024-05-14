function addSignupSubmitEventListener() {
    const signupForm = document.getElementById('signup-form');
    signupForm.onsubmit = function(e) {
        const name = document.getElementById('name').value.trim();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value.trim();

        if (!name || !username || !password) {
            e.preventDefault(); 
            alert('All fields must be filled out!');
            return false;
        }
        return true; 
    };
}


function addSigninSubmitEventListener() {
    const signinForm = document.getElementById('signin-form');
    signinForm.onsubmit = function(e) {
        const username = document.getElementById('signin-username').value.trim();
        const password = document.getElementById('signin-password').value.trim();

        if (!username || !password) {
            e.preventDefault();
            alert('All fields must be filled out!');
            return false;
        }
        return true; 
    };
}

function init() {
    addSignupSubmitEventListener(),
    addSigninSubmitEventListener() 
}

window.onload = init;