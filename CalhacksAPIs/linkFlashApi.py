from flask import Flask, request
from flaskext.genshi import Genshi, render_response
from flask_restful import Resource, Api
#from json import dumps
from flask_jsonpify import jsonify
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 import Features, KeywordsOptions
from flask_cors import CORS

app = Flask(__name__)
app.url_map.strict_slashes=False
api = Api(app)
genshi = Genshi(app)
CORS(app)

class KeywordFinder(Resource):
    def get(self, urlin):


        natural_language_understanding = NaturalLanguageUnderstandingV1(
            version='2018-03-16',
            iam_apikey='CCtMpcdQn7LpNbxY91vvQfWKXhF8y_F9uddx3-bvJKuZ',
            url='https://gateway.watsonplatform.net/natural-language-understanding/api'
        )

        response = natural_language_understanding.analyze(
            url=urlin ,
            features=Features(keywords=KeywordsOptions(sentiment=False, emotion=False))).get_result()
        keywords={}
        for keyword in response["keywords"]:
            keywords[keyword['text']]=keyword['relevance']

        #print(json.dumps(response, indent=2))

        return json.dumps(keywords)




api.add_resource(KeywordFinder, '/keyWord/<path:urlin>')  # Route_3



# new stuff
first_half ="""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
  <link rel="stylesheet" href="style.css">
  <title>Search</title>
</head>
<body style="background-color:powderblue;">
  <div class="container">
    <div class="main white-text">
      <h1 id="title">Monkey Business</h1>
      <div class="input-field">
        <label for="search">Search</label>
        <input type="text" id="search" class="autocomplete white-text">
      </div>
    </div>
    <div class="secondary">
      <!-- place ur url in src below -->
      <iframe id="demo" src=\""""

second_half = """\" frameborder="1" width=900px heigh=300px align="left"></iframe> 
    </div>
  </div>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
  <script src="key.js"></script>
  <script src="script.js"></script>
</body>
</html>"""

link = "https://en.wikipedia.org/"

class Home(Resource):
    def get(self, urlin):
        return home(urlin)


@app.route('/home/<path:urlin>')
def home(urlin):
    return str(first_half + urlin + second_half)



if __name__ == '__main__':
    app.run(port='5002')