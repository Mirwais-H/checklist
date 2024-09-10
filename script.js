
const institutionDropdown = document.getElementById('institution');
const classesDropdown = document.getElementById('classes');

const addTaskButton = document.getElementById('add-task');
const taskInput = document.getElementById('new-task');
const dueDateInput = document.getElementById('due-date');
const dueTimeInput = document.getElementById('due-time');
const taskList = document.getElementById('task-list');

// Predefined classes for each institution
const schoolClasses = ['Advisory', 'Study Hall', 'English Composition: School', 'Advance Algebra', 'AP Computer Science Principles', 'AP Chemistry', 'Robotics', 'AP World History'];
const collegeClasses = ['English Cmposition: College'];

// Function to update the classes dropdown based on institution selection
institutionDropdown.addEventListener('change', function() {
    const selectedInstitution = institutionDropdown.value;

    // Clear previous class options
    classesDropdown.innerHTML = '<option value="" disabled selected>Select Class</option>';

    let classesToAdd = [];
    if (selectedInstitution === 'school') {
        classesToAdd = schoolClasses;
    } else if (selectedInstitution === 'college') {
        classesToAdd = collegeClasses;
    }

    // Add new class options
    classesToAdd.forEach(function(className) {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classesDropdown.appendChild(option);
    });
});

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Add a task
addTaskButton.addEventListener('click', function() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const dueTime = dueTimeInput.value;
  const selectedClass = classesDropdown.value;

  if (taskText !== '' && dueDate !== '' && dueTime !== '' && selectedClass !== '') {
      const dueDateTime = `${dueDate}T${dueTime}`; // Combine date and time for consistency
      addTask(taskText, dueDateTime, selectedClass);
      taskInput.value = '';  // Clear the input
      dueDateInput.value = '';  // Clear the date input
      dueTimeInput.value = '';  // Clear the time input
      institutionDropdown.value = ''; // Reset institution dropdown
      classesDropdown.innerHTML = '<option value="" disabled selected>Select Class</option>'; // Reset class dropdown
  } else {
      alert("Please fill out all fields");
  }
});

// Function to add a new task to the UI
function addTask(task, dueDateTime, selectedClass) {
    const li = document.createElement('li');

    // Task text
    const taskSpan = document.createElement('span');
    taskSpan.textContent = task;
    li.appendChild(taskSpan);

    // Class information
    const classSpan = document.createElement('span');
    classSpan.textContent = `Class: ${selectedClass}`;
    classSpan.classList.add('class-info');
    li.appendChild(classSpan);

    // Due date and time display
    const dueDateSpan = document.createElement('span');
    dueDateSpan.textContent = `Due: ${formatDueDateTime(dueDateTime)}`;
    dueDateSpan.classList.add('due-date');
    li.appendChild(dueDateSpan);

    // Complete button
    const completeButton = document.createElement('button');
    completeButton.textContent = '✓';
    completeButton.addEventListener('click', function() {
        li.classList.toggle('completed');
        updateTaskStatusInLocalStorage(task);
    });
    li.appendChild(completeButton);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', function() {
        li.remove();
        removeTaskFromLocalStorage(task);
    });
    li.appendChild(deleteButton);

    // Add task to list
    taskList.appendChild(li);

    // Save task to localStorage
    saveTaskToLocalStorage(task, dueDateTime, selectedClass);

    // Set reminder
    const taskDueDateTime = new Date(dueDateTime).getTime();
    const currentTime = new Date().getTime();
    const timeUntilDue = taskDueDateTime - currentTime;

    if (timeUntilDue > 0) {
        setTimeout(() => {
            alert(`Reminder: Your task "${task}" is due now!`);
        }, timeUntilDue);
    }
}

// Save task to localStorage
function saveTaskToLocalStorage(task, dueDateTime, selectedClass) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ task, dueDateTime, selectedClass, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


// Remove task from localStorage
function removeTaskFromLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(taskObj => taskObj.task !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task completion status in localStorage
function updateTaskStatusInLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(taskObj => {
        if (taskObj.task === task) {
            taskObj.completed = !taskObj.completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format due date and time into a more readable format
function formatDueDateTime(dueDateTime) {
    const date = new Date(dueDateTime);
    return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
}
