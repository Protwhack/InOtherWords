/* life in the browser  */
// {
//   action: ""
//   data: xxx
// }
var SUCCESS = 200, FAILURE = 500;

// TODO finish mapping data
var mappingData = {
  gender: {
    neuter: {
      "媽媽": "雙親"
    },
    antonym: {
      "媽媽": "爸爸",
      "爸爸": "媽媽"
    }
  }//,
  // racist: {},
};



function changeContentToMappingData(originContent, cb) {
  // TODO change content to mapping data, then return status
  var newContent = originContent;

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
        break;
    }
    return true;
  });
}

(function init() {
  setMessageListener();
})()


