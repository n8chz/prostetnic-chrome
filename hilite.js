
var hiliteStyle = {
 color: "black",
 backgroundColor: "yellow"
};

var selection = document.getSelection();

chrome.runtime.sendMessage({text: selection.toString()});

// Note that Chrome doesn't allow non-contiguous selections anyway, so
// .rangeCount is always 1:

var range = selection.getRangeAt(0);

// Account for the end points of the range:

var startContainer = range.startContainer;
var startOffset = range.startOffset;

var endContainer = range.endContainer;
var endOffset = range.endOffset;

if (startContainer == endContainer) {
 splitContainer(startContainer, startOffset, endOffset);
}
else {
 splitContainer(startContainer, startOffset, null);
 splitContainer(endContainer, null, endOffset);
}

function splitContainer(container, startOffset, endOffset) {
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
   hiliteNode(container);
  }
 }
} 

// The Range class does have a property that gives the common ancestor, which
// is the smallest Node that contains all the elements which are wholly or
// partially contained by the Range:

var ancestorContainer = range.commonAncestorContainer;

function leafNodes(node, range) {
 if (node) {
  if (node.nodeType == Node.TEXT_NODE) {
   var foo = range.comparePoint(node, 0);
   var goo = range.comparePoint(node, node.textContent.length);
   if (foo == 0 && goo == 0) {
    hiliteNode(node);
   }
  }
  else if (node.hasChildNodes()) {
   for (var k = 0; k < node.childNodes.length; k++) {
    leafNodes(node.childNodes[k], range);
   }
  }
 }
}

leafNodes(ancestorContainer, range);
selection.removeAllRanges();

function hiliteNode(node) {
 var text = node.textContent;
 if (!text.match(/\S/)) return;
 var newSpan = document.createElement("span");
 newSpan.textContent = text;
 newSpan.className = "prostetnic";
 // newSpan.attr("style", "color:black;background-color:yellow");
 node.parentNode.replaceChild(newSpan, node);
}

