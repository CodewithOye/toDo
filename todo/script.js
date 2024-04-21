const inputBox = document.querySelector("#input-box")
const listContainer = document.querySelector("#list-container")
const button = document.querySelector("button")
const alarmTimeInput = document.querySelector("#alarm-time")

let alertBox;

button.addEventListener("click", () => {
    if(inputBox.value === ""){
        alert("You must write something!");
    }else{
        let li = document.createElement("li");
        let alarmTime = document.createElement("span");
        alarmTime.className = "alarm-time";
        alarmTime.innerText = alarmTimeInput.value;
        li.textContent = inputBox.value;
        li.appendChild(alarmTime);
        listContainer.appendChild(li)
        let span = document.createElement("span")
        span.innerText= "\u00D7"
        li.appendChild(span);
        saveData()

        // Deleting the List Item
        span.addEventListener('click',()=>{
            li.remove();
            if (alertBox && alertBox.textContent.trim() === li.textContent) {
                alertBox.remove();
                saveData()
            }
        }) 

        // Set alarm for new task
        alarm(alarmTime.innerText, li);
    }
    inputBox.value = ""
    alarmTimeInput.value = ""
    saveData()
});

listContainer.addEventListener("click", (e) => {
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        if (alertBox && alertBox.textContent.trim() === e.target.textContent) {
            alertBox.remove();
            saveData()
        }
    }else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        if (alertBox && alertBox.textContent.trim() === e.target.parentElement.textContent) {
            alertBox.remove();
            saveData()
        }
    }
},false);

// Alarm function
function alarm(alarmTime, li) {
    let currentTime = new Date();
    let currentHours = currentTime.getHours().toString().padStart(2, "0");
    let currentMinutes = currentTime.getMinutes().toString().padStart(2, "0");
    let formattedCurrentTime = `${currentHours}:${currentMinutes}`;

    if (formattedCurrentTime === alarmTime) {
        alertBox = document.createElement("div");
        alertBox.className = "mdl-js-snackbar mdl-snackbar";
        alertBox.innerHTML = `<div class="mdl-snackbar__text">${li.textContent}<span class="space"></span><button class="mdl-snackbar__action" id="ok-button">OK</button></div>`;
        document.body.appendChild(alertBox);
        componentHandler.upgradeElement(alertBox);
        var snackbarContainer = document.querySelector('.mdl-js-snackbar');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: ''});

        // Remove alert when "OK" button is clicked
        let okButton = alertBox.querySelector("#ok-button");
        okButton.addEventListener("click", () => {
            alertBox.remove();
            inputBox.removeAttribute("disabled");
            alarmTimeInput.removeAttribute("disabled");
            button.removeAttribute("disabled");
            let alarmTimes = document.querySelectorAll(".alarm-time");
            alarmTimes.forEach(alarmTime => {
                let li = alarmTime.parentElement;
                if (alertBox && alertBox.textContent.trim() === li.textContent) {
                    alertBox.remove();
                    saveData()
                }
            });
        });

        // Disable "Add List Item" button and input boxes while alert is showing
        inputBox.disabled = true;
        alarmTimeInput.disabled = true;
        button.disabled = true;

        // Clear the interval and set a new timeout for the next alarm
        clearInterval(alarmInterval);
        alarmInterval = setInterval(() => {
            let alarmTimes = document.querySelectorAll(".alarm-time");
            alarmTimes.forEach(alarmTime => {
                let li = alarmTime.parentElement;
                alarm(alarmTime.innerText, li);
                saveData()
            });
        }, 80000);
    }
}

// Initialize the interval
let alarmInterval = setInterval(() => {
    let alarmTimes = document.querySelectorAll(".alarm-time");
    alarmTimes.forEach(alarmTime => {
        let li = alarmTime.parentElement;
        alarm(alarmTime.innerText, li);
    });
}, 6000);

function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask()