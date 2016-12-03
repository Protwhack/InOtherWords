// {
//   action: ""
//   data: xxx
// }
// mappingData[theme][mode]

const SUCCESS = 200, FAILURE = 500;

var shareElement;



function sendMessageToInject(action, data, callback) {
  console.log("sendMessageToInject");

  if(isFunction(data)) {
    callback = data;
    data = undefined;
  }

  var message = {
    action: action,
    data: data
  };

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    if(activeTab) {
      var argumentsToSend = [activeTab.id, message];
      if(callback) {
        argumentsToSend.push(callback);
      }
      chrome.tabs.sendMessage.apply(this, argumentsToSend);
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



// switch on/off
function clickSwitch() {
  var action, valueToSet;
  var switchValue = switchElement.innerHTML;

  if(switchValue.indexOf("返回原文") != -1) {
    switchElement.innerHTML = "處理中...";
    action = "switchOff";
    valueToSet = "改變視角吧";
  } else if(switchValue.indexOf("改變視角吧") != 1) {
    switchElement.innerHTML = "處理中...";
    action = "switchOn";
    valueToSet = '返回原文';
  } else {
    return;
  }

  sendMessageToInject(action, function(status) {
    if(status === SUCCESS) {
      switchElement.innerHTML = valueToSet;
    } else {
      switchElement.innerHTML = !valueToSet;
    }
  });
}



function clickShare() {
  sendMessageToBackground("shareToFacebook", "https://shopping.friday.tw");
}



(function () {
  switchElement = document.getElementById("switch");
  shareElement = document.getElementById("share");
  sendMessageToInject("isCurrentTabEnable", function(enable) {
    if(enable === undefined) {
      enable = "改變視角吧";
    }
    switchElement.innerHTML = enable;
    switchElement.addEventListener("click", clickSwitch);
  });
  shareElement.addEventListener("click", clickShare);
})()




