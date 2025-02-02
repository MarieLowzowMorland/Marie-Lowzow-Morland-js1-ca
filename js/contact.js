const validateForm = (event) => {
    event.preventDefault();
    const formIsValid = Array.from(event.target.querySelectorAll("input"))
        .map(validateInput)
        .every(valid => valid);  

    if(formIsValid){
        showSuccessMessage();
    } else {
        hideSuccessMessage();
    }
}

const showSuccessMessage = () => {
    document.getElementById("success-message").style.display = "block";
}

const hideSuccessMessage = () => {
    document.getElementById("success-message").style.display = "none";
}

const validateInput = (inputElement) => {
    const {name, value, required, type} = inputElement;
    const minlength = inputElement.getAttribute("data-minlength") || 0;
    
    let errorMessages = [];
    if(required){
        errorMessages.push(validateRequired(value, name));
    }
    if(type === "email"){
        errorMessages.push(validateEmail(value, name));
    }
    if(minlength > 0){
        errorMessages.push(validateMinLength(value, minlength, name));
    }

    const errorMessage = errorMessages.join("")

    document.getElementById(`${name}Error`).innerHTML = errorMessage;
    if (errorMessage === ""){
        inputElement.classList.remove("invalid");
        return true;
    } else {
        inputElement.classList.add("invalid");
        hideSuccessMessage();
        return false;
    };
}

const validateRequired = (value, name) => {
    if(!value || value.trim().length === 0){
        return `<p>${upperCaseFirst(name)} is required.</p>`
    } else {
        return "";
    }
}

const validateEmail = (value, name) => { 
    const regEx = /\S+@\S+\.\S+/;
    if (regEx.test(value)){
        return "";
    } else {
        return `<p>${upperCaseFirst(name)} must contain at least @ and a domain. I.e "test@example.com".</p>`;
    }
 }

 const validateMinLength = (value, minLength, name) => {
     if(!value || value.trim().length < minLength){
         return `<p>${upperCaseFirst(name)} must be at least ${minLength} without leading or trailing spaces.</p>`
     } else {
         return "";
     }
 }

const upperCaseFirst = (value) => value.charAt(0).toUpperCase() + value.substr(1);

const validateInputEventHandler = (event) => {
    validateInput(event.target);
}

const form = document.getElementById("contact-form");
form.addEventListener("submit", validateForm);
form.querySelectorAll("input")
    .forEach(input => input.addEventListener("input", validateInputEventHandler));

/*
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
https://gomakethings.com/converting-a-nodelist-to-an-array-with-vanilla-javascript/

*/