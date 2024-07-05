from flask import Flask
from flask_pymongo import PyMongo
from flask_login import LoginManager
import json

mongo = PyMongo()
db = None

def create_app():
    global db

    app = Flask(__name__)
    
    with open('./config.json') as config_file:
        config = json.load(config_file)
        
    app.config['SECRET_KEY'] = config['secret_key'] 
    app.config['MONGO_URI'] = config['mongo_uri']

    mongo.init_app(app)
    db = mongo.db


    login_manager = LoginManager() 
    login_manager.init_app(app) 

    @login_manager.user_loader
    def load_user(user_id):
    # Znajdź użytkownika w bazie danych na podstawie jego publicznego identyfikatora
        user = db.user.find_one({"_id": user_id})
        return user


    from . import auth  # Import the "auth" blueprint module
    from . import game  # Import the "game" blueprint module
    from . import stories_api
    app.register_blueprint(auth.auth)
    app.register_blueprint(game.game)
    app.register_blueprint(stories_api.story)

    return app