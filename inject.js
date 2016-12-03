/* life in the page  */
// {
//   action: ""
//   data: xxx
// }

const SUCCESS = 200, FAILURE = 500;
// const THEME_GENDER = 0;
// const MODE_NEUTER = 0, MODE_ANTONYM = 1;
const APP_ID = Config.FACEBOOK_APP_ID;

var enable;
// var themeSelected = , mode = ;



function getCurrentTabContent(cb) {
  return document.body.outerHTML;
}



function changeContent(originContent, cb) {
  sendMessageToBackground("inOtherWords", originContent, function(response) {
    var status = response.status;

    if(status === SUCCESS) {
      var newContent = response.newContent;
      document.body.outerHTML = newContent;
      cb(SUCCESS);
    } else {
      cb(FAILURE);
    }
  });
}



function resetContent(originContent, cb) {
  sendMessageToBackground("inOriginalWords", originContent, function(response) {
    var status = response.status;

    if(status === SUCCESS) {
      var newContent = response.newContent;
      document.body.outerHTML = newContent;
      cb(SUCCESS);
    } else {
      cb(FAILURE);
    }
  });
}



function sendMessageToBackground(action, data, callback) {
  if(isFunction(data)) {
    callback = data;
    data = undefined;
  }

  var message = {
    action: action,
    data: data
  };

  var argumentsToSend = [message];
  if(callback) {
    argumentsToSend.push(callback);
  }

  chrome.runtime.sendMessage.apply(this, argumentsToSend);
}



function setMessageListeners() {
  console.log("setMessageListeners");
  var action;

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    action = message.action;

    switch(action) {

      case "switchOn":
        var originContent = getCurrentTabContent();
        changeContent(originContent, function() {
          enable = "返回原文";
          sendResponse(SUCCESS);
        });
        return true;

      case "switchOff":
        var originContent = getCurrentTabContent();
        resetContent(originContent, function() {
          enable = "改變視角吧";
          sendResponse(SUCCESS);
        });
        return true;

      case "isCurrentTabEnable":
        sendResponse(enable);
        break;

      case "fb.browser_action.click":
        showDialog(
          window.getSelection().toString(),
          message.data
        );
        break;
    }
  });
}



function showDialog(quote, currentURL) {
  var shareDialogURL = 'https://www.facebook.com/sharer/sharer.php?';
  shareDialogURL = shareDialogURL.concat('app_id=', APP_ID);
  shareDialogURL = shareDialogURL.concat('&u=', currentURL);
  if (quote) {
    shareDialogURL = shareDialogURL.concat('&quote=', quote);
  }

  var windowSpecs = 'toolbar=no, location=no, status=no, menubar=no,' +
                    'scrollbars=yes, resizable=yes, width=600, height=400';
  window.open(shareDialogURL, 'fbShareWindow', windowSpecs);
}



(function init() {
  enable = "改變視角吧";
  setMessageListeners();
})()


