console.log("popup.js checking in");

var list = document.getElementById("list");

var searchInput = document.getElementById("search");

function drawLinks(ul, url) {
    chrome.storage.local.get(url, function (items) {
      a = document.createElement("a");
      a.setAttribute("href", "http:"+url);
      a.setAttribute("target", "_blank");
      a.textContent = items[url].title || url;
      var li = document.createElement("li"); 
      li.appendChild(a);
      ul.appendChild(li);
    });
}

keywordHandler = function (items) {
 console.log(`items received by keywordHandler: ${JSON.stringify(items)}`);
 return function (event) {
  event.preventDefault(); // h/t wOxxOm http://stackoverflow.com/a/33011569/948073
  var ul = document.createElement("ul");
  items.forEach(function (item) {
    if (item[0] == "$") {
     chrome.storage.local.get(item, function (result) {
       console.log(`${item} -> ${JSON.stringify(result)}`);
       drawLinks(ul, result[item].url);
     });
    }
    else {
     drawLinks(ul, item);
    }
  });
  event.target.parentNode.appendChild(ul);
 };
}

var prev = "";

// Every time contents of text input change, add button if the input contains a
// word which is a storage key.  The button created will expand into a list of
// URLs in which that word has been highlighted.
searchInput.addEventListener("input", function (event) {
  event.preventDefault();
  var input = searchInput.value;
  // Reset input if user has typed a whitespace character
  if (input.match(/\s$/)) searchInput.value = "";
  else {
   var word = input.toLowerCase();
   word = word.replace(/[\x00-\x26\x28-\x2f\x3a-\x60\x7b-\x7f]/g, "");
   searchInput.value = word;
   if (input.length && input != prev) chrome.storage.local.get(word, function (items) {
     console.log(`Querying store for key: ${word}\nvalue is ${JSON.stringify(items)}`);
     if (word.length && items[word] instanceof Array && items[word].length) {
      // word.length test should not be necessary!
      // TODO: Check save.js & make sure we aren't using "" as a storage key!
      var keyword = document.createElement("fieldset");    
      var button = document.createElement("button");
      button.textContent = word+" ("+items[word].length+")";
      keyword.appendChild(button); 
      button.addEventListener("click", keywordHandler(items[word]));
      list.appendChild(keyword);
     }
   })
   prev = input;
  }
});

