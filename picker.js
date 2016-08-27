function update(property, value) {
 var counter = property == "color" ? "background-color" : "color";
 $(`button.${counter}`).css(property, value);
 $(`.demo`).css(property, value);
}

$(function () {

  update("background-color", "yellow");
  update("color", "black");

  $(".change").click(function () {
    var property = $(this).hasClass("color") ? "color" : "background-color";
    value = $(this).data("color");
    update(property, value);
  });

  $("#done").click(function () {
    chrome.storage.local.set({
      "$style": $(this).attr("style")
    }, function () {
      chrome.windows.remove();
    });
    chrome.windows.remove(chrome.windows.WINDOW_ID_CURRENT);
  });

});

