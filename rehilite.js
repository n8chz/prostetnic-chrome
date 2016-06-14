// restore any highlights previously applied to the page we have just opened:

console.log("entered rehilite.js");


var partialURL = document.location.href.split(":")[1].split("#")[0];

chrome.storage.local.get(partialURL, function (items) {
  if (items[partialURL]) {
   items[partialURL].hilites.forEach(function (hiliteRecord) {
     console.log(`looking to rehilite text: "${hiliteRecord}"`);
     window.find(hiliteRecord.text, false, false, false, false, false, false);
     hiliteSelection();
   });
  }
  else {
   console.log("no hilites found for this page");
  }
});
