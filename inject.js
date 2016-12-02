/* life in the page  */
// {
//   action: ""
//   data: xxx
// }

var SUCCESS = 200, FAILURE = 500;
var enable;



function getCurrentTabContent(cb) {
  return document.body.outerHTML;
}

function changeContent(originContent) {
  sendMessageToBackground("inOtherWords", originContent, function(response) {
    var status = response.status;

    if(status === SUCCESS) {
      var newContent = response.newContent;

      // TODO set content

      cb(SUCCESS);
    } else {
      cb(FAILURE);
    }
  });
}

function sendMessageToBackground(message, data, callback) {
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
