function addSignInFormEventListener() {
    const signInForm = document.getElementById("signin-form");
    const checkbox = document.getElementById("checkbox");

    signInForm.onsubmit = function(event) {
        if (!checkbox || !checkbox.checked) {
            alert("Please check the checkbox first");
            event.preventDefault();
        }
    };

}

function addCalculateFormEventListener() {
    const calculateBtn = document.getElementById('calculate');

    calculateBtn.addEventListener('click', function() {
        const number = parseInt(document.getElementById('inputint').value, 10); 
        if (!isNaN(number) && number > 0) {
            window.location.href = `/square/${number}`; 
        } else {
            alert("Please enter a positive number");
        }
    })
}

function init() {
    addSignInFormEventListener();
    addCalculateFormEventListener();
}

window.onload = init;
