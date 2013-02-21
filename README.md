Twitter Bootstrap Typeahead Plugin Extension
========================

* * *

**UPDATE (Feb 21, 2013)**

I no longer have the time to maintain this plugin.  If you are looking for updated code, please take a look at the following to help you:

- [Groups Branch](https://github.com/tcrosen/twitter-bootstrap-typeahead/tree/groups)

- [2.0 Branch](https://github.com/tcrosen/twitter-bootstrap-typeahead/tree/2.0)

- [Twitter's new advanced Typeahead](https://github.com/twitter/typeahead.js) - *Not associated with Bootstrap*

* * *

v1.2.2<br />
Terry Rosen [@rerrify](https://twitter.com/#!/rerrify)

An extension of the Twitter Bootstrap Typeahead plugin<br />
<http://twitter.github.com/bootstrap/javascript.html#typeahead>

About
-----------------
All the thanks in the world to [@mdo](https://twitter.com/#!/mdo) and [@fat](https://twitter.com/#!/fat) of [@twitter](https://twitter.com/) for the wonderful Bootstrap utility.<br />
I required more functionality out of the Typeahead plugin so I created this extension with some additional features:

- A callback function is available for when an item is selected
- Ability to specify data source properties
- Ability to use a local or remote (AJAX) data source
- Most original methods are overridable so you can customize without changing the source code

Required
-----------------
* Twitter Bootstrap 2.0+
* jQuery 1.7+

Installation
-----------------
1) Download [Bootstrap](https://github.com/twitter/bootstrap) & [jQuery](http://docs.jquery.com/Downloading_jQuery)

2) Download this plugin.

- [ZIP](https://github.com/tcrosen/twitter-bootstrap-typeahead/zipball/master)
- [Clone in Windows](github-windows://openRepo/https://github.com/tcrosen/twitter-bootstrap-typeahead)
- `git clone git://github.com/tcrosen/twitter-bootstrap-typeahead.git`

3) Include files in your HTML. The minimum required for this plugin are:

    <link href="/path/to/bootstrap.css" rel="stylesheet">
    <script src="/path/to/jquery.js" type="text/javascript"></script>
    <script src="/path/to/bootstrap-typeahead.js" type="text/javascript"></script>

4) Execute the plugin:

    $(myElement).typeahead(options);


Events
-----------------

<table width="100%">
	<thead>
		<tr>
			<th>
				Event
			</th>
			<th>
				Description
			</th>
		</tr>
	</thead>
    <tr>
        <td>
            grepper
        </td>
        <td>
            Filters relevant results from the source.
        </td>
    </tr>
    <tr>
        <td>
            highlighter
        </td>
        <td>
            Highlights any matching results in the list.
        </td>
    </tr>
    <tr>
        <td>
            itemSelected
        </td>
        <td>
            The callback function that is invoked when an item is chosen.
            <ul>
			<li>item: the HTML element that was selected</li>
			<li>val: value of the *val* property</li>
            <li>text: value of the *display* property</li>
			</ul>
        </td>
    </tr>
    <tr>
        <td>
            lookup
        </td>
        <td>
            Determines if source is remote or local and initializes the search.
        </td>
    </tr>
    <tr>
        <td>
            matcher
        </td>
        <td>
            Looks for a match between the query and a source item.
        </td>
    </tr>
    <tr>
        <td>
            render
        </td>
        <td>
            Renders the list of results.
        </td>
    </tr>
    <tr>
        <td>
            select
        </td>
        <td>
            Selects an item from the results list.
        </td>
    </tr>
    <tr>
        <td>
            sorter
        </td>
        <td>
            Sorts the results.
        </td>
    </tr>
</table>

Options
-----------------

<table width="100%">
<thead>
	<tr>
		<th>
			Name
		</th>
		<th>
			Type
		</th>
		<th>
			Default
		</th>
		<th>
			Description
		</th>
	</tr>
</thead>
    <tr>
        <td>
            ajax
        </td>
        <td>
            object
        </td>
        <td>
        <pre>{
    url: null,
    timeout: 300,
    method: 'post',
    triggerLength: 3,
    loadingClass: null,
    displayField: null,
    preDispatch: null,
    preProcess: null
}</pre>
        </td>
        <td>
            The object required to use a remote datasource.  <br /><i>See also: ajax as a string (below)</i>
        </td>
    </tr>
    <tr>
        <td>
            ajax
        </td>
        <td>
            string
        </td>
        <td>
            null
        </td>
        <td>
            Optionally, a simple URL may be used instead of the AJAX object. <br />   <i>See also: ajax as an object (above)</i>
        </td>
    </tr>
    <tr>
        <td>
            display
        </td>
		<td>
            string
        </td>
		<td>
            'name'
        </td>
        <td>
            The object property to match the query against and highlight in the results.
        </td>
    </tr>
    <tr>
        <td>
            item
        </td>
		<td>
            string
        </td>
        <td>
            '&lt;li&gt;&lt;a href=&quot;#&quot;&gt;&lt;/a&gt;&lt;/li&gt;'
        </td>
        <td>
			The HTML rendering for a result item.
        </td>
    </tr>
    <tr>
        <td>
            items
        </td>
		<td>
            integer
        </td>
        <td>
            8
        </td>
        <td>
			The maximum number of items to show in the results.
        </td>
    </tr>
    <tr>
        <td>
            menu
        </td>
		<td>
            string
        </td>
        <td>
            '&lt;ul class=&quot;typeahead dropdown-menu&quot;&gt;&lt;/ul&gt;'
        </td>
        <td>
			The HTML rendering for the results list.
        </td>
    </tr>
    <tr>
        <td>
            source
        </td>
		<td>
            object
        </td>
        <td>
           []
        </td>
        <td>
			The source to search against.
        </td>
    </tr>
    <tr>
        <td>
            val
        </td>
		<td>
            string
        </td>
		<td>
            'id'
        </td>
        <td>
            The object property that is returned when an item is selected.
        </td>
    </tr>
</table>


Basic Usage
-----------------
The plugin in its simplest (realistic) form.

	var mySource = [{ id: 1, name: 'Terry'}, { id: 2, name: 'Mark'}, { id: 3, name: 'Jacob'}];

	$('#myElement').typeahead({
		source: mySource
	});

Or using a remote data source:

    $('#myElement').typeahead({
        ajax: '/path/to/mySource'
    });

Examples demonstrating various options are included in this project under the `/demo` folder

Why did you change so much from v1.0 to v1.1?
-----------------
I found certain things to be redundant, like having separate sort and display properties.  I can't think of a reasonable scenerio where you would be sorting based on something different than what you are displaying.

What the $#&* did you do to the source code?
-----------------
I added comments, semi-colons and other formatting that I like to use based on [idiomatic JS guidelines](https://github.com/rwldrn/idiomatic.js).

If you are concerned with the bigger file size, you should always be [minifying](http://en.wikipedia.org/wiki/Minification_\(programming\)) your JS before production use.

Change Log
-----------------

**1.2.2**

- Added support for jQuery 1.8 & Bootstrap 2.1
- Removed usage of jQuery.browser [#9385](http://bugs.jquery.com/ticket/9385)
- Changed jQuery.data() to jQuery._data() in order to make test suite operational [#11718](http://bugs.jquery.com/ticket/11718)
- Added an undocumented function `eventSupported(eventName)` to verify browser support for `keydown` event.  You may override this function if you prefer to do this check another way.

**1.2.1**

- Some AJAX tests added
- Added fix for spontaneous AJAX bug reported by users
- `grepper` and `lookup` methods are now overridable

**1.2**

- Added AJAX support

**1.1**

- Major code cleanup
- Test cases added
- Documentation improvements


Road Map
-----------------

**1.3**

- Add template support