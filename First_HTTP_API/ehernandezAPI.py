from flask import Flask # imports needed libraries

app = Flask(__name__) # creates Flask application

# new route added (creates new URL that returns string)
@app.route('/firstAPI', methods=['GET'])
def new_api():
    return "Hello, this is a new HTTP API!"

if __name__ == '__main__':
    app.run(debug=True)