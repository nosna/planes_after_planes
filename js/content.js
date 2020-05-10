// Messages
var CHECKER_START = "checker_start";
var NOTIFICATION = 'notification';
var COMMAND_START = 'command_start';

// Wait until Instacart async complete
var asyncWaitTime = 1 * 1000;

// If Delivery window found
var foundWindow = false;

var homeURL = "https://www.xiamenair.com/en-cn/home.html";
var detailURL = "https://www.xiamenair.com/en-cn/nticket.html";

// Filter rules
const flightFilter = '.tax-included';

// Start and page refresh listener
chrome.runtime.onMessage.addListener(function (message) {
  switch (message.type) {
    case CHECKER_START:
      location.reload();
      break;
  }
});

// Using html element to check availability
function checkAvailability(filter_rule) {
  const containerExist = document.querySelector(filter_rule);
  if (containerExist) {
    sendNotification();
    return true;
  }
  return false;
}

// Send Chrome Notification
function sendNotification() {
  chrome.runtime.sendMessage('', {
    type: NOTIFICATION,
    options: {
      title: 'Planes After Planes',
      message: 'Found an available flight!',
      iconUrl: 'img/plane.png',
      type: 'basic'
    }
  });
}

// Run the checker when STATE_RUN
function startChecker(min_date, max_date) {
  window.addEventListener('load', () => {
    if (window.location.href == detailURL) {
      //fill out form
      setTimeout(function () {
        document.querySelector(".vue-city-picker input").focus();
      }, 2000);
      setTimeout(function () {
        document.querySelector(".vcp-panel span").nextElementSibling.click();
      }, 2000);
      setTimeout(function () {
        document.querySelectorAll(".z-hot li")[4].click();
      }, 2000);

      setTimeout(function () {
        document.querySelectorAll(".vue-city-picker input")[1].focus();
      }, 2000);
      setTimeout(function () {
        document.querySelectorAll(".z-hot li")[17].click();
      }, 2000);

      while (new Date(document.querySelectorAll(".day-cell")[83].attributes[1].value) < new Date(min_date)) {
        document.querySelectorAll(".datepicker-nextBtn")[0].click();
      }

      var span_group = document.querySelectorAll(".day-cell");
      for (var i = 0; i < span_group.length; i++) {
        if (span_group[i].attributes[1].value == min_date) {
          span_group[i].click();
          break;
        }
      }
      setTimeout(function () {
        document.getElementsByClassName("right search J_Search")[0].click();
      }, 2000);

      //check
      setTimeout(function () {
        foundWindow = checkAvailability(flightFilter);
      }, asyncWaitTime);
      setTimeout(function () {
        chrome.runtime.sendMessage('', {
          type: COMMAND_START
        })
      }, 10000);
      //
    } else if (window.location.href.indexOf(detailURL) == 0) {
      //check
      setTimeout(function () {
        foundWindow = checkAvailability(flightFilter);
      }, asyncWaitTime);

      var curr_date = document.querySelectorAll(".ing")[3].innerText.substring(0, 10);
      if (curr_date == max_date) {
        location.href = detailURL;
        location.reload();
      }
      setTimeout(function () {
          document.querySelectorAll(".ing")[4].click();
        }, 8000);

        setTimeout(function () {
        chrome.runtime.sendMessage('', {
          type: COMMAND_START
        })
      }, 10000);
    }
    }
  );
}

// Get state result from storage
chrome.storage.sync.get(['state', 'min_date', 'max_date'], function (result) {
  console.log("now status in content is: " + result.state);
  console.log("min date: " + result.min_date);
  console.log("max date: " + result.max_date);
  if (result.state) {
    startChecker(result.min_date, result.max_date);
  }
});