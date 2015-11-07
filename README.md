# prostetnic-chrome
Porting [Prostetnic Highlighter](https://github.com/n8chz/prostetnic) to Chromium.

This is not hosted in the Chrome Web Store, so you probably have to enable "developer mode" to use it.

So far,
* highlights the text on the page,
* stores url and highlight text as key/value pair in local storage, and
* re-highlights text passages when we re-visit a URL.
* previous highlights are searchable by word

TODO:

* figure out how Disqus manages to neutralize the .getSelection() method
* multi-color highlighting.
