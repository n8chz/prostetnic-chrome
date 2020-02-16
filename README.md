# prostetnic-chrome
Porting [Prostetnic Highlighter](https://github.com/n8chz/prostetnic) to Chromium.

Available in packaged form for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/persistent-color-highlighter/?src=search) and [Chrome/ium](https://chrome.google.com/webstore/detail/persistent-highlighter/njeijipoihldmgnelkdhohadaigobeml).

So far,
* highlights the text on the page,
* stores url and highlight text as key/value pair in local storage, and
* re-highlights text passages when we re-visit a URL.
* previous highlights are searchable by word

TODO:

* figure out how Disqus manages to neutralize the .getSelection() method
* multi-color highlighting.
