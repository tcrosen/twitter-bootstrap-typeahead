Twitter Bootstrap Typeahead Extension
========================

v2.0.0<br />
Terry Rosen [@rerrify](https://twitter.com/#!/rerrify)

An extension of the Twitter Bootstrap Typeahead plugin<br />
<http://twitter.github.com/bootstrap/javascript.html#typeahead>

**jQuery 1.8 & Bootstrap 2.1 Compatible**

Features
-----------------

- Complex data sources

		$('#my-element').typeahead({
		  source: [{ id: 1, name: 'Toronto' }, { id: 2, name: 'Montreal' }, { id: 3, name: 'New York' }]
		});

- Ajax data sources

		$('#my-element').typeahead({
		  source: {
		  	url: '/cities/list',
		  	type: 'post'
		  }
		});

- Callback when item is selected

		$('#my-element').typeahead({
		  source: [{ id: 1, name: 'Toronto' }, { id: 2, name: 'Montreal' }, { id: 3, name: 'New York' }],
		  itemSelected: function (item) {
		  	alert('You selected city ID ' + item)
		  }
		});

- Item templates (example using [Underscore.js](http://underscorejs.org/))

		$('#my-element').typeahead({
		  source: [{ id: 1, name: 'Toronto' }, { id: 2, name: 'Montreal' }, { id: 3, name: 'New York' }],
		  tmpl: _.template('<li id="<%= id %>"><a href="#"><%= name %></a></li>')
		});

Dependancies
-----------------
- [Twitter Bootstrap](https://github.com/twitter/bootstrap) 2.0+
- [jQuery](http://docs.jquery.com/Downloading_jQuery) 1.7+
- [json2.js](https://github.com/douglascrockford/JSON-js) *Only required if using complex object values with older browsers - see **val** below*

Installation
-----------------

1) Download the plugin:

- [ZIP](https://github.com/tcrosen/twitter-bootstrap-typeahead/zipball/master)
- [Clone in Windows](github-windows://openRepo/https://github.com/tcrosen/twitter-bootstrap-typeahead)
- [Clone in Mac](github-mac://openRepo/https://github.com/tcrosen/twitter-bootstrap-typeahead)
- `git clone git://github.com/tcrosen/twitter-bootstrap-typeahead.git`

2) Include files in your HTML. The minimum required are:

    <link href="/path/to/bootstrap.css" rel="stylesheet">
    <script src="/path/to/jquery.js" type="text/javascript"></script>
    <script src="/path/to/bootstrap-typeahead.js" type="text/javascript"></script>

3) Execute:

    $(myElement).typeahead(options);

About
-----------------
All the thanks in the world to [@mdo](https://twitter.com/#!/mdo) and [@fat](https://twitter.com/#!/fat) of [@twitter](https://twitter.com/) for the wonderful Bootstrap utility.<br />
I required more functionality out of the Typeahead plugin so I created this extension with additional features.

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
            source
        </td>
        <td>
            array, object, string
        </td>
        <td>
        <pre>[]
</pre>
        </td>
        <td>
            Can use an array for a local data source, a URL for a remote data source or a full jQuery AJAX object
        </td>
    </tr>
    <tr>
        <td>
            display
        </td>
		<td>
            string, object
        </td>
		<td>
            'name'
        </td>
        <td>
            The property of the datasource to display
        </td>
    </tr>
    <tr>
        <td>
            item
        </td>
		<td>
            string, function
        </td>
        <td>
            '&lt;li&gt;&lt;a href=&quot;#&quot;&gt;&lt;/a&gt;&lt;/li&gt;'
        </td>
        <td>
			The HTML rendering for a result item or template function.
        </td>
    </tr>
    <tr>
        <td>
            maxResults
        </td>
		<td>
            int
        </td>
        <td>
            8
        </td>
        <td>
			The maximum number of items to show in the results.
        </td>
    </tr>
    <tr>
    	<tr>
        <td>
            minLength
        </td>
		<td>
            int
        </td>
        <td>
            1
        </td>
        <td>
			The minimum number of characters required before doing a search
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
            val
        </td>
		<td>
            string, object
        </td>
		<td>
            'id'
        </td>
        <td>
            The property name or JSON object to be returned.  *Using a JSON object may require [json2.js](https://github.com/douglascrockford/JSON-js) in older browsers*
        </td>
    </tr>
</table>


Change Log
-----------------

**2.0.0**
-

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