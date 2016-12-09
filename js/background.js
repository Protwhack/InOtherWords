/* life in the browser  */
// {
//   action: ""
//   data: xxx
// }
// mappingData[theme][mode]

const SUCCESS = 200, FAILURE = 500;

var s3;



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



function changeContentToMappingData(originContent, cb) {

  var newContent = originContent;
  var keyValues = MappingData["gender"]["neuter"];
  var regex, keyToBeReplaced, matches;
  var stubStr = "<span class='replaced'></span>";

  for(var key in keyValues) {
    console.log("key", key);
    regex = new RegExp(key + "(?!<span class='replaced)", "g");
    // keyToBeReplaced = key.replace(/.+/g, "$1<span class='replaced'></span>");
    matches = key.match(/.{1}/g);
    keyToBeReplaced = matches.join(stubStr) + stubStr;
    newContent = newContent.replace(regex,
      "<span class='emphasize'>" + keyValues[key] + "</span><span class='strike-through'>" + keyToBeReplaced + "</span>");
  };

  cb({status: SUCCESS, newContent: newContent});
}



function resetContent(originContent, cb) {
  var newContent = originContent;
  var regex = new RegExp(/<span class="emphasize">([-'a-z\u4e00-\u9eff]+?)<\/span><span class="strike-through">([-'a-z\u4e00-\u9eff(<span class=\"replaced\"><\/span>)]+?)<\/span>/, "g");
  newContent = newContent.replace(regex, "$2");
  cb({status: SUCCESS, newContent: newContent});
}

function addStrikeThrough(originContent, cb) {
  var newContent = originContent;
  var regex = new RegExp(/(<span class="emphasize">[-'a-z\u4e00-\u9eff]+?<\/span><span class=)"hidden"(>[-'a-z\u4e00-\u9eff]+?<\/span>)/, "g");
  newContent = newContent.replace(regex, "$1strike-through$2");
  cb({status: SUCCESS, newContent: newContent});
}

function removeStrikeThrough(originContent, cb) {
  var newContent = originContent;
  var regex = new RegExp(/(<span class="emphasize">[-'a-z\u4e00-\u9eff]+?<\/span><span class=)"strike-through"(>[-'a-z\u4e00-\u9eff]+?<\/span>)/, "g");
  newContent = newContent.replace(regex, "$1hidden$2");
  cb({status: SUCCESS, newContent: newContent});
}



function setMessageListener() {
  console.log("setMessageListener");
  var action;

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    action = message.action;

    switch(action) {

      case "inOtherWords":
        var originContent = message.data;
        changeContentToMappingData(originContent, sendResponse);
        return true;

      case "inOriginalWords":
        var originContent = message.data;
        resetContent(originContent, sendResponse);
        return true;

      case "addStrikeThrough":
        var originContent = message.data;
        addStrikeThrough(originContent, sendResponse);
        return true;

      case "removeStrikeThrough":
        var originContent = message.data;
        removeStrikeThrough(originContent, sendResponse);
        return true;

      case "shareToFacebook":
        uploadPhotoToS3(message.data, function(error, imageLink) {
          if(error) {
            return;
          }
          sendMessageToInject("fb.browser_action.click", imageLink);
        });
        break;
    }
  });
}



function getCurrentTab(cb) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    cb(tabs[0]);
    return;
  });
}

function generateFilename(cb) {
  getCurrentTab(function(activeTab) {
    if(activeTab) {
      cb(addTimestamp(activeTab.url));
    } else {
      cb(addTimestamp()); 
    }
    return;
  });
}

function uploadPhotoToS3(imageDataUrl, cb) {
  var blobData = dataURItoBlob(imageDataUrl);

  generateFilename(function(filename) {

    s3.upload({
      Key: filename + ".png",
      Body: blobData,
      ACL: 'public-read',
      ContentType: 'image/png'
    }, function(err, data) {

      if (err) {
        console.error('There was an error uploading your photo: ', err.message);
        cb(err);
        return;
      }

      console.log('Successfully uploaded photo.');
      cb(null, data.Location);

    });
  });
}



function initAWS() {
  // AWS.config.loadFromPath('./MYPATH.json');
  AWS.config.update(Config.AWS_CREDENTIALS);
  s3 = new AWS.S3(Config.S3_PARAMS);
}



(function init() {
  initAWS();
  setMessageListener();
})()

