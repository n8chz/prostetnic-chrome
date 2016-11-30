
function saveHighlight(hiliteStyle, hiliteID) {

 var selection = document.getSelection();

 selectionText = selection.toString();

 // URL parsing kludge
 // we want same content but one http & other https to save as 1 doc, not 2
 // also, we want different locations in document to save as same doc

 var partialURL = document.location.href.split(":")[1].split("#")[0];

 // Storage schema is {<url>: <array of highlight objects>}
 // Each highlight object has a text property (string)
 // and a style property (apropos to Element.style in DOM)

 var hiliteObj = {
  // id: hiliteID,
  url: partialURL,
  text: selectionText,
  style: hiliteStyle
 };

 var storageItem = {};
 storageItem[hiliteID] = hiliteObj;

 console.log(JSON.stringify(storageItem));
 chrome.storage.local.set(storageItem);

 chrome.storage.local.get(partialURL, function (items) {
   if (!items[partialURL]) items[partialURL] = {
    title: document.title,
    hilites: []
   };
/*
   items[partialURL].hilites.push({
     text: selectionText,
     style: hiliteStyle
   });
*/
   items[partialURL].hilites.push(hiliteID);

   chrome.storage.local.set(items);

 });

 // downcase, dumb down smart apostrophes, split into words:

 var words = selectionText.toLowerCase().replace(/\u2019/, "'").split(/'?[\x00-\x26\x28-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+'?/);

 // Incorporate words into word index:

 words.forEach(function (word) {
   // Liberate word from single quotes, but treat apostrophe as first XOR last
   // character as part of the word:
   if (word.match(/'.*'/)) {
    word = word.slice(1, -1);
   }
   if (word != "") {
    chrome.storage.local.get(word, function (items) {
      if (!(items[word] instanceof Array)) items[word] = [];
      if (items[word].every(function (x) {
	 return x != hiliteID;
      })) {
       items[word].push(hiliteID);
      }
      chrome.storage.local.set(items);
    });
   }
 });
}

chrome.storage.local.get("$style", function (style) {
  var styleKeypair = style;
  chrome.storage.local.get("$hiliteID", function (id) {
    // TODO: calculate hiliteID w/o throwing exceptions
    var number;
    if (Object.keys(id).length == 0) {
     number = 0;
    }
    else {
     number = Number(id["$hiliteID"].slice(1))+1;
    }
    var hiliteID = "$"+number;
    chrome.storage.local.set({"$hiliteID": hiliteID}, function () {
      var styleString = styleKeypair["$style"];
      saveHighlight(styleString, hiliteID);
      hiliteSelection(hiliteID, styleString);
    });
  });
});

