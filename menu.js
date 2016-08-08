// chrome.storage.local.clear(function () {alert("storage is clear, in theory");});

var cm = chrome.contextMenus.create({
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

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({
    url: "./search.html"
  });
});
