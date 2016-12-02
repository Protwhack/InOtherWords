/* life in the page  */
// {
//   action: ""
//   data: xxx
// }

const SUCCESS = 200, FAILURE = 500;
// const THEME_GENDER = 0;
// const MODE_NEUTER = 0, MODE_ANTONYM = 1;

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

  chrome.runtime.sendMessage(message, callback);
}

function setMessageListeners() {
  console.log("setMessageListeners");
  var action;
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    action = message.action;
    switch(action) {
      
      case "switchOn":
        getCurrentTabContent(function() {
          enable = true;
          sendResponse(SUCCESS);
        });
        return true;
      
      case "switchOff":
        sendResponse(SUCCESS);
        // TODO reload page
        break;

      case "isCurrentTabEnable":
        sendResponse(enable);
        break;
    }
  });
}



(function init() {
  enable = false;
  setMessageListeners();
})()
