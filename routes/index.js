var _ = require('underscore'), Feed = require('feed');

var data = { 
  brand: 'UI.Datenforum',
  version: '0.0.5',
  bodyClass: '',
  navbar: [
    { href: '/fragen', titel: 'Fragen' },
    { href: '/anforderungen', titel: 'Anforderungen' },
    { href: '/dokumente', titel: 'Dokumente' },
    { href: '/codenummern', titel: 'Codenummern' },
    { href: 'http://www.edi-energy.de/', titel: 'EDI@Energy' },
  ]
}

var fetcher = require('../fetcher');

data.extend = function (newObject) {
  return _.defaults(newObject, data);
}

module.exports = {
  home:                 require('./home')(data, fetcher),
  fragen:               require('./fragen')(data, fetcher),
  fragenDetails:        require('./fragenDetails')(data, fetcher),
  anforderungen:        require('./anforderungen')(data, fetcher),
  anforderungenDetails: require('./anforderungenDetails')(data, fetcher),
  dokumente:            require('./dokumente')(data, fetcher),
  dokumenteDetails:     require('./dokumenteDetails')(data, fetcher),
  codenummern:          require('./codenummern')(data, fetcher),
  codenummernDetails:   require('./codenummernDetails')(data, fetcher),
  rss: {
	fragen: function(req, res) {
	
	var fragen = fetcher.getFragen();
	
    var feed = new Feed({
        title:          'Fragen',
        description:    'Alle Fragen die bereits eingereicht wurden können Sie hier einsehen. ',
        link:           '/fragen',
        //image:          'http://example.com/logo.png',
        //copyright:      'Copyright © 2013 John Doe. All rights reserved',

        author: {
            name:       'BDEW Bundesverband der Energie- und Wasserwirtschaft e.V.',
            email:      'info@bdew.de',
            link:       'http://fdf.vdew.net'
        }
    });
	
	for(var themaID in fragen) {
		
		for(var name in fragen[themaID].fragen) {
			
			feed.item({
				title:          fragen[themaID].titel,
				link:           'http://fdf.rguttroff.de/anforderungen/' + fragen[themaID].fragen[name].hash,
				description:    fragen[themaID].fragen[name].frage,
				date:           new Date(fragen[themaID].fragen[name].timestamp * 1000) || new Date()
			});
		
		}
	
	}
	
	res.set('Content-Type', 'text/xml');

	// Sending the feed as a response
	res.send(feed.render('rss-2.0'));

	
	},
	anforderungen: function(req, res) {
	
	var anforderungen = fetcher.getAnforderungen();
	
    var feed = new Feed({
        title:          'Anforderungen',
        description:    'Hier können alle eingerichten Anforderungen eingesehen werden.',
        link:           '/anforderungen',
        //image:          'http://example.com/logo.png',
        //copyright:      'Copyright © 2013 John Doe. All rights reserved',

        author: {
            name:       'BDEW Bundesverband der Energie- und Wasserwirtschaft e.V.',
            email:      'info@bdew.de',
            link:       'http://fdf.vdew.net'
        }
    });
	
	for(var themaID in anforderungen) {
		
		for(var name in anforderungen[themaID].anforderungen) {
		
			feed.item({
				title:          anforderungen[themaID].titel,
				link:           'http://fdf.rguttroff.de/anforderungen/' + anforderungen[themaID].anforderungen[name].hash,
				description:    anforderungen[themaID].anforderungen[name].problembeschreibung,
				date:           new Date(anforderungen[themaID].anforderungen[name].timestamp * 1000) || new Date()
			});
		
		}
	
	}

	res.set('Content-Type', 'text/xml');

	// Sending the feed as a response
	res.send(feed.render('rss-2.0'));
	
	},
  }
}