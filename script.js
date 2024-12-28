// Display the current date
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});
document.getElementById('currentDate').textContent = formattedDate;

function addTask() {
    const taskInput = document.getElementById('task');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Task cannot be empty.');
        return;
    }

    const taskItem = createTaskItem(taskText);
    document.getElementById('todoList').appendChild(taskItem);
    taskInput.value = '';
}

function createTaskItem(text) {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';
    listItem.draggable = true;
    listItem.textContent = text;

    listItem.addEventListener('dragstart', () => {
        listItem.classList.add('dragging');
    });

    listItem.addEventListener('dragend', () => {
        listItem.classList.remove('dragging');
    });

    return listItem;
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const list = event.currentTarget;

    if (draggingItem && list) {
        list.appendChild(draggingItem);
    }
}

function getTasksData() {
const tasks = {
    date: document.getElementById('currentDate').textContent,
    todo: Array.from(document.getElementById('todoList').children).map(item => item.textContent),
    doing: Array.from(document.getElementById('doingList').children).map(item => item.textContent),
    completed: Array.from(document.getElementById('completedList').children).map(item => item.textContent),
};
return tasks;
}

function saveToFile() {
const tasksData = getTasksData();

// Format the data as a text file
let fileContent = `---\nDate: ${tasksData.date}\n\n`;
fileContent += "To-Do:\n" + (tasksData.todo.join("\n") || "None") + "\n\n";
fileContent += "Doing:\n" + (tasksData.doing.join("\n") || "None") + "\n\n";
fileContent += "Completed:\n" + (tasksData.completed.join("\n") || "None");

// Create a Blob from the file content
const blob = new Blob([fileContent], { type: "text/plain" });

// Create a link element to download the file
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "tasks.txt";

// Simulate a click on the link to download the file
link.click();

// Clean up the URL object
URL.revokeObjectURL(link.href);
}
function loadTasksFromFile() {
const fileInput = document.getElementById('uploadFile');
const file = fileInput.files[0];

if (!file) {
    alert("Please select a file.");
    return;
}

const reader = new FileReader();
reader.onload = function (event) {
    const content = event.target.result;
    parseAndPopulateTasks(content);
};
reader.readAsText(file);
}

function parseAndPopulateTasks(content) {
const lines = content.split("\n");
let currentSection = null;

// Clear existing tasks
document.getElementById('todoList').innerHTML = "";
document.getElementById('doingList').innerHTML = "";
document.getElementById('completedList').innerHTML = "";

for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("Date:")) {
        const date = trimmedLine.slice(5).trim();
        document.getElementById('currentDate').textContent = date;
    } else if (trimmedLine.startsWith("To-Do:")) {
        currentSection = "todoList";
    } else if (trimmedLine.startsWith("Doing:")) {
        currentSection = "doingList";
    } else if (trimmedLine.startsWith("Completed:")) {
        currentSection = "completedList";
    } else if (trimmedLine && currentSection) {
        const taskItem = createTaskItem(trimmedLine);
        document.getElementById(currentSection).appendChild(taskItem);
    }
}
}