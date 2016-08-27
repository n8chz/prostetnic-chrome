function update(property, value) {
 var counter = property == "color" ? "background-color" : "color";
 $(`button.${counter}`).css(property, value);
 $(`.demo`).css(property, value);
}

$(function () {

  update("background-color", "yellow");
  update("color", "black");
  console.log("foo");

  $(".change").click(function () {
    console.log("click");
    var property = $(this).hasClass("color") ? "color" : "background-color";
    value = $(this).data("color");
    console.log(`property: ${property}\nvalue: ${value}`);
    update(property, value);
  });

  $(".done").click();

});

