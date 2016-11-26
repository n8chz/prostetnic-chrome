function makeHash() {
 var hash = "";
 for (var k=0; k < 32; k++) {
  hash += String.fromCharCode(Math.floor(Math.random()*75+48));
 }
 return hash;
}

var hiliteID = makeHash();


function saveHighlight(hiliteStyle) {

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
  url: partialURL,
  text: selectionText,
  style: hiliteStyle
 };

 chrome.storage.local.set({hiliteID: hiliteObj});

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

chrome.storage.local.get("$style", function (value) {
  saveHighlight(value["$style"]);
});

