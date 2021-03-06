// Messages
var STATE_RUN = true;
var STATE_STOP = false;

var BADGE_TEXT_ON = 'ON';
var BADGE_TEXT_OFF = 'OFF';

var BUTTON_START = 'Start';
var BUTTON_STOP = 'Stop';

var START_BUTTON_ID = "start_button";
var STORED_RESULT_BUTTON_ID = "stored_result_button";
var ALERT_TEXT_ID = 'alert_text';
var COUNTER_TEXT_ID = 'counter_text';
var COMMAND_START = "command_start";
var MIN_DATE_ID = "min_date";
var MAX_DATE_ID = "max_date";

// Default state
var state = false;

var min_date;
var max_date;

// Checkout Path
// var amazonCheckoutPath = '/gp/buy/shipoptionselect/handlers';
// var amazonPrimeCheckoutPath = '/checkout/enter-checkout';
// var instaCheckoutPath = '/store/checkout_v3';
// var amazonFreshCheckoutPath = '/afx/slotselection';

window.onload = function () {
  // Detect if there any checkout pages on the screen
  // chrome.tabs.query({}, function (tabs) {
  //   for (var i = 0; i < tabs.length; ++i) {
  //     tab = tabs[i];
  //     if (tab.url.match(amazonCheckoutPath) || tab.url.match(amazonPrimeCheckoutPath) ||
  //       tab.url.match(instaCheckoutPath) || tab.url.match(amazonFreshCheckoutPath)) {
  //       return;
  //     }
  //   }
  //   document.getElementById(ALERT_TEXT_ID).innerHTML = '<p style="color:red">Error: can\'t find schedule pages</p>';
  // });

  // Init the extension when popup  
  chrome.storage.sync.get(['state'], function (result) {
    if (result.state == STATE_RUN) {
      setButtonStop();
      chrome.browserAction.setBadgeText({
        text: BADGE_TEXT_ON
      });
    } else if (result.state == STATE_STOP) {
      setButtonStart();
      chrome.browserAction.setBadgeText({
        text: BADGE_TEXT_OFF
      });
    }
  });

  // Counter init
  // chrome.storage.sync.get(['count_init'], function (result) {
  //   if (!result.count_init) {
  //     chrome.storage.sync.set({
  //       'succ_count': 0
  //     });
  //     chrome.storage.sync.set({
  //       'count_init': true
  //     });
  //   } else {
  //     // Display notification counts on the panel
  //     chrome.storage.sync.get(['succ_count'], function (result) {
  //       cur_count = result.succ_count;
  //       document.getElementById(COUNTER_TEXT_ID).innerHTML = cur_count;
  //     });
  //   }
  // });

  document.getElementById(STORED_RESULT_BUTTON_ID).onclick = function() {
    window.location.href="./storedRes.html";  
    window.open("./storedRes.html");
  }

  // Start button onclick  
  document.getElementById(START_BUTTON_ID).onclick = function () {
    switch (state) {
      case STATE_RUN:
        setButtonStop();
        chrome.browserAction.setBadgeText({
          text: BADGE_TEXT_ON
        });
        chrome.storage.sync.set({
          'state': true,
          'min_date': document.getElementById(MIN_DATE_ID).value,
          'max_date': document.getElementById(MAX_DATE_ID).value
        });
        chrome.runtime.sendMessage({
          type: COMMAND_START
        });
        chrome.storage.sync.get(['min_date', 'max_date'], function (result) {
          console.log("MIN DATE: " + result.min_date);
          console.log("MAX DATE: " + result.max_date);
        });
        
        break;
      case STATE_STOP:
        setButtonStart();
        chrome.browserAction.setBadgeText({
          text: BADGE_TEXT_OFF
        });
        chrome.storage.sync.set({
          'state': false
        });
        break;
    }
  };

  // Set stop button state
  function setButtonStop() {
    document.getElementById(START_BUTTON_ID).innerHTML = BUTTON_STOP;
    state = STATE_STOP;
  }

  // Set start button state
  function setButtonStart() {
    document.getElementById(START_BUTTON_ID).innerHTML = BUTTON_START;
    state = STATE_RUN;
  }
}