var cm = chrome.contextMenus.create({
  title: "Highlight current selection",
  contexts: ["selection"],
  onclick: function (obj, tab) {
   chrome.runtime.onMessage.addListener(function (hiliteInstance, sender, responder) {
     var record = {};
     record[sender.tab.url] = hiliteInstance;
     chrome.storage.local.set(record);
   });
   chrome.tabs.insertCSS(null, {
     file: "hilite.css"
   });
   chrome.tabs.executeScript(null, {
     file: "hilite.js"
   });
  }
});
