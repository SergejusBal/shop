var url = "http://35.228.181.251:8080";
var offset = 0;
var itemsInCart = 0;

document.getElementById("createPost").addEventListener("click", async function(event) {

    if(!getCookie("paymentCode")) {
        document.getElementById("response").innerHTML = "Payment needed";
        return;
    }

    let post = fillPostData();
    if(post){
        await createPost(post);    
        clearPostData();
    }   

});

document.getElementById("showPosts").addEventListener("click", async function(event) {

    let posts = await getItems(offset,10);
    if(posts){
        await displayPosts(posts);
    }

});

async function createPost(post) {     

    try{   
        let response = await fetch(url + '/posts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                'PaymentCode':  getCookie("paymentCode") + "",
                'PaymentID':  getCookie("paymentID"),            
            },
            body: JSON.stringify({
            "name":post.name,           
            "content":post.content,
            "contacts":post.contacts          
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

function fillPostData(){
    var post = {};   

    if(document.getElementById("name").value.length < 50){
        post.name = document.getElementById("name").value;
    }
    else{
        document.getElementById("response").innerHTML = "Name to long";
        return false; 
    }  

    if(document.getElementById("content").value.length < 200){
        post.content = document.getElementById("content").value; 
    }
    else{
        document.getElementById("response").innerHTML = "Content to long";
        return false; 
    }  

    if(checkphone(document.getElementById("contacts").value)) {  
         post.contacts = document.getElementById("contacts").value;    
    }    
    else{
        document.getElementById("response").innerHTML = "Invalid phone format";
        return false; 
    }   
    return post;

}

function clearPostData(){
    document.getElementById("name").value = "";
    document.getElementById("content").value = "";
    document.getElementById("contacts").value = "";
}

function checkphone(phoneNumber){
    const phoneNumberPattern = /^\+370\d{8}$/;
    return phoneNumberPattern.test(phoneNumber);   
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








