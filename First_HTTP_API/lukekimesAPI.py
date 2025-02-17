# import libraries
from flask import Flask

# create app
app = Flask(__name__)

# define route for /helloworld
@app.route('/helloworld', methods=['GET'])
def hello_world():
    return "Hello World!", 200 # return text and 200 HTTP code

if __name__ == '__main__':
    app.run(debug=True)