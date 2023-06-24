document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");

  startButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "startTimer" });
  });

  stopButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "stopTimer" });
  });
});
