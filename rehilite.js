// restore any highlights previously applied to the page we have just opened:


var partialURL = document.location.href.split(":")[1].split("#")[0];

chrome.storage.local.get(partialURL, function (items) {
  if (items[partialURL] instanceof Array) {
    items[partialURL].forEach(function (hiliteRecord) {
      window.find(hiliteRecord.text, false, false, false, false, false, false);
      hiliteSelection();
    });
  }
});