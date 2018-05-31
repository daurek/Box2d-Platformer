/// Facebook.js takes care of facebook Login (copied from pdf and website)

// If the user is logged on the game
var loggedOn = false;

function statusChangeCallback(response)
{
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') // Logged into your app and Facebook.
        testAPI();
    else if (response.status === 'not_authorized') // The person is logged into Facebook, but not your app.
        console.log("The person is logged into Facebook, but not your app.");
    else {} // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState()
{
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

function testAPI ()
{
    console.log('Welcome! Fetching your information.... ');
    FB.api('/me?fields=id,name,first_name,email,picture', function(response) {
    // The user was logged successfully
    console.log('Successful login for: ' + response.name);
    console.log(response);
    userName.name = response.name;
    loggedOn = true;
    });
}

function CloseFacebook ()
{
    FB.getLoginStatus(function (response)
    {
        if (response.status === 'connected')
        {
            FB.logout(function (response)
            {
                console.log('User logged out');
                setTimeout(function () {
                    loggedOn = false;
                    userName.name = "Not Connected";
                }, 500);
            });
        }
    });
}
window.fbAsyncInit = function()
{
    FB.init({
      appId      : '393141491186711',
      cookie     : true,
      xfbml      : true,
      version    : 'v3.0'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
