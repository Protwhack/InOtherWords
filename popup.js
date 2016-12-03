// {
//   action: ""
//   data: xxx
// }

const SUCCESS = 200, FAILURE = 500;

var switchElement;
var captureElement;
var uploadElement;
var cropper;



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


function clickCapture() {
    // chrome.windows.getCurrent(function (win) {
    //   chrome.tabs.captureVisibleTab(win.id,{"format":"png"}, function(imgUrl) {
    //     alert(imgUrl);
    //   });
    // });
    chrome.tabs.captureVisibleTab(null,{"format":"png"},function(dataUrl){
        // alert(dataUrl);
        var image = document.getElementById("captureImage");
        image.setAttribute( "src", dataUrl );
        cropper = new Cropper(image, {
            crop: function(e) {
                // console.log(e.detail.x);
                // console.log(e.detail.y);
                // console.log(e.detail.width);
                // console.log(e.detail.height);
                // console.log(e.detail.rotate);
                // console.log(e.detail.scaleX);
                // console.log(e.detail.scaleY);
            }
        });
    });

}

function clickUpload() {
    cropper.disable();
    var dataURL = cropper.getCroppedCanvas().toDataURL();
    var image = document.getElementById("captureImage");
    image.setAttribute( "src", dataURL );
    cropper.destroy();
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
}) ()



