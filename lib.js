//chrome.storage.local.clear(function () {alert("storage is clear, in theory");});

// splitContainer splits a text node into 1-3 nodes,
// one of which is the portion of the node that is
// within the selection's range:

function splitContainer(container, startOffset, endOffset, hiliteID, style) {
 if (container.nodeType == Node.TEXT_NODE) {
  var text = container.textContent;
  if (!text.match(/\S/)) return;
  var left = startOffset ? text.slice(0, startOffset) : null;
  var mid = text.slice(startOffset || 0, endOffset || text.length);
  var right = endOffset ? text.slice(endOffset) : null;
  if (left) {
   var leftNode = container.cloneNode();
   leftNode.textContent = left;
   container.parentNode.insertBefore(leftNode, container);
  }
  if (right) {
   var rightNode = container.cloneNode();
   rightNode.textContent = right;
   container.parentNode.insertBefore(rightNode, container.nextSibling);
  }
  container.textContent = mid;
  if (mid.match(/\S/)) {
   hiliteNode(container, hiliteID, style);
  }
 }
} 


function leafNodes(node, range, hiliteID, style) {
 if (node) {
  if (node.nodeType == Node.TEXT_NODE) {
   var foo = range.comparePoint(node, 0);
   var goo = range.comparePoint(node, node.textContent.length);
   if (foo == 0 && goo == 0) {
    hiliteNode(node, hiliteID, style);
   }
  }
  else if (node.hasChildNodes()) {
   for (var k = 0; k < node.childNodes.length; k++) {
    leafNodes(node.childNodes[k], range, hiliteID, style);
   }
  }
 }
}

function hiliteNode(node, hiliteID, style) {
 var text = node.textContent;
 if (!text.match(/\S/)) return;
 var newSpan = document.createElement("span");
 newSpan.textContent = text;
 newSpan.classList.add("prostetnic");
 // newSpan.setAttribute("data-hilite-id", hiliteID);
 newSpan.style = style;
 node.parentNode.replaceChild(newSpan, node);

 // See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contextmenu
 var menuID = hiliteID.replace("$", "prostetnic-");
 console.log(`menuID = ${menuID}`);
 newSpan.setAttribute("contextmenu", menuID);
 var menuForHighlight = $("<menu>", {
   id: menuID,
   type: "context"
 });
 var subMenu = $("<menu>", {
   label: "This highlighted passage..."
 }).appendTo(menuForHighlight);
 var modifyItem = $("<menuitem>", {
   label: "Modify"
 }).appendTo(subMenu);

/*
 function handleResponse(message) {
  console.log(`handleResponse with message=${message}`);
  if (message == "foo") {
   var contextMenu = $(this).parent().parent().attr("id");
   chrome.storage.local.get("$modify", function (data) {
     var modify = data["$modify"];
     $(`span[contextmenu='${menuID}']`).attr("style", modify);
     // TODO: Now make change in storage
   });
  }
  // $(`span[contextmenu=${contextMenu}]`).attr("style", message.style);
  // chrome.storage.local.remove(contextMenu.replace("prostetnic-", "$"));
 }

 function handleError(error) {
   console.error(`Error: ${JSON.stringify(error)}`);
 }
*/

 function notifyBackgroundPage() {
   console.log("modify menu clicked");
   chrome.runtime.sendMessage();
   chrome.runtime.onMessage.addListener(function () {
     console.log("message received from menu.js");
     var contextMenu = $(this).parent().parent().attr("id");
     chrome.storage.local.get("$modify", function (data) {
       var modify = data["$modify"];
       $(`span[contextmenu='${menuID}']`).attr("style", modify);
       // TODO: Now make change in storage
     });
   });
 }

 modifyItem.click(notifyBackgroundPage);
 // TODO: try rewriting modify below using .sendMessage()
 // see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime#sendMessage()
/*
 modifyItem.click(function () {
   var promise = chrome.windows.create({
     url: chrome.extension.getURL("picker.html"),
     type: "popup",
     height: 501, // kludge!
     width: 1000
   });
   chrome.windows.onRemoved.addListener(function (windowId) {
     if (windowId == promise.windowId) {
      // color for update will be stored in $modify
      // Change color in window:
      chrome.storage.local.get("$modify", function (data) {
	$(`span[contextmenu='${menuID}']`).attr("style", data["$modify"]);
      });
      // TODO: Change color in database:
     }
   });
 });
*/
 var deleteItem = $("<menuitem>", {
   label: "Remove highlight"
 }).appendTo(subMenu);
 deleteItem.click(function () {
   var contextMenu = $(this).parent().parent().attr("id");
   $(`span[contextmenu=${contextMenu}]`).removeAttr("style");
   // Make it stick by erasing it from storage, too.
   chrome.storage.local.remove(contextMenu.replace("prostetnic-", "$"));
   // TODO: remove from list of highlight id's in value of url's key
 });
 menuForHighlight.attr("type", "context");
 $("body").prepend(menuForHighlight);
}

function hiliteSelection(hiliteID, style) {
 console.log(`hiliteSelection(${hiliteID}, ${JSON.stringify(style)})`);

 var selection = document.getSelection();
 // if (!selection || !selection.rangeCount) confirm("Are we in a Disqus comment?");
 if (!selection || !selection.rangeCount) {
  // TODO: Log this event.  Page somehow blocks DOM-readable selections.
  console.log("Hiliter won't work here.\n\nSomehow this website blocks DOM-readable selections.\n\nIf you understand the mechanics of this, please consider forking this extension at https://github.com/n8chz/prostetnic-chrome");
  return;
 }

 // Note that Chrome doesn't allow non-contiguous selections anyway, so
 // .rangeCount is always 1:

 var range = selection.getRangeAt(0);

 // Account for the end points of the range:

 var startContainer = range.startContainer;
 var startOffset = range.startOffset;

 var endContainer = range.endContainer;
 var endOffset = range.endOffset;

 if (startContainer == endContainer) {
  splitContainer(startContainer, startOffset, endOffset, hiliteID, style);
 }
 else {
  splitContainer(startContainer, startOffset, null, hiliteID, style);
  splitContainer(endContainer, null, endOffset, hiliteID, style);
 }

 // The Range class does have a property that gives the common ancestor, which
 // is the smallest Node that contains all the elements which are wholly or
 // partially contained by the Range:

 var ancestorContainer = range.commonAncestorContainer;

 leafNodes(ancestorContainer, range, hiliteID, style);
 selection.removeAllRanges();

}

