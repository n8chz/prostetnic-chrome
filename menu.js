// chrome.storage.local.clear(function () {alert("storage is clear, in theory");});

var cm = chrome.contextMenus.create({
  title: "Highlight current selection",
  contexts: ["selection"],
  onclick: function (obj, tab) {
   chrome.tabs.executeScript(null, {
     file: "hilite.js" // render highlight on page
   });
   chrome.tabs.executeScript(null, {
     file: "save.js" // make a record of highlight
   });
  }
});
