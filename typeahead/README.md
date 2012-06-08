Twitter Bootstrap Typeahead Plugin Extension
========================

v1.1 (June 2012)<br />
Terry Rosen [@rerrify](https://twitter.com/#!/rerrify)

An extension of the Twitter Bootstrap Typeahead plugin<br />
<http://twitter.github.com/bootstrap/javascript.html#typeahead>

Required
-----------------
* Twitter Bootstrap 2.0.4
* jQuery 1.7.x

About
-----
All the thanks in the world to [@mdo](https://twitter.com/#!/mdo) and [@fat](https://twitter.com/#!/fat) of [@twitter](https://twitter.com/) for the wonderful Bootstrap utility.<br />
I required more functionality out of the Typeahead plugin so I created this simple extension.  I do plan to add more features in the future.

Installation
-----
1. Download [Bootstrap](https://github.com/twitter/bootstrap) & [jQuery](http://docs.jquery.com/Downloading_jQuery)
2. Include files in your HTML. The minimum required for this plugin are:

    <link href="bootstrap.css" rel="stylesheet">
    <script src="jquery.js" type="text/javascript"></script>
    <script src="bootstrap-typeahead.js" type="text/javascript"></script>

3. Execute the plugin `$(myElement).typeahead(options);`

Changes From Original
-------

All methods are now overridable:

* matcher
* sorter
* highlighter
* select
* render

**New Options:**

**val**<br />
Default: *id*<br />
Description: The object value that is returned when an item is selected.

**display**<br />
Default: *name*<br />
Description: The object property to match the query against and highlight in the results.

**itemSelected**<br />
Default: *function (item, val, text) {}*<br />
Description: The callback function that is invoked when an item is chosen.<br />

+ item: the HTML element that was selected
+ val: value of the *val* property
+ text: value of the *display* property

Basic Usage
------------

	$(function() {
		$('#myElement').typeahead({
			source: [{ id: 1, name: 'Terry'}, { id: 2, name: 'Mark'}, { id: 3, name: 'Jacob'}],
			itemSelected: function(item, val, text) {
				alert('You selected ' + text);
			}
		});
	});

A working examples are included in this project.