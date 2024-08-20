
document.getElementById("back").addEventListener("click", async function(event) {
    window.location.href = 'index.html';   

});


function displayClients(clients) {
    const tableBody = document.getElementById('clientTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing clients entries

    clients.forEach(clients => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = clients.id || 'No name available';
        row.insertCell(1).textContent = clients.name || 'No name available';
        row.insertCell(2).textContent = clients.surname || 'No name available';
        row.insertCell(3).textContent = clients.email || 'No name available';
        row.insertCell(4).textContent = clients.phone || 'No name available';

         const modifyCell = row.insertCell(5);
                const modifyButton = document.createElement('button');                
                modifyButton.textContent = 'Modify';
                modifyButton.className = 'modify-button';
                modifyButton.onclick = async function() {
                    await setFields(clients.id);                   

                };
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = async function() {
                    if (confirm("Do you want to proceed?")) {                        
                        await deleteClient(clients.id);
                        fetchclientsForEvent();
                    } else {
                        
                    }
                    
                };

                modifyCell.appendChild(modifyButton);
                modifyCell.appendChild(deleteButton);
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
    else logOutState();;


});
