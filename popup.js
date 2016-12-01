// {
//   action: ""
//   data: xxx
// }

var switchElement;
var SUCCESS = 200, FAILURE = 500;

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

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

  if(switchValue.indexOf("true") != -1) {
    switchElement.innerHTML = "Processing...";
    action = "switchOff";
    valueToSet = false;
  } else if(switchValue.indexOf("false") != 1) {
    switchElement.innerHTML = "Processing...";
    action = "switchOn";
    valueToSet = true;
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
      enable = false;
    }
    switchElement.innerHTML = enable;
    switchElement.addEventListener("click", clickSwitch);
  });
}) ()



