from flask import Flask, Blueprint, request, jsonify, render_template
from flask_login import login_required, current_user
from flask_cors import CORS
from . import db
#import jwt, os

# from .models import AimTrainers, MemoryGame, SequenceMemory, Typing, Clicker, Placeholder, TZWCTR
from .models import AimTrainers, MemoryGame, SequenceMemory, Typing, Clicker,  TZWCTR

from .auth_middleware import token_required

game = Blueprint('game', __name__)
CORS(game, supports_credentials=True,origins="http://localhost:5173", methods=["GET", "POST"])

@game.route('/aim-trainer', methods=['POST'])
@token_required
def aim_trainer(current_user):
    try:
        data = request.get_json()

        if not data['accuracy'] or not data['average_time']:
            return jsonify({'message': 'Invalid data provided'}), 400

        try:
            data['accuracy'] = float(data['accuracy'])
            data['average_time'] = float(data['average_time'])
        except Exception as e:
            return jsonify({'message': 'Invalid data types for accuracy or average_time'}), 400

        add_data = AimTrainers.create(current_user["_id"], data['accuracy'], data['average_time'],current_user["username"])

        if not add_data:
            return jsonify({'message': 'Failed to add aim-trainer data'}), 500 #500 server error

        return jsonify({'message': 'Aim trainer data added successfully'}), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to add aim trainer data",
            "error": str(e)
        }), 500

@game.route('/aim-trainer', methods=['GET'])
@token_required
def get_aim_trainer(current_user):
    try:
        aim_trainers = AimTrainers.get_by_user_id(current_user["_id"])
        return jsonify({
            'message': 'Aim trainer data retrieved successfully',
            'data': aim_trainers
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to retrieve aim trainer data",
            "error": str(e),
            "data": None
        }), 500
    
@game.route('/memory-game', methods=['POST']) #score level
@token_required
def memory_game(current_user):
    try:
        data = request.get_json()

        if not data['score'] or not data['level']:
            return jsonify({'message': 'Invalid data provided'}), 400
        
        add_data = MemoryGame.create(current_user["_id"], data['score'], data['level'], current_user["username"])

        if not add_data:
            return jsonify({'message': 'Failed to add memory-game data'}), 500
        
        return jsonify({'message': 'Memory-game data added successfully'}), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to add memory game data",
            "error": str(e)
        }), 500
    
@game.route('/memory-game', methods=['GET'])
@token_required
def get_memory_game(current_user):
    try:
        memory_games = MemoryGame.get_by_user_id(current_user["_id"])
        return jsonify({
            'message': 'Memory game data retrieved successfully',
            'data': memory_games
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to retrieve memory game data",
            "error": str(e),
            "data": None
        }), 500
    
@game.route('/sequence-memory', methods=['POST'])
@token_required
def sequence_memory(current_user):

    try:
        data = request.get_json()

        if not data['score']:
            return jsonify({'message': 'Invalid data provided'}), 400

        add_data = SequenceMemory.create(current_user["_id"], data['score'], current_user["username"])

        if not add_data:
            return jsonify({'message': 'Failed to add sequence-memory data'}), 500
        
        return jsonify({'message': 'Sequence-memory data added successfully'}), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to add sequence memory data",
            "error": str(e)
        }), 500

@game.route('/sequence-memory', methods=['GET'])
@token_required
def get_sequence_memory(current_user):
    try:
        sequence_memories = SequenceMemory.get_by_user_id(current_user["_id"])
        return jsonify({
            'message': 'Sequence memory data retrieved successfully',
            'data': sequence_memories
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to retrieve sequence memory data",
            "error": str(e),
            "data": None
        }), 500

@game.route('/typing', methods=['POST'])
@token_required
def typing(current_user):
    try:
        data = request.get_json()

        if not data['score']:
            return jsonify({'message': 'Invalid data provided'}), 400
        
        add_data = Typing.create(current_user["_id"], data['score'], current_user["username"])

        if not add_data:
            return jsonify({'message': 'Failed to add typing data'}), 500
        
        return jsonify({'message': 'Typing data added successfully'}), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to add typing data",
            "error": str(e)
        }), 500

@game.route('/typing', methods=['GET'])
@token_required
def get_typing(current_user):
    try:
        typings = Typing.get_by_user_id(current_user["_id"])
        return jsonify({
            'message': 'Typing data retrieved successfully',
            'data': typings
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to retrieve typing data",
            "error": str(e),
            "data": None
        }), 500

@game.route('/clicker', methods=['POST'])
@token_required
def clicker(current_user):
    try:
        data = request.get_json()

        if not data['clicks_per_second'] or not data['clicks'] or not data['time']:
            return jsonify({'message': 'Invalid data provided'}), 400
        
        add_data = Clicker.create(current_user["_id"], float(data['clicks_per_second']), data['clicks'], data['time'], current_user["username"])

        if not add_data:
            return jsonify({'message': 'Failed to add clicker data'}), 500
        
        return jsonify({'message': 'Clicker data added successfully'}), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to add clicker data",
            "error": str(e)
        }), 500

@game.route('/clicker', methods=['GET'])
@token_required
def get_clicker(current_user):
    try:
        clickers = Clicker.get_by_user_id(current_user["_id"])
        return jsonify({
            'message': 'Clicker data retrieved successfully',
            'data': clickers
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to retrieve clicker data",
            "error": str(e),
            "data": None
        }), 500

@game.route('/tzwctr', methods=['POST'])
@token_required
def tzwctr(current_user):
    try:
        data = request.get_json()

        if not data['time'] or not data['level']:
            return jsonify({'message': 'Invalid data provided'}), 400
        
        add_data = TZWCTR.create(current_user["_id"], data['time'], data['level'], current_user["username"])

        if not add_data:
            return jsonify({'message': 'Failed to add tzwctr data'}), 500
        
        return jsonify({'message': 'Tzwctr data added successfully'}), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to add tzwctr data",
            "error": str(e)
        }), 500

@game.route('/tzwctr', methods=['GET'])
@token_required
def get_tzwctr(current_user):
    try:
        tzwctrs = TZWCTR.get_by_user_id(current_user["_id"])
        return jsonify({
            'message': 'TZWCTR data retrieved successfully',
            'data': tzwctrs
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to retrieve tzwctr data",
            "error": str(e),
            "data": None
        }), 500

# @game.route('/placeholder', methods=['POST'])
# @token_required
# def placeholder(current_user):
#     try:
#         data = request.get_json()

#         if not data['score']:
#             return jsonify({'message': 'Invalid data provided'}), 400
        
#        add_data = Placeholder.create(current_user["_id"], data['score'], current_user["username"])

#         if not add_data:
#             return jsonify({'message': 'Failed to add placeholder data'}), 500
        
#         return jsonify({'message': 'Placeholder data added successfully'}), 200
#     except Exception as e:
#         return jsonify({
#             "message": "Failed to add placeholder data",
#             "error": str(e)
#         }), 500
    
# @game.route('/placeholder', methods=['GET', 'POST'])
# @token_required
# def get_placeholder(current_user):
#     try:
#         placeholders = Placeholder.get_by_user_id(current_user["_id"])
#         return jsonify({
#             'message': 'Placeholder data retrieved successfully',
#             'data': placeholders
#         }), 200
#     except Exception as e:
#         return jsonify({
#             "message": "Failed to retrieve placeholder data",
#             "error": str(e),
#             "data": None
#         }), 500

@game.errorhandler(404)
def endpoint_not_found(e):
    return jsonify({
        "message": "Endpoint not found",
        "error": str(e),
        "data": None
    }), 404

@game.route('/top-ten/<game_name>', methods=['GET', 'POST'])
@token_required
def get_top_ten(current_user, game_name):
    
    try:
        if game_name == "aim-trainer":
            top_ten = AimTrainers.get_top_ten_aim(str(current_user["_id"]))
        elif game_name == "memory-game":
            top_ten = MemoryGame.get_top_ten_memory(str(current_user["_id"]))
        elif game_name == "sequence-memory":
            top_ten = SequenceMemory.get_top_ten_sequence(str(current_user["_id"]))
        elif game_name == "typing":
            top_ten = Typing.get_top_ten_typing(str(current_user["_id"]))
        elif game_name == "clicker":
            top_ten = Clicker.get_top_ten_clicker(str(current_user["_id"]))
        # elif name_of_game == "placeholder":
        #     top_ten = Placeholder.get_top_ten_placeholder(str(current_user["_id"]))
        elif game_name == "tzwctr":
            top_ten = TZWCTR.get_top_ten_tzwctr(str(current_user["_id"]))
        return jsonify({
            'message': 'Top ten data retrieved successfully',
            'data': top_ten
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to retrieve top ten data",
            "error": str(e),
            "data": None
        }), 500