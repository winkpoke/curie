function hideURLbar(){ 
    window.scrollTo(0,1); 
};
addEventListener("load", function() { 
    setTimeout(hideURLbar, 0); 
}, false); 

$(function(){
    $('#loginForm').submit(function(e){
        alert("登录中");
        //e.preventDefault();
    })
})