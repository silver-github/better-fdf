
/*
 * GET home page.
 */

var _ = require('underscore');

module.exports = function(data, fetcher) {

  return  function(req, res){
  	
  	var fragen = fetcher.getFragen(200);

  	for(var themaID in fragen) {

  		fragen[themaID].fragenByDatum = _.groupBy(fragen[themaID].fragen, function(frage) {

				var date = new Date(frage.timestamp*1000);
				// hours part from the timestamp
				var month = date.getMonth() + 1;
				// minutes part from the timestamp
				var year = date.getFullYear();
				// seconds part from the timestamp
				var date = date.getDate();

				// will display time in 10:30:23 format
				return date + '.' + month + '.' + year;

  		});

  	}

  	var extendedData = data.extend({ title: data.navbar[0].titel, fragen: fragen });


	res.render('fragen', extendedData);

  }

};