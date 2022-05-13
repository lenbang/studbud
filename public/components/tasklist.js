// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("taskform");
const button = document.querySelector("#taskform > button"); // Complex CSS query
const tasklist = document.getElementById("tasklist");
const taskInput = document.getElementById("taskInput");
const clearButton = document.getElementById("clearButton");

// Event listener for Button click
// This could also be form.addEventListener("submit", function() {...} )
button.addEventListener("click", function(event) {
  event.preventDefault(); // Not as necessary for button, but needed for form submit

  //add form data validation here - display message if data is not valid

  let task = form.elements.task.value; // could be swapped out for line below
  //let task = taskInput.value;

  let date = (new Date()).toLocaleDateString('en-US') //Convert to short date format

  // Call the addTask() function using
  addTask(task, date, "26/03/2021", "Low", ["1", "30"], false);

  // Log out the newly populated taskList everytime the button has been pressed
  console.log(taskList);
})

// Create an empty array to store our tasks
var taskList = [];

function loadTasks() {
    for (let i=0; i<localStorage.length; i++) {
        let loadedTask = JSON.parse(localStorage.getItem(localStorage.key(i)));
        console.log(loadedTask);
        let task = {
            id: loadedTask.id, taskDescription: loadedTask.taskDescription, createdDate: loadedTask.createdDate, dueDate: loadedTask.dueDate, priorityRating: loadedTask.priorityRating, estimatedTime: loadedTask.estimatedTime, completionStatus: loadedTask.completionStatus
          };
        taskList.push(task);
        renderTask(task);
    }
}

function addTask(taskDescription, createdDate, dueDate, priorityRating, estimatedTime, completionStatus) {
  let task = {
    id: Date.now(),
    taskDescription,
    createdDate,
    dueDate,
    priorityRating,
    estimatedTime,
    completionStatus
  };

  // Add the task to our array of tasks
  taskList.push(task);

  var key = task.id.toString(); 
  localStorage.setItem(key,JSON.stringify(task));

  // Separate the DOM manipulation from the object creation logic
  renderTask(task);
}


// Function to display the item on the page
function renderTask(task) {
    updateEmpty();
  let item = document.createElement("li");
  item.setAttribute('data-id', task.id);
  item.innerHTML = "<p>" + task.taskDescription + "</p>";

  tasklist.appendChild(item);

  // Setup delete button DOM elements
  let delButton = document.createElement("button");
  let delButtonText = document.createTextNode("Delete");
  delButton.appendChild(delButtonText);
  item.appendChild(delButton); // Adds a delete button to every task

  // Listen for when the 
  delButton.addEventListener("click", function(event){
    event.preventDefault();
    let id = event.target.parentElement.getAttribute('data-id');
    let index = taskList.findIndex(task => task.id === Number(id));
    console.log(index);
    removeItemFromArray(taskList, index);
    updateEmpty();
    item.remove(); // Remove the task item from the page when button clicked
    // Because we used 'let' to define the item, this will always delete the right element
  })
  // Clear the value of the input once the task has been added to the page
  form.reset();
}

function removeItemFromArray(arr, idx) {
    let id = arr[idx].id;
    localStorage.removeItem(id);
    if (idx > -1) {
        arr.splice(idx, 1);
    }
    return arr;
}

clearButton.addEventListener("click", function(event) {
    taskList = [];
    localStorage.clear();
    for (let i=tasklist.children.length-1; i>-1; i--) {
        if (tasklist.children[i].nodeName == "LI") {
            console.log(tasklist.children[i]);
            tasklist.removeChild(tasklist.children[i]);

        }
    }
    // for (let i=0; i<tasklist.children.length; i++) {
    //     if (tasklist.children[i].nodeName == "LI") {
    //         tasklist.removeChild(tasklist.children[i]);
    //     }
    // }
});

function updateEmpty() {
    if (taskList.length > 0) {
        document.getElementById('emptytasklist').style.display = 'none';
    } else {
        document.getElementById('emptytasklist').style.display = 'block';
   
    }

}

loadTasks();