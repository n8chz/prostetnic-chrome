chrome.storage.local.get("$style", function (value) {
  hiliteSelection(value["$style"]);
});

