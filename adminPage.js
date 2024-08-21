var url = "http://35.228.181.251:8080";
var offset =0;
var img = null;

document.getElementById("addItem").addEventListener("click", async function(event) {

    let post = fillPostData();
    if(post){
        await addItem(post);    
        clearPostData();
    }   

});

async function addItem(post) {   
    let jwtToken = getCookie("JTW");
    let username = getCookie("UserName");

    try{   
        let response = await fetch(url + '/item/new/'+username, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                'Authorization': jwtToken            
            },
            body: JSON.stringify({
            "name":post.name,           
            "description":post.description,
            "price":post.price,
            "category":post.category,
            "imageUrl": img ? img : "https://i.ibb.co/qWNMttz/test-361512-640.webp"
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

function fillPostData(){
    var post = {};   

    if(document.getElementById("name").value.length < 50){
        post.name = document.getElementById("name").value;
    }
    else{
        document.getElementById("response").innerHTML = "Name to long";
        return false; 
    }  

    if(document.getElementById("description").value.length < 200){
        post.description = document.getElementById("description").value; 
    }
    else{
        document.getElementById("response").innerHTML = "Content to long";
        return false; 
    }  

    if(document.getElementById("price").value < 999) {  
        post.price = document.getElementById("price").value;    
    }    
    else{
        document.getElementById("response").innerHTML = "Greedy people are bad people <(^.^)>";
        return false; 
    }
    if(document.getElementById("category").value.length < 50) {  
        post.category = document.getElementById("category").value;    
    }    
    else{
        document.getElementById("response").innerHTML = "Invalid category";
        return false; 
    }     
    return post;

}

function clearPostData(){
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
}

function homepage(){
    window.location.href = "http://127.0.0.1:5500/index.html";
}

document.getElementById("imageUpload").addEventListener("click", async function(event) {

    const apiKey = '23e1193eb5a7e3a11ab320ea606bf2f7';  
    const imageInput = document.getElementById('imageInput');

    // Ensure file is selected
    if (!imageInput.files.length) {
      alert('Please select an image file!');
      return;
    }

    const imageFile = imageInput.files[0];
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const reader = new FileReader();

    reader.onloadend = async function() {
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        console.log('Image uploaded:', data.data.url);
        img = data.data.url;
      } else {
        console.error('Error uploading image:', data);
      }
    };
    reader.readAsDataURL(imageFile);  

  })

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

    if(!(await autologin()))  window.location.href = "http://127.0.0.1:5500/index.html"; 
});

 async function getOrders(){
     let orders = await getOrdersFromApi();
     console.log(orders);
     displayOrders(orders);
 }

async function getOrdersFromApi(){
    const token = getCookie("JTW");
    const username = getCookie("UserName");
    var offset = 0;
    var limit = 1000;
    var paymentStatus = "pending";

    if (!token) {
        // Redirect to login if no token is found
        window.location.href = "http://127.0.0.1:5500/index.html";
        return;
    }
    // Fetch Orders directly using the token
    try{
        let response = await fetch(url + '/order/all/' + username + "?offset=" + offset + "&limit=" + limit + "&paymentStatus=" + paymentStatus, {
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

    
function displayOrders(orders) {
    const container = document.getElementById('ordersContainer'); // Select the container div
    container.innerHTML = ''; // Clear existing content in the container

    orders.forEach(order => {
        const newOrder = document.createElement("div");
        newOrder.className = "order"; // Set a class for styling

        // Create and append ID
        const idSpan = document.createElement("span");
        idSpan.className = "text";
        idSpan.textContent = "Order ID: " + order.id;
        newOrder.appendChild(idSpan);

        // Create a container for products
        const productsContainer = document.createElement("div");
        productsContainer.className = "products-container";
        
        // Create and append a header for products
        const productsHeader = document.createElement("span");
        productsHeader.className = "text";
        productsHeader.textContent = "Products:";
        productsContainer.appendChild(productsHeader);

        // Check if products is an array, if not handle accordingly
        if (Array.isArray(order.products)) {
            // Loop through each product and add it to the products container
            order.products.forEach(product => {
                const productSpan = document.createElement("span");
                productSpan.className = "product-item";
                productSpan.textContent = product;
                productsContainer.appendChild(productSpan);
            });
        } else if (typeof order.products === 'string') {
            // If products is a string, treat it as a single product
            const productSpan = document.createElement("span");
            productSpan.className = "product-item";
            productSpan.textContent = order.products;
            productsContainer.appendChild(productSpan);
        } else {
            // Handle cases where products is undefined or another type
            const noProductsSpan = document.createElement("span");
            noProductsSpan.className = "product-item";
            noProductsSpan.textContent = "No products available";
            productsContainer.appendChild(noProductsSpan);
        }

        // Append the products container to the order
        newOrder.appendChild(productsContainer);

        // Create and append Total Price
        const totalPriceSpan = document.createElement("span");
        totalPriceSpan.className = "text";
        const totalPrice = order.totalPrice !== undefined ? order.totalPrice.toFixed(2) : '0.00';
        totalPriceSpan.textContent = "Total Price: $" + totalPrice;
        newOrder.appendChild(totalPriceSpan);

        // Create and append Customer Name
        const customerNameSpan = document.createElement("span");
        customerNameSpan.className = "text";
        customerNameSpan.textContent = "Customer Name: " + order.customerName;
        newOrder.appendChild(customerNameSpan);

        // Create and append Customer Address
        const customerAddressSpan = document.createElement("span");
        customerAddressSpan.className = "text";
        customerAddressSpan.textContent = "Customer Address: " + order.customerAddress;
        newOrder.appendChild(customerAddressSpan);

        // Create and append Customer Email
        const customerEmailSpan = document.createElement("span");
        customerEmailSpan.className = "text";
        customerEmailSpan.textContent = "Customer Email: " + order.customerEmail;
        newOrder.appendChild(customerEmailSpan);

        // Create and append Payment Status
        const paymentStatusSpan = document.createElement("span");
        paymentStatusSpan.className = "text";
        paymentStatusSpan.textContent = "Payment Status: " + order.paymentStatus;
        newOrder.appendChild(paymentStatusSpan);

        // Optionally add some spacing and styles for better UI
        newOrder.style.marginBottom = "15px";
        newOrder.style.padding = "10px";
        newOrder.style.border = "1px solid #ccc";
        newOrder.style.borderRadius = "5px";
        newOrder.style.backgroundColor = "#f9f9f9";
        newOrder.style.display = "flex";
        newOrder.style.flexDirection = "column";
        newOrder.style.gap = "5px";

        container.appendChild(newOrder);
    });
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
    
    
    
    
