
/*
 * GET home page.
 */

module.exports = function(data) {

  var extendedData = data.extend({ title: 'Express', bodyClass: 'bs-docs-home' });
  
  return  function(req, res){
    res.render('home', extendedData);
  }
  
}