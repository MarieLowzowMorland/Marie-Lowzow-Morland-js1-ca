
const form = document.getElementById("contact-form");

const nameError = document.getElementById("nameError");
const subjectError = document.getElementById("subjectError");
const emailError = document.getElementById("e-mailError");
const addressError = document.getElementById("addressError");

const validateForm = (event) => {
    event.preventDefault();
    console.log(event.target)
    console.log(event.target["name"].value)
    console.log(event.target["name"].required)
    //TODO: read out rules from event.target instead?

    let valueForm = true;
    const name = document.getElementById("name");
    const subject = document.getElementById("subject");
    const email = document.getElementById("e-mail");
    const address = document.getElementById("address");

    if(lengthValidator(name.value, 0)){
        nameError.style.display = "none";
    }
    else {
        nameError.style.display = "block";
        valueForm = false
    }

    if(lengthValidator(subject.value, 11)){
        subjectError.style.display = "none";
    }
    else {
        subjectError.style.display = "block";
        valueForm = false
    }

    if(lengthValidator(address.value, 26)){
        addressError.style.display = "none";
    }
    else {
        addressError.style.display = "block";
        valueForm = false
    }

    if(validateEmail(email.value)){
        emailError.style.display = "none";
    }
    else {
        emailError.style.display = "block";
        valueForm = false
    }


    if(valueForm){
        document.getElementById("contact-form").innerHTML = (validationMessageToHtml())
    }

}
const validateEmail = (email) => { 
    const regEx = /\S+@\S+\.\S+/;
    const patternMatches = regEx.test(email);    
   return patternMatches;
 }

const lengthValidator = (value, len) =>{
    if (value.trim().length > len){
        return true
    }
    else{
        return false
    }
}

form.addEventListener("submit", validateForm)

 const validationMessageToHtml = () => {
    return `<div class="validationMessage">
        <p>Thank you for filling the form correctly.Have a nice day.</p>
        <a href="/index.html">Go back to the main page</a>
        </div>`;
 }