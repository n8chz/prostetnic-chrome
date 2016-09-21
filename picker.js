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

  $(".change").click(function () {
    var property = $(this).hasClass("color") ? "color" : "background-color";
    value = $(this).data("color");
    update(property, value);
  });

  $("#done").click(function () {
    chrome.storage.local.set({
      "$style": $(this).attr("style")
    }, function () {
      chrome.windows.remove(chrome.windows.WINDOW_ID_CURRENT);
    });
  });

});

