function showMessage(message, type) {
    const MessageElement = document.getElementById("messages");
    MessageElement.textContent = message;
    MessageElement.classList.remove('hidden', 'message-error', 'message-success');

    if (type === 'success') {
        MessageElement.classList.add('message-success');
    }
    else{
        MessageElement.classList.add('message-error');
    }
        setTimeout(function(){
            MessageElement.classList.add('hidden');
            MessageElement.textContent = ''; 
        }, 5000);
}

window.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    if (form){
        form.addEventListener('submit' , function(e){
    e.preventDefault();

    const errors = [];
    const channel = document.getElementById('channel').value.trim();
    const targetTime = document.getElementById('time').value;
    const arrivalTime = document.getElementById('arrivalTime').value;
    const email = document.getElementById('email').value.trim();
    const multi = document.querySelector('input[name="multi"]:checked');
    const security = document.getElementById('securityLevel').value;
    const description = document.getElementById('description').value;


    const messages = document.querySelector('#messages');
    messages.innerHTML = '';

    const now = new Date();
    const arrivalDate = new Date (arrivalTime);
    const targetTimeDate = new Date(targetTime);


    if (!channel){
        errors.push("יש להזין מספר תעלה");
    }

    if (!targetTime){
        errors.push("יש להזין זמן יעד");
    }
    else{
        if (targetTimeDate < now) {
            errors.push("זמן היעד חייב להיות תאריך עתידי");
        }
    }

    if (!arrivalTime){
        errors.push("יש להזין זמן נחיתה בפועל");
    }
    else{
        if (arrivalDate > now){
            errors.push("זמן נחיתה בפועל לא יכול להיות בעתיד");
        }
    }

    if(!multi){
        errors.push("יש לבחור אם יותר מאדם חצה");
    }

    if (!security){
        errors.push("יש לבחור רמת אבטחה");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("יש להזין כתובת אימייל תקינה");
    }

    if (errors.length > 0){
    showMessage(errors.join(" | "), 'error');
    return;
    } 
    let newReport={
        id: Date.now().toString(), // מזהה ייחודי לפי זמן
        channel: channel,
        targetTime: targetTime,
        arrivalTime: arrivalTime,
        email: email,
        multi: multi.value,
        securityLevel: security,
        description: description
    }

    saveItem(newReport);
    renderItems();
    showMessage("הדיווח התקבל בהצלחה! צוות המרחב הזמני ייצור קשר בקרוב.", 'success');
    this.reset();

    setTimeout(function(){
        window.location.href = 'view.html';
        }, 1500);

    })
}
})


const key = 'timeFaults';
function loadItems() {
    let data = localStorage.getItem(key);
    if (data){
        return JSON.parse(data);
    }
    return [];
}
function saveItem (item){
    const items = loadItems();
    items.push(item);
    localStorage.setItem(key, JSON.stringify(items));
}

function deleteItem(id){
    let items = loadItems();
    let newItems = [];
    for (let i = 0 ; i < items.length; i++){
        if (items[i].id !== id){
            newItems.push(items[i]);
        }
    }
    localStorage.setItem(key , JSON.stringify(newItems));
    renderItems(); 
}

function updateItem (id , changes){
    let items = loadItems();
    for (let i = 0 ; i < items.length; i++){
        if (items[i].id === id){
            for (let key in changes){
                if (changes.hasOwnProperty(key)){
                    items[i][key] = changes[key];
                }
            }
            break;
        }
    }

    localStorage.setItem(key, JSON.stringify(items));
    renderItems(); 
}
function renderItems(){
    const list = document.getElementById("faultList");
    if (!list) return;

    let items = loadItems();

    const filterSelect = document.getElementById('filter');
    let filterValue;
    if (filterSelect){
        filterValue = filterSelect.value;
    }
    else{
        filterValue = "all";
    }

    list.innerHTML = "";

    let count = 0;
    for(let i = 0; i < items.length; i++){
        let item = items[i];

        if (filterValue !== "all" && item.description !== filterValue) {
            continue;
        }

        let div = document.createElement("div");
        div.className = "report";
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.style.borderRadius = "5px";

        let data = "<p><strong>מספר תעלה:</strong> " + item.channel + "</p>" +
            "<p><strong>סוג תקלה:</strong> " + item.description + "</p>" +
            "<p><strong>זמן יעד:</strong> " + item.targetTime + "</p>" +
            "<p><strong>זמן נחיתה בפועל:</strong> " + item.arrivalTime + "</p>" +
            "<p><strong>אימייל:</strong> " + item.email + "</p>" +
            "<p><strong>האם יותר מאדם חצה:</strong> " + item.multi + "</p>" +
            "<p><strong>רמת אבטחה:</strong> " + item.securityLevel + "</p>";

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "מחיקה";
        deleteBtn.style.marginRight = "10px";

        deleteBtn.addEventListener("click", function(){
            deleteItem(item.id);
        })

        div.innerHTML = data;
        div.appendChild(deleteBtn);

        list.appendChild(div);
        count++;
    }

    if (count === 0){
        list.innerHTML = "<p>לא נמצאו דיווחים להצגה.</p>"
    }
}

window.addEventListener('DOMContentLoaded', renderItems);


