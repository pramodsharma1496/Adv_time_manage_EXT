document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const addTaskButton = document.getElementById("addTaskButton");
  const taskText = document.getElementById("taskText");
  const taskList = document.getElementById("taskList");

  startButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "startTimer" });
    addTaskButton.disabled = true; // Disable addTaskButton when timer starts
  });

  stopButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "stopTimer" });
    addTaskButton.disabled = false; // Enable addTaskButton when timer stops
  });

  addTaskButton.addEventListener("click", function () {
    const task = taskText.value.trim();
    if (task !== "") {
      chrome.runtime.sendMessage({ action: "addTask", task: task });
      taskText.value = "";
      addTaskToList(task);
    }
  });

  function addTaskToList(task) {
    const taskItem = document.createElement("li");
    const taskNumber = taskList.children.length + 1; // Get the number of tasks
    taskItem.textContent = `${taskNumber}. ${task}`; // Add number in front of task
    taskList.appendChild(taskItem);
    createRemoveButton(taskItem, task); // Add remove button for the task
  }

  function createRemoveButton(taskElement, task) {
    const removeButton = document.createElement("button");
    removeButton.textContent = "x";
    removeButton.className = "removeButton";
    removeButton.addEventListener("click", function () {
      taskList.removeChild(taskElement);
      chrome.runtime.sendMessage({ action: "removeTask", task: task });
    });
    taskElement.appendChild(removeButton);
  }

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "updateTaskList") {
      taskList.innerHTML = ""; // Clear the existing task list
      request.taskList.forEach(function (task) {
        addTaskToList(task);
      });
    }
  });
});
