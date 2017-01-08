// console.log(`rehilite.js checking in`);

// restore any highlights previously applied to the page we have just opened:

var partialURL = document.location.href.split(":")[1].split("#")[0];

chrome.storage.local.get(partialURL, function (items) {
  if (items[partialURL]) {
   items[partialURL].hilites.forEach(function (hilite) {
     if (typeof hilite == "string") {
      chrome.storage.local.get(hilite, function (hiliteObj) {
	var found = window.find(hiliteObj[hilite].text, false, false, false, false, false, false);
        if (found) hiliteSelection(hilite, hiliteObj[hilite].style);
      });
     }
     else {
      window.find(hilite.text, false, false, false, false, false, false);
      hiliteSelection("old", hilite.style);
     }
   });
  }
  else {
   // console.log("no hilites found for this page");
  }
});
