from flask import Flask

app = Flask(__name__)

@app.route('/PegahApi', methods=['GET'])
def simple_api():
    return "Hello! this is a simple response from the /PegahApi URL!"

if __name__ == '__main__':
    app.run(debug=True)