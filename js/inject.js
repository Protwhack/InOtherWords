/* life in the page  */
// {
//   action: ""
//   data: xxx
// }

const SUCCESS = 200, FAILURE = 500;
// const THEME_GENDER = 0;
// const MODE_NEUTER = 0, MODE_ANTONYM = 1;
const APP_ID = Config.FACEBOOK_APP_ID;
const QUOTES = Config.QUOTES;

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

function afterClickCapture(action, originContent, cb) {
  sendMessageToBackground(action, originContent, function(response) {
    var status = response.status;

    if(status === SUCCESS) {
      var newContent = response.newContent;
      document.body.outerHTML = newContent;
      setTimeout(function(){ cb(SUCCESS); }, 1000);
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

      case "addStrikeThrough":
        var originContent = getCurrentTabContent();
        afterClickCapture(action, originContent, function() {
          sendResponse(SUCCESS);
        });
        return true;

      case "removeStrikeThrough":
        var originContent = getCurrentTabContent();
        afterClickCapture(action, originContent, function() {
          sendResponse(SUCCESS);
        });
        return true;


      case "isCurrentTabEnable":
        sendResponse(enable);
        break;

      case "fb.browser_action.click":
        showDialog(
          message.data,
          // window.getSelection().toString(),
          getRandomDefaultQuote(),
          "#Protwhack"//#PolyYou"
        );
        break;
    }
  });
}



function getRandomDefaultQuote() {
  var randomNumber = getRandomInt(0, QUOTES.length);
  return QUOTES[randomNumber];// + "#PolyYou #Protwhack";
}

// Share
// https://www.facebook.com/sharer/sharer.php?app_id=1159597140762325&u=https://in-other-words.s3.amazonaws.com/aaa.png&quote=%E6%88%91%E7%9B%B8%E4%BF%A1%EF%BC%8C%E6%8F%9B%E9%80%99%E5%B9%BE%E5%80%8B%E5%96%AE%E5%AD%97%EF%BC%8C%E7%9C%8B%E8%A6%8B%E4%B8%8D%E4%B8%80%E6%A8%A3%E7%9A%84%E8%A7%92%E5%BA%A6%EF%BC%8C%E4%B8%96%E7%95%8C%E6%9C%83%E6%9B%B4%E8%B1%90%E5%AF%8C%EF%BC%81&hashtag=#Protwhack
// https://www.facebook.com/sharer/sharer.php?app_id=1159597140762325&u=https%3A%2F%2Fin-other-words.s3.amazonaws.com%2Faaa.png&quote=%E6%8F%9B%E5%80%8B%E8%A7%92%E5%BA%A6%EF%BC%8C%E4%B8%96%E7%95%8C%E4%B8%8D%E5%90%8C%E4%BA%86%EF%BC%81&redirect_uri=https%3A%2F%2Fmalikid.github.io&hashtag=[%23Protwhack,%23PolyYou]
// https://www.facebook.com/sharer/sharer.php?app_id=1159597140762325&u=https://in-other-words.s3.amazonaws.com/http%3A//udn.com/news/plus/9434/2119986_1481200851227.png&quote=%E9%80%99%E6%A8%A3%E7%90%86%E8%A7%A3%E6%9B%B4%E5%A5%BD%EF%BC%81%0A%3Ca%20href%3D%27https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fevernote-web-clipper%2Fpioclpoplcdbaefihamjohnefbikjilc%27%3Eextension%20link%20test%3C%2Fa%3E&hashtag=%23Protwhack%20%23PolyYou
// Feed
// https://www.facebook.com/dialog/feed?app_id=1159597140762325&display=popup&amp;caption=An%20example%20caption&link=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https://developers.facebook.com/tools/explorer


function showDialog(currentURL, quote, hashTag) {
  var shareDialogURL = "https://www.facebook.com/sharer/sharer.php?";
  shareDialogURL = shareDialogURL.concat("app_id=", APP_ID);
  shareDialogURL = shareDialogURL.concat("&u=", currentURL);
  if(quote) {
    shareDialogURL = shareDialogURL.concat("&quote=", encodeURIComponent(quote) + "\n" + encodeURIComponent("———《In Other Words》"));
  }
  
  // var picture = currentURL;
  // shareDialogURL = shareDialogURL.concat("&picture=", encodeURIComponent(picture));
  // var title = "aaaaaa"
  // shareDialogURL = shareDialogURL.concat("&title=", encodeURIComponent(title));
  // var description = "bbbbbbdesc"
  // shareDialogURL = shareDialogURL.concat("&description=", encodeURIComponent(description));
  // Chrome Extension link
  // var redirect_uri = "https://shopping.friday.tw"
  // shareDialogURL = shareDialogURL.concat("&redirect_uri=", encodeURIComponent(redirect_uri));
  if(hashTag) {
    shareDialogURL = shareDialogURL.concat("&hashtag=", encodeURIComponent(hashTag));
  }

  var windowSpecs = "toolbar=no, location=no, status=no, menubar=no," +
                    "scrollbars=yes, resizable=yes, width=600, height=400";

  window.open(shareDialogURL, "fbShareWindow", windowSpecs);
}



(function init() {
  enable = "改變視角吧";
  setMessageListeners();
})()


