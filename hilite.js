chrome.storage.local.get("$style", function (value) {
  // TODO: assign value to hiliteID
  hiliteSelection(hiliteID, value["$style"]);
});

