//var url = "http://35.228.181.251:8080";
var url = "http://localhost:7778";
var offset = 0;

document.getElementById("Login").addEventListener("click", async function(event) {

    let user = await fillUserData();
    if(document.getElementById("Login").textContent == "Log Out") {
        logOutState();        
        return;
    }

    if(await login(user)){      
        loginState();      
    };

    clearPostData();

});

document.getElementById("cartbutton").addEventListener("click", async function(event) {
    window.location.href = 'cart.html';
});

document.getElementById("reset").addEventListener("click", async function(event) {

    document.getElementById("price").innerHTML = "Total is price: " + 0 + " EUR";
    document.getElementById("itemCount").innerHTML = "Item count is: " + 0;
    deleteCookie("ItemCart");

});


document.getElementById("Register").addEventListener("click", async function(event) {

    let user = await fillUserData();
    if(document.getElementById("Register").textContent == "Admin Page") {
        window.location.href = 'adminPage.html';
        return;
    }

    if(await Register(user)){
        document.getElementById("response").innerHTML = "Resgistration successful"; 
    };

    clearPostData();
    

});

function loginState(){
    document.getElementById("userdiv").style.display = "none";
    document.getElementById("passworddiv").style.display = "none";
    document.getElementById("loginheader").innerHTML = "";
    document.getElementById("Login").textContent = "Log Out";
    document.getElementById("Register").textContent = "Admin Page";
    document.getElementById("sidepannel").style.height= "770px";

}
function logOutState(){
    document.getElementById("userdiv").style.display = "flex";
    document.getElementById("passworddiv").style.display = "flex";
    document.getElementById("loginheader").innerHTML = "Login";
    document.getElementById("Login").textContent = "Login";
    document.getElementById("Register").textContent = "Register";
    document.getElementById("sidepannel").style.height= "1010px";
    deleteCookie("JTW");
    
}


 async function login(user) {     

    try{   
        let response = await fetch(url + '/user/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'                                        
            },
            body: JSON.stringify({
            "name": user.name,           
            "password":user.password                  
            }),        
        })

        if (response.status == 500){
            
            return;
        }

        if (response.status == 402){
            
            return;
        }        

        if (response.status == 400){
            
            return;
        }
        if (response.status == 200) {            
            setCookie("JTW", await response.text(),7);
            setCookie("UserName",user.name + "",7); 
            return true;
        }  

    }    
    catch(error){
        console.error('Error:', error);
    }    
    
}

async function Register(user) {     

    try{   
        let response = await fetch(url + '/user/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'                                        
            },
            body: JSON.stringify({
            "name": user.name,           
            "password":user.password                  
            }),        
        })

        if (response.status == 500){
            
            return;
        }

        if (response.status == 402){
            
            return;
        }        

        if (response.status == 400){
            
            return;
        }
        if (response.status == 200) {           
            
            return true;
        }  

    }    
    catch(error){
        console.error('Error:', error);
    }    
    
}

async function getItems(offset, limit) {     

    try{
        let response = await fetch(url + '/item/getAll'+"?offset=" + offset +  "&limit=" + limit, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',               
            },                    
        })        

        if (response.status == 204){ 
            document.getElementById("response").innerHTML = "No data";       
           return;
        }
        else if (response.status == 200) {
            return await response.json();
        } 

    
    } catch (error) {
        console.error('Error:', error);
    }   
    
}


function displayPosts(items) {    
    const item_container = document.getElementById("itemContainer");
    
    items.forEach(items => {
      
        const newItem = document.createElement("div");
        newItem.className = "item";        

        const itemHeader = document.createElement("div");
        itemHeader.className = "item-header";

            const id_span = document.createElement("span");
            id_span.className = "item-id";
            id_span.textContent = "ID: " + items.id;
            const name_spam = document.createElement("span");
            name_spam.className = "item-name";
            name_spam.textContent = items.name; 
            itemHeader.appendChild(name_spam);
            itemHeader.appendChild(id_span); 

        const imageDiv = document.createElement("div");
        imageDiv.className = "item-imageDiv";
        
            const image = document.createElement("img");
            image.className = "item-image";
            image.src = items.imageUrl;
            imageDiv.appendChild(image);      

        const itemBody = document.createElement("div");
        itemBody.className = "item-content";
        itemBody.textContent = items.description;


        const itemFotter = document.createElement("div");
        itemFotter.className = "item-footer";

            const price = document.createElement("span");
            price.className = "item-price";
            price.textContent = "Price: " + items.price + " EUR";
            const category = document.createElement("span");
            category.className = "item-category";
            category.textContent = "Category: " + items.category;

            itemFotter.appendChild(price);
            itemFotter.appendChild(category); 
        
        const itemAddButton = document.createElement("button"); 
        itemAddButton.className = "item-button";
        itemAddButton.textContent = "Add to cart";
        itemAddButton.onclick = async function() {                                    
            await addToCart(items.id);           
           
        };
        

        newItem.appendChild(itemHeader);
        newItem.appendChild(imageDiv);
        newItem.appendChild(itemBody); 
        newItem.appendChild(itemFotter);
        newItem.appendChild(itemAddButton);

        item_container.appendChild(newItem);

        console.log(offset);
        offset++;
    });
}

async function addToCart(id){
   

    jsonStringItemCart = getCookie("ItemCart");
    
    tempCart = jsonStringItemCart ? JSON.parse(jsonStringItemCart) : [];  

    item = await getItembyID(id);
    tempCart.push(item);  
      
    setCookie("ItemCart",JSON.stringify(tempCart),7);
    showCart();

}

async function getItembyID(id){
    try{
        let response = await fetch(url + "/item/" + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',               
            },                    
        })        

        if (response.status == 204){ 
            document.getElementById("response").innerHTML = "No data";       
           return;
        }
        else if (response.status == 200) {
            return await response.json();
        } 

    
    } catch (error) {
        console.error('Error:', error);
    }   

}

function fillUserData(){
    var user = {};   
    
    user.name = document.getElementById("name").value;
    user.password = document.getElementById("password").value;  
     
    return user;

}

function fillOrderData(){
    var order = {};   
    
    order.customerName = document.getElementById("customerName").value;
    order.customerAddress = document.getElementById("customerAddress").value; 
    order.customerEmail = document.getElementById("customerEmail").value;  
     
    return order;

}

function clearPostData(){
    document.getElementById("name").value = "";
    document.getElementById("password").value = "";
}




window.addEventListener('scroll', async function() {
        
    let hasLoaded = false;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !hasLoaded) {
        let posts = await getItems(offset,10);
        if(posts){
            await displayPosts(posts);
        }
        hasLoaded = true;        
    }
    else if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
        hasLoaded = false;
    }

});

function hasVerticalScrollBar() {
    return document.body.scrollHeight > window.innerHeight;
}



document.getElementById("checkout").addEventListener("click", async () => {

    // Replace with your public key
    const stripe = Stripe('pk_test_51PlENQHWGvvl25KmMUuPtb9iFyXtRJt8Xf1ttsKjNS4ryOkdvZz2FNrwr0KCNBKTQvBiCeOER6LxNUbY8KVQklkW00fZHeGmb4');
    const response = await fetch(url+"/stripe/pay", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({          
        orderID: await createOrder()
    })
    });

    const session = await response.json();    

    const sessionId = session.id;
    setCookie("paymentCode", session.paymentCode,1);
    setCookie("paymentID", session.paymentID,1);
    deleteCookie("ItemCart");    
    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
    console.error("Stripe Checkout error:", error.message);
    }
   
});


async function createOrder() {     

    let order = fillOrderData();

    try{   
        let response = await fetch(url + '/order/new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
            "products": getCookie("ItemCart"), 
            "totalPrices": calcutalePrice(),
            "customerName": order.customerName,
            "customerAddress": order.customerAddress,
            "customerEmail": order.customerEmail,                     
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
            return await response.json();
        }  

    }    
    catch(error){
        console.error('Error:', error);
    }    
    
}


function calcutalePrice(){
    jsonStringItemCart = getCookie("ItemCart");
    
    itemCart = jsonStringItemCart ? JSON.parse(jsonStringItemCart) : []; 

    if(itemCart.length == 0) return 0;
  
    let cartPrice = 0;
    itemCart.forEach(item => {         
        cartPrice += item.price;
    });
    
    return cartPrice.toFixed(2);
}

function calcutaleItemCount(){
    jsonStringItemCart = getCookie("ItemCart");
    
    itemCart = jsonStringItemCart ? JSON.parse(jsonStringItemCart) : [];  

    if(itemCart.length == 0) return 0;

    let itemsCount = 0;
    itemCart.forEach(item => {
        itemsCount++;    
    });   

    return itemsCount;  


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
    let load = 0;

    while(!hasVerticalScrollBar() && load < 10){  
        let posts = await getItems(offset,10);
        if(posts){
            await displayPosts(posts);
        } 
        load++;        
    } 

    showCart();

    if(await autologin())  loginState();  
    else logOutState();


});

function showCart(){
    document.getElementById("price").innerHTML = "Total is price: " + calcutalePrice() + " EUR";
    document.getElementById("itemCount").innerHTML = "Item count is: " + calcutaleItemCount();
}




