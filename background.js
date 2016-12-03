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
      "男女": "雙方",
      "夫妻": "配偶",
      "爸爸媽媽": "雙親",
      "媽媽爸爸": "雙親",
      "父母": "雙親",
      "媽媽": "雙親",
      "爸爸": "雙親",
      "母親": "雙親",
      "父親": "雙親",
      "夫妻財產": "婚姻財產",
      "養父母": "養親",
      "子婦": "子女之配偶",
      "女婿": "子女之配偶",
      "祖父母": "二等親直系血親尊親屬",
      "養父母": "養親",
      "妻子": "另一半",
      "妻(子)": "另一半",
      "丈夫": "另一半",
      "夫": "另一半",
      "太太": "另一半",
      "老婆": "另一半",
      "老公": "另一半",
      "女人": "人",
      "男人": "人",
      "女性": "人",
      "男性": "人",
      "女孩": "孩童",
      "男孩": "孩童"
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
  var regex;

  regex = new RegExp(/<span class="emphasize">([-'a-z\u4e00-\u9eff]{1,50})<\/span><span class="hidden">([-'a-z\u4e00-\u9eff]{1,50})<\/span>/, "g");
  newContent = newContent.replace(regex,"$2");
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


