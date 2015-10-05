var list = document.getElementById("list");

var searchInput = document.getElementById("search");

keywordHandler = function (event) {
 alert(event.target.outerHTML);
}

searchInput.addEventListener("input", function () {

  var wordArray = searchInput.value.split(/'?[\x00-\x26\x28\x29\x3a-\x40\x5b-\x60\x7b-\x7f]+'?/);

  // Replace word list to reflect new contents of #list
  // It's probably a short list, so keep things simple & brute force it:
  // Remove and rewrite entires in #list.

  // see https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes
  while (list.firstChild) {
   list.removeChild(list.firstChild);
  }
  wordArray.forEach(function (word) {
    // Display that subset of words in #search that have been highlighted somewhere:
    chrome.storage.local.get(word, function (items) {
      if (word.length && items[word] instanceof Array && items[word].length) { // word.length test should not be necessary! TODO: Check save.js & make sure we aren't using "" as a storage key!
       var keyword = document.createElement("fieldset");    
       var button = document.createElement("button");
       button.textContent = word+" ("+items[word].length+")";
       keyword.appendChild(button); 
       keyword.addEventListener("click", keywordHandler);
       list.appendChild(keyword);
      }
    })
  });

  // tidy up #search
  searchInput.value = wordArray.join(" ");

});
