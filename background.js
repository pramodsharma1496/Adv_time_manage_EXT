let timerId = null;
let isTimerRunning = false;
let workDuration = 25 * 60; // 25 minutes
let breakDuration = 5 * 60; // 5 minutes

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
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Focus Timer",
        message: isBreak ? "Work time! Stay focused." : "Break time! Take a short break.",
      });
      startTimer(isBreak ? workDuration : breakDuration, !isBreak);
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
    startTimer(workDuration, false); // Start with work time
  } else if (request.action === "stopTimer") {
    stopTimer();
  }
});
