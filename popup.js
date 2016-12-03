// {
//   action: ""
//   data: xxx
// }

const SUCCESS = 200, FAILURE = 500;

var switchElement;



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
    chrome.tabs.sendMessage(tabs[0].id, message, callback);
  });
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



(function () {
  switchElement = document.getElementById("switch");
  sendMessageToInject("isCurrentTabEnable", function(enable) {
    if(enable === undefined) {
      enable = "改變視角吧";
    }
    switchElement.innerHTML = enable;
    switchElement.addEventListener("click", clickSwitch);
  });
}) ()



