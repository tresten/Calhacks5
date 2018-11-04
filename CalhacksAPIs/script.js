const iframe = document.getElementById("demo");
const input = document.getElementById("search");
const GET_SUGG_DELAY = 1000; // You can adjust this
let value = "";
let timer;

document.addEventListener('DOMContentLoaded', start);

// functionally set src here
function setSrc(val) {
  iframe.src = `${val}?output=embed`;
}

function start(){
  let instance = M.Autocomplete.init(input, {});


  input.onkeyup = evt => {
    if(timer) {
      clearTimeout(timer);
    }
    console.log(input.value);
    timer = setTimeout(() => {
      timer = null;
      if(input.value !== value) {
        value = input.value;
        getSuggestions(input.value);
      }
    }, GET_SUGG_DELAY);
  };

  function getSuggestions(query) {
    let req = new Request(`https://api.cognitive.microsoft.com/bing/v5.0/suggestions?mkt=en-US&q=${query}`, {
      method: 'GET',
      headers : {
        'Ocp-Apim-Subscription-Key': key,
      }
    });

    fetch(req).then((response)=>response.json()).then(data => {
      showSuggestions(data.suggestionGroups[0].searchSuggestions);
    });
  }

  function showSuggestions(suggestions) {
    console.log(suggestions)
    let options = {};
    suggestions.forEach(s => {
      options = {
        ...options,
        [s.displayText]: s.url
      };
    });
    instance.updateData(options);
    instance.open();
        
  }
}
