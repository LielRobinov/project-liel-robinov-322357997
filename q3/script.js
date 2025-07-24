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

document.getElementById('form').addEventListener('submit' , function(e){
    e.preventDefault();

    const errors = [];
    const channel = document.getElementById('channel').value.trim();
    const targetTime = document.getElementById('time').value;
    const arrivalTime = document.getElementById('arrivalTime').value;
    const email = document.getElementById('email').value.trim();
    const multi = document.querySelector('input[name="multi"]:checked');
    const security = document.getElementById('securityLevel').value;

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

    if (targetTime) {  
        if (arrivalDate < targetTimeDate) {
            errors.push("זמן נחיתה בפועל לא יכול להיות לפני זמן היעד");
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
    } 
    else {
    showMessage("הדיווח התקבל בהצלחה! צוות המרחב הזמני ייצור קשר בקרוב.", 'success');
    this.reset();
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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

    }
}


function renderItems() {

    const list = document.getElementById("faultList");
    list.innerHTML = '';

    const items = loadItems();
    const filterValue = document.getElementById("filter").value;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        // סינון לפי רמת אבטחה אם נבחר משהו
        if (filterValue !== 'all' && item.security !== filterValue) {
            continue;
        }

        var div = document.createElement("div");
        div.className = "item";
        div.style.border = "1px solid #ccc";
        div.style.margin = "10px";
        div.style.padding = "10px";
        div.style.borderRadius = "8px";
        div.style.backgroundColor = item.security === "גבוהה" ? "#ffebee" : (item.security === "בינונית" ? "#fffde7" : "#e8f5e9");

        div.innerHTML =
            "<strong>מספר תעלה:</strong> " + item.channel + "<br>" +
            "<strong>זמן יעד:</strong> " + item.targetTime + "<br>" +
            "<strong>זמן נחיתה בפועל:</strong> " + item.arrivalTime + "<br>" +
            "<strong>אימייל:</strong> " + item.email + "<br>" +
            "<strong>רבים חצו?:</strong> " + item.multi + "<br>" +
            "<strong>רמת אבטחה:</strong> " + item.security + "<br>" +
            "<strong>סטטוס:</strong> " + (item.status || "פתוחה") + "<br><br>" +
            "<button onclick=\"deleteItem('" + item.id + "')\">מחיקה</button> " +
            "<button onclick=\"updateItem('" + item.id + "')\">החלף סטטוס</button>";

        list.appendChild(div);
    }
}
