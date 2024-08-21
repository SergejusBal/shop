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
    var paymentStatus = document.getElementById("select-payment").value;

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


    const container = document.getElementById('ordersContainer'); 
    container.innerHTML = ''; 

    orders.forEach(order => {
        const newOrder = document.createElement("div");
        newOrder.className = "order"; 
        
        const idSpan = document.createElement("span");
        idSpan.className = "id";
        idSpan.textContent = "Order ID: " + order.id;
        newOrder.appendChild(idSpan);

        const orderTable = createTable(order.products);
        newOrder.appendChild(orderTable);

        const itemBody = document.createElement("div");
        itemBody.className = "order-data";

            const spamName = document.createElement("span");
            const spamAddress = document.createElement("span");
            const spamEmail = document.createElement("span");

            spamName.textContent = "Customer name: " + (order.customerName ? order.customerName : "No data");
            spamAddress.textContent = "Customer Address: " + (order.customerAddress ? order.customerAddress : "No data");
            spamEmail.textContent = "Customer Email: " + (order.customerEmail ? order.customerEmail :"No data");

        itemBody.appendChild(spamName);
        itemBody.appendChild(spamAddress);
        itemBody.appendChild(spamEmail);

        newOrder.appendChild(itemBody);

        const orderInfo = document.createElement("div");
        orderInfo.className = "order-info";
        
            const price = document.createElement("span");
            price.className = "price";
            price.textContent = "Total price: " + order.totalPrices + " EUR";
            const status = document.createElement("span");
            status.className = "status";
            status.textContent = "Status: " + order.paymentStatus;

            orderInfo.appendChild(status);
            orderInfo.appendChild(price);            

            newOrder.appendChild(orderInfo); 

        const buttonDiv = document.createElement("div");
        buttonDiv.className = 'button-group';
        buttonDiv.style.width = "100%";

        const modifyButton = document.createElement('button');                
            modifyButton.textContent = 'Edit order';           
            modifyButton.style.width = "100px"; 
            modifyButton.style.alignSelf = "flex-end";      
            modifyButton.onclick = async function() {                                      
                window.location.href = "editOrder.html?id=" + order.id;
            };  

            buttonDiv.appendChild(modifyButton);
            newOrder.appendChild(buttonDiv); 

        container.appendChild(newOrder);
    });
}




function createTable(jsonString){

    let items = createListFromJSONString(jsonString);

    const table = document.createElement('table');
    table.className = "event-table";
    const tableBody = document.createElement('tbody');
    tableBody.className = "";


    const thRow = tableBody.insertRow();

    
    const headers = ["ID", "Name", "Description", "Price", "Category"];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        thRow.appendChild(th);
    });

    items.forEach(item => {
    const row = tableBody.insertRow();
        row.insertCell(0).textContent = item.id || 'No name available';
        row.insertCell(1).textContent = item.name || 'No name available';
        row.insertCell(2).textContent = item.description || 'No name available';
        row.insertCell(3).textContent = item.price || 'No name available';
        row.insertCell(4).textContent = item.category || 'No name available';         

    }); 

    table.appendChild(tableBody);

    return table;
}


function createListFromJSONString(jsonString){
    return jsonString ? JSON.parse(jsonString) : []; 
}

