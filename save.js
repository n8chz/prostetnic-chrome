
var hiliteStyle = {
 color: "black",
 backgroundColor: "yellow"
};

var selection = document.getSelection();
var hiliteRecord = {};

// URL parsing kludge
// we want same content but one http & other https to save as 1 doc, not 2
// also, we want different locations in document to save as same doc

var partialURL = document.location.href.split(":")[1].split("#")[0];

// Storage schema is {<url>: <array of highlight objects>}
// Each highlight object has a text property (string)
// and a style property (apropos to Element.style in DOM)

selectionText = selection.toString();

chrome.storage.local.get(partialURL, function (items) {
  if (!(items[partialURL] instanceof Array)) items[partialURL] = [];
  items[partialURL].push({
    text: selectionText,
    style: hiliteStyle
  });
  chrome.storage.local.set(items);
});


