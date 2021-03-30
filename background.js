// This is needed because path is not implemented in Chrome (despite it being documented)
// chrome.declarativeContent.SetIcon({
//   path,
// })
function createSetIconAction(path, callback) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.onload = () => {
    ctx.drawImage(image, 0, 0, 19, 19);
    var imageData = ctx.getImageData(0, 0, 19, 19);
    var action = new chrome.declarativeContent.SetIcon({
      imageData: imageData,
    });
    callback(action);
  };
  image.src = chrome.runtime.getURL(path);
}

chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
  createSetIconAction("icon-enabled.png", (setIconAction) => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            css: ["#__next"],
          }),
        ],
        actions: [setIconAction],
      },
    ]);
  });
});
