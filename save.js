console.log("entered save.js");

var hiliteStyle = {
 color: "black",
 backgroundColor: "yellow"
};

var selection = document.getSelection();
// var hiliteRecord = {};

selectionText = selection.toString();

console.log(`selectionText: ${selectionText}`);

// URL parsing kludge
// we want same content but one http & other https to save as 1 doc, not 2
// also, we want different locations in document to save as same doc

var partialURL = document.location.href.split(":")[1].split("#")[0];

// Storage schema is {<url>: <array of highlight objects>}
// Each highlight object has a text property (string)
// and a style property (apropos to Element.style in DOM)

chrome.storage.local.get(partialURL, function (items) {
  if (!items[partialURL]) items[partialURL] = {
   title: document.title,
   hilites: []
  };
  items[partialURL].hilites.push({
    text: selectionText,
    style: hiliteStyle
  });
  console.log(`about to store: ${JSON.stringify(items)}`);
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
	return x != partialURL;
     })) {
      items[word].push(partialURL);
     }
     chrome.storage.local.set(items);
   });
  }
});
