function validate(){
    var passwd=document.form.password.value;
    var email=document.form.eml.value;

    if(!/[a-zA-z1-9]@[a-z].com/.test(email)){
        document.querySelector("#alert2").innerText="* please enter valid email"
    }else{
        document.querySelector('#alert2').innerText=email;
    }

    if(passwd.length<6){
        document.querySelector("#alert3").innerText="* password length must be more than 6 character";
        return false;
    }else{
        document.querySelector("#alert3").innerText=passwd;

    }
    
    return true;
}