var url = "http://35.228.181.251:8080";
var offset = 0;
var itemsInCart = 0;

document.getElementById("Login").addEventListener("click", async function(event) {

    let user = await fillUserData();

    if(await login(user)){
        window.location.href = 'adminPage.html';
    };

    clearPostData();

});




// document.getElementById("showPosts").addEventListener("click", async function(event) {

//     let posts = await getItems(offset,10);
//     if(posts){
//         await displayPosts(posts);
//     }

// });

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
    itemsInCart++;
    document.getElementById("response").innerHTML = itemsInCart;

    jsonStringItemCart = getCookie("ItemCart");
    
    tempCart = jsonStringItemCart ? JSON.parse(jsonStringItemCart) : [];  

    item = await getItembyID(id);
    tempCart.push(item);  
      
    setCookie("ItemCart",JSON.stringify(tempCart),7);

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

function clearPostData(){
    document.getElementById("name").value = "";
    document.getElementById("password").value = "";
}


document.addEventListener('DOMContentLoaded',  async function() {    
    let load =0;

    while(!hasVerticalScrollBar() && load < 10){  
        let posts = await getItems(offset,10);
        if(posts){
            await displayPosts(posts);
        } 
        load++;        
    } 

});

window.addEventListener('scroll', async function() {
        
    let hasLoaded = false;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !hasLoaded) {
        let posts = await getItems(offset,10);
        if(posts){
            await displayPosts(posts);
        }
        hasLoaded = true;        
    }
    else if (window.innerHeight + window.scrollY + 100 < document.body.offsetHeight) {
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

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
    console.error("Stripe Checkout error:", error.message);
    }
    deleteCookie("ItemCart");    
});


async function createOrder() {     


    try{   
        let response = await fetch(url + '/order/new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
            "products": getCookie("ItemCart"), 
            "totalPrices": 1,
                     
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
    
    tempCart = jsonStringItemCart ? JSON.parse(jsonStringItemCart) : [];  

    if(tempCart.length = 0) return 0;

    let cartPrice = 0;
    tempCart.forEach(item => {
        cartPrice += item.price;

    });
    
    
    


}






