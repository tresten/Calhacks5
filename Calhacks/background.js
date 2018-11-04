chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({personal_vec: {'':0.0}}, function() {
      console.log("The color is green.");
    });
  });

var localHost = "http://127.0.0.1:5002/"

// Func used for debugging
function printJson(obj) {
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
        	console.log(key + " -> " + obj[key]);
    	}
	}
}

function mergeWords(new_words) {
	chrome.storage.sync.get(function(result) {
		console.log("Merging words");

		for (key in result.personal_vec) {
			if (result.personal_vec[key] > .11) {
				result.personal_vec[key] -= .1;
			}
		}

		for(var key in new_words) {
			if (key in result.personal_vec) {
				result.personal_vec[key] = (result.personal_vec[key] + new_words[key])/2.0;
			}
			else {
				result.personal_vec[key] = new_words[key];
			}
		}
		console.log("test")
		for (key in result.personal_vec) {
		if (result.personal_vec.hasOwnProperty(key)) {
        	console.log(key + " -> " + result.personal_vec[key]);
    	}
		}
		
		chrome.storage.sync.set({personal_vec: result.personal_vec});
    });

}

chrome.webNavigation.onCompleted.addListener(function(details) {
	console.log("Visited new page " + details.url);

	chrome.storage.sync.get(function(result) {
          console.log('Value currently is ' + result.personal_vec);
        });

	// Call url to words api
	fetch(localHost + "keyWord/" + details.url).then(
		function(response) {
			if (response.status !== 200) {
        		console.log('Looks like there was a problem. Status Code: ' + response.status);
        		return;
      		}

      		// Examine the text in the response
      		response.json().then(function(data) {
      			// Upated global word vector
        		mergeWords(JSON.parse(data))
      		});
		});	
	
	
});


chrome.tabs.onCreated.addListener(function(current_tab){ 
    //var newTabUrl = chrome.extension.getURL('index.html');
      //chrome.tabs.create({ url: newTabUrl}, function(tab) {
        // targetId = tab.id;         
       // });
    var wikiLink = "https://en.wikipedia.org/"
    //chrome.tabs.update(current_tab.id, {url:'https://www.google.com'});
    chrome.tabs.update(current_tab.id, {url:localHost + 'home/' + wikiLink});



});