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

// Handle requests to modify highlights

function handleMessage(request, sender, sendResponse) {

 console.log(`sender.tab.id: ${sender.tab.id}`);

 var promise = chrome.windows.create({
   url: chrome.extension.getURL("picker.html"),
   type: "popup",
   height: 501, // kludge!
   width: 1000
 });

 chrome.windows.onRemoved.addListener(function (windowId) {
   chrome.tabs.sendMessage(sender.tab.id, "foo");
/*
   if (promise) {
    console.log(`promise keys: ${JSON.stringify(Object.keys(promise))}}`);
    // color for update will be stored in $modify
    // sendResponse();
   }
*/
 });

}

chrome.runtime.onMessage.addListener(handleMessage);
