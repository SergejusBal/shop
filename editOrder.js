var url = "http://35.228.181.251:8080";


document.getElementById("back").addEventListener("click", async function(event) {
    window.location.href = 'adminPage.html';   

});

document.getElementById("edit").addEventListener("click", async function(event) {
    let order = fillOrderData();
    await createOrder(order);

});


async function createOrder(order) {  

    const token = getCookie("JTW");
    const username = getCookie("UserName"); 

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    try{   
        let response = await fetch(url + '/order/new/' + username + "/" + orderId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({
            "paymentStatus":  order.paymentStatus,
            "totalPrices": order.totalPrices,
            "customerName": order.customerName,
            "customerAddress": order.customerAddress,
            "customerEmail": order.customerEmail,
            "products":  order.products,                  
            }),        
        })

        if (response.status == 500){
            document.getElementById("response").innerHTML = await response.text();
            return;
        }

        if (response.status == 402){
            document.getElementById("response").innerHTML = await response.text();
            return;
        }        

        if (response.status == 400){
            document.getElementById("response").innerHTML = await response.text();
            return;
        }
        if (response.status == 200) {     
            document.getElementById("response").innerHTML = await response.text();      
            return;
        }  

    }    
    catch(error){
        console.error('Error:', error);
    }    
    
}


async function getOrder(){

    const token = getCookie("JTW");
    const username = getCookie("UserName"); 

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!token) {        
        window.location.href = "http://127.0.0.1:5500/index.html";
        return;
    }

    try{
        let response = await fetch(url + '/order/' + username + "/" + orderId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token
            },                                 
        });

        if (response.status == 401){
            return false;
        }

        if (response.status == 200){
            return response.json();
        }         

        return [];  
        
    }    
    catch(error){
        return false;

    }
    
}

function fillOrderData(){
    let order ={};

    order.customerName = document.getElementById('customerName').value;
    order.customerAddress = document.getElementById('customerAddress').value;
    order.customerEmail = document.getElementById('customerEmail').value;
    order.paymentStatus = document.getElementById('orderStatus').value;
    order.totalPrices  = document.getElementById('totalPrice').value; 
    order.products = document.getElementById("hiddenInput").value;
    return order;
}

function getOrderData(order){

    document.getElementById('customerName').value = order.customerName ? order.customerName : "No data";
    document.getElementById('customerAddress').value = order.customerAddress ? order.customerAddress : "No data";
    document.getElementById('customerEmail').value = order.customerEmail ? order.customerEmail : "No data";
    document.getElementById('orderStatus').value = order.paymentStatus ? order.paymentStatus : "No data";
    document.getElementById('totalPrice').value = order.totalPrices ? order.totalPrices : "No data";
    document.getElementById("hiddenInput").value = order.products ? order.products : "{}";

}

async function autologin(){
    let jwttoken =  getCookie("JTW");
    let name =  getCookie("UserName");
    if(!jwttoken) return false;

    try{
        let response = await fetch(url +"/user/autoLogin/" + name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': jwttoken
            },                                 
        });

        if (response.status == 401){
            return false;
        }

        if (response.status == 200){
            return true;
        }         

        return false;  
        
    }    
    catch(error){
        return false;

    }          
    
}
document.addEventListener('DOMContentLoaded',  async function() {    
    if(!(await autologin())) window.location.href = "http://127.0.0.1:5500/index.html";
    
    let order = await getOrder();    
    getOrderData(order);

});