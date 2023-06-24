let timerId = null;
let isTimerRunning = false;
let workDuration = 25 * 60; // 25 minutes
let breakDuration = 5 * 60; // 5 minutes
let tasks = []; // Array to store the tasks

function startTimer(duration, isBreak) {
  let timer = duration;
  isTimerRunning = true;
  timerId = setInterval(function () {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let color = isBreak ? [0, 255, 0, 255] : [0, 0, 0, 0]; // Green for break time, transparent for work time
    chrome.action.setBadgeBackgroundColor({ color: color });
    chrome.action.setBadgeText({ text: minutes + ":" + seconds });

    if (--timer < 0) {
      clearInterval(timerId);
      isTimerRunning = false;

      if (isBreak) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Focus Timer",
          message: "Work time! Stay focused.",
        });
        startTimer(workDuration, false); // Start work time
      } else {
        if (tasks.length > 0) {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Focus Timer",
            message: "Break time! Take a short break.",
          });
          startTimer(breakDuration, true); // Start break time
        } else {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Focus Timer",
            message: "Work completed!",
          });
          stopTimer();
        }
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  isTimerRunning = false;
  chrome.action.setBadgeText({ text: "" });
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "startTimer" && !isTimerRunning) {
    if (tasks.length > 0) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Focus Timer",
        message: "Work time! Stay focused.",
      });
      startTimer(workDuration, false); // Start work time
    }
  } else if (request.action === "stopTimer") {
    stopTimer();
  } else if (request.action === "addTask") {
    const task = request.task;
    tasks.push(task);
    chrome.runtime.sendMessage({ action: "updateTaskList", taskList: tasks });
  } else if (request.action === "removeTask") {
    const task = request.task;
    const taskIndex = tasks.indexOf(task);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      chrome.runtime.sendMessage({ action: "updateTaskList", taskList: tasks });
    }
  }
});
