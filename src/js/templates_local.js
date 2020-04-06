function fetchClientSideInclude( url )
{
  var req = false;
  // For Safari, Firefox, and other non-MS browsers
  if (window.XMLHttpRequest) {
    try {
      req = new XMLHttpRequest();
    } catch (e) {
      req = false;
    }
  } else if (window.ActiveXObject) {
    // For Internet Explorer on Windows
    try {
      req = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        req = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        req = false;
      }
    }
  }

  if (req) {
    // Synchronous request, wait till we have it all
	// req.overrideMimeType( "text/plain; charset=x-user-defined" );
	req.overrideMimeType( "text/plain" );
    req.open('GET', url, false);
    req.send(null);
    return req.responseText;
  }
}	

function supportsImports() {
  return 'import' in document.createElement('link');
}

function loadTemplates()
{
	// all snippets that normally are packed by the handlebars precompiler must be mentioned here
	var hbdivs = [		
		"about-en",
		"about-de",
		"alert-info",
		"alert-success",
		"alert",
		"attributions-de",
		"attributions-en",
		"contact-de",
		"contact-en",
		"contribute-en",
		"contribute-de",
		"depthsensoroffset-de",
		"depthsensoroffset-en",
		"Disabledcontribute-de",
		"documentation-de",
		"documentation-en",
		"gauge",
		"gaugedialog-en",
		"gaugemeasurement",
		"gauges-de",
		"gauges-en",
		"goodby-de",
		"goodby-en",
		"gpsoffset-de",
		"gpsoffset-en",
		"home-de",
		"home-en",
		"instructions-de",
		"instructions-en",
		"introduction-de",
		"introduction-en",
		"license-de",
		"license-en",
		"login-de",
		"login-en",
		"maptracks",
		"meta1-de",
		"meta1-en",
		"navbar",
		"page",
		"register-de",
		"register-en",
		"register",
		"reset-password",
		"toolbar",
		"track",
		"tracks-de",
		"tracks-en",
		"user-de",
		"user-en",
		"vessel-de",
		"vessel-en",
		"vesselgeneric-de",
		"vesselgeneric-en",
		"vesselitem",
		"vessels-de",
		"vessels-en",
		"welcome-de",
		"welcome-en",
		"wizard" ];

	for ( t of hbdivs )
	{
		var inc;
		inc = fetchClientSideInclude( "js/templates/" + t + ".handlebars" );
		var template = Handlebars.compile(inc);
		Handlebars.templates[ t ] =  template;
	}
}


!function()
{
	var e=Handlebars.template,n=Handlebars.templates=Handlebars.templates||{};
	
	// all scripts that are normally inserted into the header section via handlebars precompiler must be mentioned here.
	var tpl = [ 
		"validation",
		"router",
		"auth",
		"frontend",
		"toolbar",
		"navbar",
		"home",
		"init"];

	for ( t of tpl )
	{
		var source   = document.getElementById(t).innerHTML;
		var template = Handlebars.compile(source);
		Handlebars.templates[ t ] =  template;
	}
	
	loadTemplates();
}();
