
var FacebookAPI = {};

FacebookAPI.loggedIn = false;
FacebookAPI.postToFeed = function() 
{
	// TRACKING
//	_gaq.push(['_trackEvent', 'Favourites', 'Facebook shares', moment.id]);
	
	var obj = {
	      method: 'feed',
	      redirect_uri: 'http://www.goodboydigital.com/client/razorfish/McD_spicy/',//https://mighty-lowlands-6381.herokuapp.com/',//'https://www.goodboydigital.com/client/razorfish/McD_favourites/prototypes/fb/index.html',
	      link: 'http://www.mcdonalds.co.uk/ukhome/promotions.html',
	      picture: "",
	      name:  "NAME",
	      caption: "Caption",
	      description: "I scored" + APP.score
	    };
	
	FB.getLoginStatus(function(response) 
	{
		if (response.status === 'connected' || response.status === 'not_authorized' || !isIpad) 
	  	{
	  		FB.ui(obj, function(){console.log("COOL")});
		}
		else
		{
			 var appId = "142818112572621";
		     var url = "https://www.facebook.com/dialog/feed?app_id="+ appId +"&link="+obj.link+"&picture="+obj.picture+"&caption="+obj.caption+"&description="+obj.description + "&redirect_uri=" + obj.redirect_uri
			 window.location = url;
			 //, 'login', 'height=350,width=550');
		}
	});
	
	/*
    function callback(response) 
    {
       	browseMode = true;
    }
 	*/
  
}

FacebookAPI.checkLoggedIn = function(callback) 
{
	
	FB.getLoginStatus(function(response) {
	  if (response.status === 'connected') {
	  	
	  		console.log("User logged into Facebook and has APP")
	  		
		    FacebookAPI.uid = response.authResponse.userID;
			FacebookAPI.accessTocken = response.authResponse.accessToken;
		    
			FacebookAPI.loggedIn = true;
		
	  			
		     FB.api('/me', function(response) {
		      
		      FacebookAPI.data = response;
		       console.log('Facebook userdata recieved');
		       console.log(response)
		       callback();
		       
		     });
	     
		// the user is logged in and has authenticated your
		// app, and response.authResponse supplies
		// the user's ID, a valid access token, a signed
		// request, and the time the access token 
		// and signed request each expire
		       
		  } else if (response.status === 'not_authorized') {
				
			FacebookAPI.loggedIn = false;
			callback();
			// the user is logged in to Facebook, 
			// but has not authenticated your app
		  } else {
		  	
		  	FacebookAPI.loggedIn = false;
		  	callback();
			//
		    // the user isn't logged in to Facebook.
		  }
		  
		  //alert("?")
	 });
}


FacebookAPI.loginAndGetData = function(callback) 
{
	
	
	var scope = ""

	if(FacebookAPI.loggedIn)
	{
		callback();
		return;	
	}
	
	// login and then get the details..
	FB.login(function(response) {
		
	   if (response.authResponse) {
	   	
		_gaq.push(['_trackEvent', 'Spicy mcbites', 'logged in to facebook', 'logged in to facebook']);
		
	   	FacebookAPI.uid = response.authResponse.userID;
		FacebookAPI.accessTocken = response.authResponse.accessToken;

		FacebookAPI.loggedIn = true;  
		
	     console.log('User logged in Fetching your information.... ');
	     FB.api('/me', function(response) {
	     	
	       console.log(response);
	        console.log('Facebook userdata recieved');
	       FacebookAPI.data = response;
	       FacebookAPI.loggedIn = true;
	       callback();
	       
	     });
	   } else {
	     console.log('User cancelled login or did not fully authorize.');
	   }
	 }, {scope:scope});
}

FacebookAPI.loginAndGetDataAPP = function(callback) 
{
	
}


FacebookAPI.getFriendsUsingApp = function(callback) 
{
	var fqlQuery = encodeURIComponent("SELECT uid FROM user WHERE is_app_user=1 AND uid IN (SELECT uid2 FROM friend WHERE uid1 = me())");
	FB.api("/fql?q=" + fqlQuery, callback );
}

FacebookAPI.requestChallange = function(callback) 
{
	FB.ui({method: 'apprequests',
	  message: 'Come and have ago and beat my score!'
	}, callback);
}




FacebookAPI.createLikeButton = function(location, url)
{
    var elem = $(document.createElement("fb:like"));
    elem.attr("href", url);
    elem.attr("layout", "button_count");
    elem.attr("send", "false");
     elem.attr("show_faces", "true");
    elem.attr("width", "450");
     
    $(location).empty().append(elem);
    FB.XFBML.parse($(location).get(0));
    return elem;
}