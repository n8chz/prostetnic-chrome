
chrome.storage.local.get("$style", function (value) {
  // TODO: assign value to hiliteID
  chrome.storage.local.get("$hiliteID", function (id) {
    var number;
    if (Object.keys(id).length == 0) {
     number = 0;
    }
    else {
     var number = Number(id["$hiliteID"].slice(1))+1;
     console.log(`New value of number: ${number}`);
    }
    var hiliteID = "$"+number;
    chrome.storage.local.set({"$hiliteID": hiliteID}, function () {
      console.log(`About to hilite with hiliteID = ${hiliteID}`);
      hiliteSelection(hiliteID, value["$style"]);
    });
  });
});

