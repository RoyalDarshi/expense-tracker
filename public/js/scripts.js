function validateForm(name,email,password,confirmPassword) {
    // Clear previous error messages
    document.getElementById('errorMessages').innerHTML = '';

    // Get form values


    // Simple validation
    if (name.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
        document.getElementById('errorMessages').innerHTML = 'All fields are required.';
        return false;
    }

    if (password !== confirmPassword) {
        document.getElementById('errorMessages').innerHTML = 'Passwords do not match.';
        return false;
    }

    // You can add more complex validation if needed

    // If the form is valid, you can submit it
    return true;
}

async function signUpData(){
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if(validateForm(name.value,email.value,password.value,confirmPassword.value)){
        const data={name:name.value,email:email.value,password:password.value}
        await axios.post("http://localhost:3000/user-signup",data).then(res=>{
            name.value="";
            email.value="";
            password.value="";
            confirmPassword.value="";
        })
    }

    /*const name=nameEle.value;
    const email=emailEle.value;
    const password=passwordEle.value;
    const confirmPassword=confirmPasswordEle.value;*/
}