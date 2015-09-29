var cm = chrome.contextMenus.create({
  title: "Highlight current selection",
  contexts: ["selection"],
  onclick: function (obj, tab) {
   chrome.tabs.insertCSS(null, {
     file: "hilite.css"
   });
   chrome.tabs.executeScript(null, {
     file: "hilite.js"
   });
  }
});
