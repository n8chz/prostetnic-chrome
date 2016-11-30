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
 newSpan.setAttribute("data-hilite-id", hiliteID);
 newSpan.style = style;
 node.parentNode.replaceChild(newSpan, node);
}

function hiliteSelection(hiliteID, style) {
 console.log(`hiliteSelection(${hiliteID}, ${JSON.stringify(style)})`);

 var selection = document.getSelection();
 // if (!selection || !selection.rangeCount) confirm("Are we in a Disqus comment?");
 if (!selection || !selection.rangeCount) {
  // TODO: Log this event.  Page somehow blocks DOM-readable selections.
  alert("Hiliter won't work here.\n\nSomehow this website blocks DOM-readable selections.\n\nIf you understand the mechanics of this, please consider forking this extension at https://github.com/n8chz/prostetnic-chrome");
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

