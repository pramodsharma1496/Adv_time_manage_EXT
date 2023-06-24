document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const addTaskButton = document.getElementById("addTaskButton");
  const taskText = document.getElementById("taskText");
  const taskList = document.getElementById("taskList");

  startButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "startTimer" });
  });

  stopButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "stopTimer" });
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
    const li = document.createElement("li");
    li.textContent = task;
    taskList.appendChild(li);
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
