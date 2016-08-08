var list = document.getElementById("list");

var searchInput = document.getElementById("search");

keywordHandler = function (items) {
 return function (event) {
  event.preventDefault(); // h/t wOxxOm http://stackoverflow.com/a/33011569/948073
  var ul = document.createElement("ul");
  items.forEach(function (url) {
    chrome.storage.local.get(url, function (items) {
      a = document.createElement("a");
      a.setAttribute("href", "http:"+url);
      a.setAttribute("target", "_blank");
      a.textContent = items[url].title || url;
      var li = document.createElement("li"); 
      li.appendChild(a);
      ul.appendChild(li);
    });
  });
  event.target.parentNode.appendChild(ul);
 };
}

var prev = "";

searchInput.addEventListener("input", function (event) {
  event.preventDefault();
  var input = searchInput.value;
  if (input.match(/\s$/)) searchInput.value = "";
  else {
   var word = input.toLowerCase();
   word = word.replace(/[\x00-\x26\x28-\x2f\x3a-\x60\x7b-\x7f]/g, "");
   searchInput.value = word;
   if (input.length && input != prev) chrome.storage.local.get(word, function (items) {
     if (word.length && items[word] instanceof Array && items[word].length) { // word.length test should not be necessary! TODO: Check save.js & make sure we aren't using "" as a storage key!
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

