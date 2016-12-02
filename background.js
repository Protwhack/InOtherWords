/* life in the browser  */
// {
//   action: ""
//   data: xxx
// }
const SUCCESS = 200, FAILURE = 500;

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

  var newContent = originContent;
  var keyValues = mappingData["gender"]["neuter"];
  var regex;

  for(var key in keyValues) {
    regex = new RegExp(key, "g");
    newContent = newContent.replace(regex, "<span class='emphasize'>" + keyValues[key] + "</span><span class='hidden'>" + key + "</span>");
    // <span class='strike-through' style='text-decoration:line-through;'>
  };

  cb({status: SUCCESS, newContent: newContent});
}



function resetContent(originContent, cb) {

  var newContent = originContent;
  
  // TODO reset content
  // var regex;
  // regex = new RegExp("<span class='emphasize'>.+</span><span class='hidden'>.+</span>", "g");
  // newContent = newContent.replace(regex, function(str) {
  //   var result = str.slice(str.indexOf("hidden") + 7, str.lastIndexOf("</span>"));
  //   console.log("result", result);
  //   return result;
  // });

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
      case "inOriginalWords":
        var originContent = message.data;
        resetContent(originContent, sendResponse);
        break;
    }
    return true;
  });
}



(function init() {
  setMessageListener();
})()


