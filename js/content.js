// Messages
var CHECKER_START = "checker_start";
var NOTIFICATION = 'notification';

// Refresh the page rate
// var refreshRateStart = 15 * 1000;
// var refreshRateEnd = 20 * 1000;
// var refreshRate = Math.trunc(Math.random() * (refreshRateEnd - refreshRateStart) + refreshRateStart);

// Wait until Instacart async complete
var asyncWaitTime = 5 * 1000;

// Instacart Path change detect time
// var pathDetectTime = 2 * 1000;

// If Delivery window found
var foundWindow = false;

// Order URL
// var costcoURL = 'costco.com';
// var instacartURL = 'instacart.com';
// var instaOrderPathURL = '/store/checkout_v3';
// var amazonURLRegex = new RegExp("[a-zA-z]+://[a-zA-z]+[.]amazon[.][^\s]*");

var homeURL = "https://www.xiamenair.com/en-cn/home.html";
var detailURL = "https://www.xiamenair.com/en-cn/nticket.html";

// Filter rules
const flightFilter = 'price';
// const wholeFoodsFilter = '.ufss-available';
// const amazonFreshFilter = '.availableSlotLeftHighlight';
// const instacartFilter = "input[name='delivery_option']";
// const primeNowFilter = "div[data-a-input-name='delivery-window-radio'] span.a-color-base";

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
  const containerExist = document.querySelectorAll(filter_rule);
  if (containerExist) {
    console.log("1111111111");
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
function startChecker() {
  window.addEventListener('load', () => {

    if (window.location.href === homeURL) {
      //fill out form only
    } else if (window.location.href.indexOf(detailURL) === 0) {
      //check tickets then fill out form
      setTimeout(function () {
        foundWindow = checkAvailability(flightFilter);
      }, asyncWaitTime);
    }
    // Wait until instacart async complete
    // if (location.hostname.match(costcoURL) || location.hostname.match(instacartURL)) {
    //   // Instacart detect path change to order page
    //   pathchangeMonitor = setInterval(() => {
    //     if (location.pathname == instaOrderPathURL) {
    //       // clear the path detect if now is order page
    //       clearInterval(pathchangeMonitor);
    //       // Wait until async finish
    //       setTimeout(function () {
    //         foundWindow = checkAvailability(instacartFilter);
    //       }, asyncWaitTime);
    //       instaMonitor = setInterval(() => {
    //         if (!foundWindow) location.reload();
    //       }, refreshRate);
    //     }
    //   }, pathDetectTime);
    // } else if (amazonURLRegex.exec(window.location.href)) {
    //   // Amazon monitor
    //   foundWindow = (checkAvailability(wholeFoodsFilter) || checkAvailability(primeNowFilter) || checkAvailability(amazonFreshFilter));
    //   amazonMonitor = setInterval(() => {
    //     if (!foundWindow) location.reload();
    //   }, refreshRate);
    // };
  });
}

// Get state result from storage
chrome.storage.sync.get(['state', 'min_date', 'max_date'], function (result) {
  console.log("now status in content is: " + result.state);
  if (result.state) {
    startChecker();
  }
});