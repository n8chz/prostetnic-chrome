chrome.storage.local.get("$style", function (value) {
  if (!value["$style"]) {
   chrome.storage.local.set({
     "$style": "background-color: yellow; color: black;"
   });
  }
});

chrome.contextMenus.create({
  title: "Highlight current selection",
  contexts: ["selection"],
  onclick: function (obj, tab) {
   chrome.tabs.executeScript(null, {
     file: "lib.js"
   }, function () {
     chrome.tabs.executeScript(null, {
       file: "save.js"
     });
   });
  }
});

function selectColor(obj, tab) {
 chrome.windows.create({
   url: chrome.extension.getURL("picker.html"),
   type: "popup",
   height: 500,
   width: 1000
 });
}

chrome.contextMenus.create({
  title: "Select highlighter color",
  contexts: ["all"],
  onclick: selectColor
});

/*
chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({
    url: "./search.html"
  });
});
*/

