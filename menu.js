// chrome.storage.local.clear(function () {alert("storage is clear, in theory");});

chrome.contextMenus.create({
  title: "Highlight current selection",
  contexts: ["selection"],
  onclick: function (obj, tab) {
   chrome.tabs.executeScript(null, {
     file: "lib.js"
   }, function () {
     chrome.tabs.executeScript(null, {
       file: "save.js"
     }, function () {
       chrome.tabs.executeScript(null, {
         file: "hilite.js" // make a record of highlight
       })
     })
   });
  }
});

function selectColor(obj, tab) {
 chrome.windows.create({
   url: chrome.extension.getURL("picker.html"),
   type: "popup"
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

