Twitter Bootstrap Typeahead Plugin Extension
========================

v1.1 (June 2012)<br />
Terry Rosen [@rerrify](https://twitter.com/#!/rerrify)

An extension of the Twitter Bootstrap Typeahead plugin<br />
<http://twitter.github.com/bootstrap/javascript.html#typeahead>

About
-----------------
All the thanks in the world to [@mdo](https://twitter.com/#!/mdo) and [@fat](https://twitter.com/#!/fat) of [@twitter](https://twitter.com/) for the wonderful Bootstrap utility.<br />
I required more functionality out of the Typeahead plugin so I created this extension.  

Required
-----------------
* Twitter Bootstrap 2.0.4
* jQuery 1.7.x

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

Working examples are included in this project.

What the $#&* did you do to the source code?
-----------------
I added comments, semi-colons and other formatting that I like to use based on [idiomatic JS](https://github.com/rwldrn/idiomatic.js).
You should always be [minifying](http://en.wikipedia.org/wiki/Minification_\(programming\)) your JS before production use.