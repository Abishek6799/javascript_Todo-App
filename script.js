// First select the elements
const entrylist = document.getElementById("list");
const totalBal = document.getElementById("netBal");
const incomeBal = document.getElementById("incomeBal");
const expBal = document.getElementById("expBal");
const form = document.getElementById("incomevalue"); 
const radioButtons = document.querySelectorAll('input[name="filter"]');

// Create the Empty arr to store the datas
let data = [];

// Target the description and amount to store the data in lacal storage
const addEntry = () =>{
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.querySelector('input[name="filter"]:checked').id; 
    
    if(description && !isNaN(amount)){
        const entry = {description,amount,type};
    data.push(entry);
    localStorage.setItem("data",JSON.stringify(data));
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    updateDataList();
    updateTotal();
    }else {
        alert("Please enter a valid description and amount.");
    }   
};


// update the values in the user interface and add the edit button and delete button and update in the local storage 
const updateDataList = () =>{
        entrylist.innerHTML = "";
        const filter = document.querySelector('input[name="filter"]:checked').id;

        data.forEach(entry =>{
                if(filter === "all" || entry.type === filter){
                    const li = document.createElement('li');
                    li.className = "listaData"
                    li.innerText = `${entry.description}  : ₹ ${entry.amount} (${entry.type})`;
                    const editBtn = document.createElement("button");
                    editBtn.innerText = "Edit";
                    editBtn.className = "btnEdit"
                    editBtn.addEventListener("click",()=>{
                        
                        document.getElementById('description').value = entry.description;
                        document.getElementById('amount').value = entry.amount;
                        document.querySelector(`input[name="filter"][id="${entry.type}"]`).checked = true; 
                        data=data.filter( e => e !==entry);
                        updateDataList();
                    });
                    const delbtn = document.createElement("button");
                    delbtn.innerText = "Delete";
                    delbtn.className = "delbtn"
                    delbtn.addEventListener("click", ()=>{
                        data=data.filter( e => e !==entry);
                        localStorage.setItem("data",JSON.stringify(data));
                        updateDataList();
                        updateTotal();
                    });
                    li.appendChild(editBtn);
                    li.appendChild(delbtn);
                    entrylist.appendChild(li);   
                }     
        });      
};

// update the total values
const updateTotal = () =>{
    const totalincome =  data.reduce((acc,entry) => entry.type === "income" ? acc +  entry.amount : acc, 0);
    const totalExp = data.reduce((acc, entry) => entry.type === 'expense' ? acc +  entry.amount : acc, 0);
    const netBalance = totalincome - totalExp;

    totalBal.innerText = `₹ ${netBalance.toFixed(2)}`;
    incomeBal.innerText = `₹ ${totalincome.toFixed(2)}`;
    expBal.innerText = `₹ ${totalExp.toFixed(2)}`;
};

// load the data from local storage
const loadEntries = () => {
    data =  JSON.parse(localStorage.getItem("data"))  || [] ;
    updateDataList();
    updateTotal();
};


// If i click the all radio button then the form will by hide
const formHide = () => {
    if (document.getElementById("all").checked) {
        form.style.display = "none"; 
    } else {
        form.style.display = "block"; 
    }
};

// if i click the radio button it will by update the type which will be we click
radioButtons.forEach(radio => {
    radio.addEventListener('change', () =>{
        
        formHide();
        updateDataList();
    });
});


// call function
loadEntries();
document.getElementById('addData').addEventListener('click', addEntry);
formHide()