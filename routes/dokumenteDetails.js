
/*
 * GET home page.
 */

module.exports = function(data, fetcher) {

  

  return  function(req, res){
  	var dokument = fetcher.getDoc(req.params.hash);
    res.redirect(dokument.url); 
  }
  
}