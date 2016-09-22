function update(property, value) {
 var counter = property == "color" ? "background-color" : "color";
 $(`button.${counter}`).css(property, value);
 $(`.demo`).css(property, value);
}

$(function () {

  chrome.storage.local.get("$style", function (value) {
    var style = value["$style"];
    $("#done").attr("style", style);
    update("background-color", $("#done").css("background-color"));
    update("color", $("#done").css("color"));
  });

  // Each of the buttons with A's in them has class "change".
  // They also have a class of either "color" or "background-color".
  // Each button will change either the foreground or background color to
  // match its own value for whichever of those two properties.
  $(".change").click(function () {
    var property = $(this).hasClass("color") ? "color" : "background-color";
    value = $(this).data("color");
    update(property, value);
  });

  // The button with "Done" on it stores the selected style in storage as the
  // value associated with the key "$style"
  $("#done").click(function () {
    chrome.storage.local.set({
      "$style": $(this).attr("style")
    }, function () {
      // kludge because in versions < 50, chrome.windows.remove() won't accept
      // a negative value, including the constant
      // chrome.windows.WINDOW_ID_CURRENT, which has a value of -2.
      chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, function (w) {
        chrome.windows.remove(w.id);
      });
    });
  });

});

