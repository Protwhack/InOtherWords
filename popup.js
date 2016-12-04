// {
//   action: ""
//   data: xxx
// }
// mappingData[theme][mode]

const SUCCESS = 200, FAILURE = 500;

var switchElement;
var captureElement;
var uploadElement;
var cropper;
var tabLink;

function initTabs() {
  tabLink = document.getElementsByClassName("tab-link");
  var active;

  for (var i = 0; i < tabLink.length; i++) {
    active =  tabLink[i];
    active.addEventListener('click', function (event) {
      event.stopPropagation()
      var currentTab = event.srcElement.parentElement;

      tabLink = document.getElementsByClassName("tab-link");
      for (var i = 0; i < tabLink.length; i++) {
        tabLink[i].className = "tab-link";
      }
      if(currentTab.className === "tab-link")
        currentTab.className = "tab-link active";
    }, false);
  }
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


function clickCapture() {

  // sendMessageToInject("addStrikeThrough", function(status) {
  //   sendMessageToInject("removeStrikeThrough", function(status) {
  //   });
  // });

  if (cropper !== undefined)
    cropper.destroy();

  chrome.tabs.captureVisibleTab(null,{"format":"png"},function(dataUrl){
    var image = document.getElementById("captureImage");
    image.setAttribute( "src", dataUrl );
    cropper = new Cropper(image);
  });

}



function clickUpload() {
  cropper.disable();
  var dataURL = cropper.getCroppedCanvas().toDataURL();
  var image = document.getElementById("captureImage");
  image.setAttribute( "src", dataURL );
  cropper.destroy();
  // TODO:
  sendMessageToBackground("shareToFacebook", dataURL);
  window.close();
}



(function () {
  switchElement = document.getElementById("switch");
  captureElement = document.getElementById("capture");
  uploadElement = document.getElementById("upload");
  captureElement.addEventListener("click", clickCapture);
  uploadElement.addEventListener("click", clickUpload);

  sendMessageToInject("isCurrentTabEnable", function(enable) {
    if(enable === undefined) {
      enable = "改變視角吧";
    }
    switchElement.innerHTML = enable;
    switchElement.addEventListener("click", clickSwitch);
  });

  initTabs();
})()




