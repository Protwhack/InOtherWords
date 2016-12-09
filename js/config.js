var Config = (function() {

  var self = {};

  self.FACEBOOK_APP_ID = 1159597140762325; // Facebook official: 123561918055313;

  self.AWS_CREDENTIALS = {
    // region: "us-west-2",
    // credentials: new AWS.CognitoIdentityCredentials({
    //   IdentityPoolId: 'ap-northeast-1_BVxUSytvP'
    // }),
    accessKeyId: "AKIAJIX5GWMIWLH6FLRA",
    secretAccessKey: "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"
  };

  self.S3_PARAMS = {
    apiVersion: "2006-03-01",
    params: {
      Bucket: "in-other-words"
    }
  };

  self.QUOTES = [
    "換個角度，世界不同了！",
    "這樣理解更好！",
    "我相信，換這幾個單字，看見不一樣的角度，世界會更豐富！",
    "我相信，讓文字換個方向跑，世界，會越來越寬廣！"
  ];

  return self;

})();

