var cities = [
		{ID: 1, Name: 'Toronto'},
		{ID: 2, Name: 'Montreal'},
		{ID: 3, Name: 'New York'},
		{ID: 4, Name: 'Buffalo'},
		{ID: 5, Name: 'Boston'},
		{ID: 6, Name: 'Columbus'},
		{ID: 7, Name: 'Dallas'},
		{ID: 8, Name: 'Vancouver'},		
		{ID: 9, Name: 'Seattle'},
		{ID: 10, Name: 'Los Angeles'}
	]

var states = [
		{ id: 1, abbrev: 'AK', full_name: 'Alaska' },
		{ id: 2, abbrev: 'NY', full_name: 'New York' },
		{ id: 3, abbrev: 'FLA', full_name: 'Florida' },
		{ id: 4, abbrev: 'CT', full_name: 'Conneticut' },
		{ id: 5, abbrev: 'GA', full_name: 'Georgia' },
		{ id: 6, abbrev: 'NC', full_name: 'North Carolina' }
	]

$(function() {
	$('.cities').typeahead({
		source: cities,
		matchProp: 'Name',
		sortProp: 'Name',
		valueProp: 'ID',
		itemSelected: function(item, val, text) {
			$('.selected-message').html('You selected the city ' + text + ' with ID ' + val + '<br />View your browser console for the full item element.')
								  .show();
			console.log(item)
		}
	});

	$('.states').typeahead({
		source: states,
		matchProp: 'full_name',
		sortProp: 'abbrev',
		itemSelected: function(item, val, text) {
			$('.selected-message').html('You selected the state ' + text + ' with ID ' + val + '<br />View your browser console for the full item element.')
								  .show();
			console.log(item)
		}
	});
})