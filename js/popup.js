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
var themes, modes;
var themeElement, modeElement;



function initTabs() {
  var active;

  tabLink = document.getElementsByClassName("tab-link");
  tabLink[0].className = "tab-link active";

  for (var i = 0; i < tabLink.length; i++) {
    active = tabLink[i];
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



function initThemeAndMode(data) {
  var themeSelected = data.theme;
  var themeSelectedIndex = 1;

  if(!themeElement) {
    themeElement = document.querySelector("select.theme");
  }

  themes = Object.keys(MappingData);
  for(var i = 0, theme; i < themes.length; i++) {
    option = document.createElement("option");
    theme = themes[i];
    option.text = theme;
    themeElement.add(option);

    if(themeSelected && themeSelected === theme) {
      themeSelectedIndex = i;
    }
  }

  // Default
  themeElement.selectedIndex = themeSelectedIndex;
  setModeOptions(themes[themeSelectedIndex], data.mode);

  themeElement.addEventListener("change", function(value) {
    setModeOptions(themes[themeElement.selectedIndex]);
  });
}



function setModeOptions(theme, modeSelected) {
  var modeSelectedIndex;

  if(!modeElement) {
    modeElement = document.querySelector("select.mode");
  }

  resetOptions(modeElement);

  modes = Object.keys(MappingData[theme]);
  for(var i = 0, mode; i < modes.length; i++) {
    option = document.createElement("option");
    mode = modes[i];
    option.text = mode;
    modeElement.add(option);

    if(modeSelected && modeSelected === mode) {
      modeSelectedIndex = i;
    }
  }

  modeElement.selectedIndex = modeSelectedIndex || 0;
}



function resetOptions(selectElement) {
  var optionLength = selectElement.options.length;
  for(var i = optionLength - 1; i >= 0; i--) {
    selectElement.remove(i);
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
  var data = {
    theme: themes[themeElement.selectedIndex],
    mode: modes[modeElement.selectedIndex]
  };

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

  sendMessageToInject(action, data, function(status) {
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

  if (cropper !== undefined) {
    cropper.destroy();
  }

  chrome.tabs.captureVisibleTab(null, {"format": "png"}, function(dataUrl) {
    var image = document.getElementById("captureImage");
    image.setAttribute( "src", dataUrl);
    cropper = new Cropper(image);
  });

}



function clickUpload() {
  cropper.disable();
  var imageDataUrl = cropper.getCroppedCanvas().toDataURL();
  var image = document.getElementById("captureImage");
  image.setAttribute("src", imageDataUrl);
  cropper.destroy();
  window.close();
  sendMessageToBackground("shareToFacebook", imageDataUrl);
}



(function () {
  var enable;

  switchElement = document.getElementById("switch");
  captureElement = document.getElementById("capture");
  uploadElement = document.getElementById("upload");
  captureElement.addEventListener("click", clickCapture);
  uploadElement.addEventListener("click", clickUpload);

  sendMessageToInject("getCurrentTabStatus", function(status) {
    enable = status.enable;

    if(enable === undefined) {
      enable = "改變視角吧";
    }
    
    switchElement.innerHTML = enable;
    switchElement.addEventListener("click", clickSwitch);

    initThemeAndMode(status);
  });

  initTabs();
})()




