
document.getElementById("back").addEventListener("click", async function(event) {
    window.location.href = 'index.html';   

});


function displayItmes() {
    const tableBody = document.getElementById('clientTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    jsonStringItemCart = getCookie("ItemCart");
    
    itemCart = jsonStringItemCart ? JSON.parse(jsonStringItemCart) : []; 

    if(itemCart.length == 0) return 0; 

    itemCart.forEach(item => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = item.id || 'No name available';
        row.insertCell(1).textContent = item.name || 'No name available';
        row.insertCell(2).textContent = item.description || 'No name available';
        row.insertCell(3).textContent = item.price || 'No name available';
        row.insertCell(4).textContent = item.category || 'No name available';         

    });
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


document.addEventListener('DOMContentLoaded',  async function() { 
    displayItmes();
    document.getElementById("price").innerHTML = "Total price is: " + calcutalePrice();
    

});
