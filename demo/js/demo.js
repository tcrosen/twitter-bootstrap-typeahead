function displayResult(item) {
    console.log(item);
}

$(function () {

	$('#tabs a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	});

	var src = [{ id: 1, name: 'Toronto', state: 'ON', country: 'Canada', key: 12345 },
				    { id: 2, name: 'Montreal', state: 'QC', country: 'Canada', key: 23456 },
				    { id: 3, name: 'New York', state: 'NY', country: 'USA', key: 34567 },
				    { id: 4, name: 'Buffalo', state: 'NY', country: 'USA', key: 45678 },
				    { id: 5, name: 'Boston', state: 'MA', country: 'USA', key: 56789 },
				    { id: 6, name: 'Columbus', state: 'OH', country: 'USA', key: 67890 },
				    { id: 7, name: 'Dallas', state: 'TX', country: 'USA', key: 78901 },
				    { id: 8, name: 'Vancouver', state: 'BC', country: 'Canada', key: 89102 },
				    { id: 9, name: 'Seattle', state: 'WA', country: 'USA', key: 90123 },
				    { id: 10, name: 'Los Angeles', state: 'CA', country: 'USA', key: 11234 }];

    // Mock an AJAX request
    $.mockjax({
      url: '/cities/list',
      responseTime: 2000,
      responseText: src
    });

    $('#basic-usage input').typeahead({
      source: src
    });

    $('#some-customisation input').typeahead({
      source: src,
      display: 'name',
      val: 'key',
      maxResults: 4
    });

    $('#basic-ajax input').typeahead({
      source: '/cities/list'
    });

    $('#complex-ajax input').typeahead({
      source: {
      	url: '/cities/list',
      	type: 'post',
      	beforeSend: function () {
      		$('.progress').show();
      	},
      	complete: function () {
      		$('.progress').hide();
      	}
      },
      minLength: 2
    });

    $('#templates input').typeahead({
      source: src,
      tmpl: _.template('<li id="city-<%= id %>"><a href="#"><span class="typeahead-display-val"><%= name %></span>, <%= state %> <%= country %></a></li>')
    });

    $('#everything input').typeahead({
      source: {
        url: '/cities/list',
        type: 'post',
        beforeSend: function () {
          $('.progress').show();
        },
        complete: function () {
          $('.progress').hide();
        }
      },
      minLength: 2,
      val: { id: null, name: null, state: null },
      tmpl: _.template('<li id="city-<%= id %>"><a href="#"><%= name %>, <%= state %>, <%= country %></a></li>'),
      itemSelected: function () {
        alert('Congratulations you used everything!')
      }
    });
});