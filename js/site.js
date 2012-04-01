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

$(function() {
	$('#typeaheadTest').typeahead({
		source: cities,
		matchProp: 'Name',
		sortProp: 'Name',
		valueProp: 'ID',
		itemSelected: function(item, val, text) {
			alert('You selected the city ' + text + ' with ID ' + val)
			console.log(item)
		}
	})
})