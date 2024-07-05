"""Application Models"""
import bson
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
import datetime


"Aim Trainer Model"
class AimTrainers:
    def __init__(self):
        return
    
    "create aim trainer"
    def create(user_id: str, accuracy: float , average_time: float, username : str):
        calculated_score = (100 - accuracy)*6 + average_time
        new_aim_trainer= db.aim_trainer.insert_one({
            "user_id": user_id,
            "accuracy": accuracy,
            "average_time": average_time,
            "timestamp": datetime.datetime.now(),
            "calculated_score": calculated_score,
            "username": username
        }).inserted_id
        return new_aim_trainer
    
    "get aim trainer by user id"
    def get_by_user_id(user_id: str):
        aim_trainers= db.aim_trainer.find({"user_id": user_id})
         # Przekonwertuj tylko pole _id na typ str
        aim_trainers = [
            {**aim_trainer, "_id": str(aim_trainer["_id"])} for aim_trainer in aim_trainers # **aim_trainer - rozpakowuje słownik
    ]
        return aim_trainers
    
    def get_top_ten_aim(user_id: str):
        aim_trainers = list(db.aim_trainer.find().sort("calculated_score", 1).limit(10))
        aim_trainers = [{**aim_trainer, "_id": str(aim_trainer["_id"])} for aim_trainer in aim_trainers]

        user_in_top = any(aim_trainer["user_id"] == user_id for aim_trainer in aim_trainers)
        
        if not user_in_top:
            score_of_user = db.aim_trainer.find({"user_id": user_id}).sort("calculated_score", 1).limit(1)[0]
            place_of_user = db.aim_trainer.count_documents({"calculated_score": {"$lt": score_of_user["calculated_score"]}}) + 1 # $gt - greater than
            score_of_user["place"] = place_of_user
            score_of_user["_id"] = str(score_of_user["_id"])
            aim_trainers.append(score_of_user)

        return aim_trainers


"Memory Game Model"
class MemoryGame:
    def __init__(self):
        return
    
    "create memory game"
    def create(user_id: str, score: int, level: str, username: str):
        if level == "Very Easy":
            level_n = 1
        elif level == "Easy":
            level_n = 1.5
        elif level == "Medium":
            level_n = 2
        elif level == "Hard":
            level_n = 3
        else:
            level_n = 3.5

        calculated_score = 2*score/(level_n**2)
        new_memory_game= db.memory_game.insert_one({
            "user_id": user_id,
            "score": score,
            "level": level,
            "timestamp": datetime.datetime.now(),
            "calculated_score": calculated_score,
            "username": username

        }).inserted_id
        return new_memory_game
    
    "get memory game by user id"
    def get_by_user_id(user_id: str):
        memory_games= db.memory_game.find({"user_id": user_id})
        memory_games = [{**memory_game, "_id": str(memory_game["_id"])} for memory_game in memory_games]
        return memory_games
    
    "get top ten memory games"
    def get_top_ten_memory(user_id: str):
        memory_games = list(db.memory_game.find().sort("calculated_score", 1).limit(10))
        memory_games = [{**memory_game, "_id": str(memory_game["_id"])} for memory_game in memory_games]
        user_in_top = any(memory_game["user_id"] == user_id for memory_game in memory_games)
        
        if not user_in_top:
            score_of_user = db.memory_game.find({"user_id": user_id}).sort("calculated_score", 1).limit(1)[0]
            place_of_user = db.memory_game.count_documents({"calculated_score": {"$lt": score_of_user["calculated_score"]}}) + 1
            score_of_user["place"] = place_of_user
            score_of_user["_id"] = str(score_of_user["_id"])
            memory_games.append(score_of_user)

        return memory_games
    
"Sequence Memory Model"
class SequenceMemory:
    def __init__(self):
        return
    
    "create sequence memory"
    def create(user_id: str, score: int, username: str):
        new_sequence_memory= db.sequence_memory.insert_one({
            "user_id": user_id,
            "score": score,
            "timestamp": datetime.datetime.now(),
            "calculated_score" : score,
            "username": username
        }).inserted_id
        return new_sequence_memory
    
    "get sequence memory by user id"
    def get_by_user_id(user_id: str):
        sequence_memories= db.sequence_memory.find({"user_id": user_id})
        sequence_memories = [{**sequence_memory, "_id": str(sequence_memory["_id"])} for sequence_memory in sequence_memories]
        return sequence_memories
    
    "get top ten sequence memories"
    def get_top_ten_sequence(user_id: str):
        sequence_memories = list(db.sequence_memory.find().sort("calculated_score", -1).limit(10))
        sequence_memories = [{**sequence_memory, "_id": str(sequence_memory["_id"])} for sequence_memory in sequence_memories]
        user_in_top = any(sequence_memory["user_id"] == user_id for sequence_memory in sequence_memories)
        
        if not user_in_top:
            score_of_user = db.sequence_memory.find({"user_id": user_id}).sort("calculated_score", -1).limit(1)[0]
            place_of_user = db.sequence_memory.count_documents({"calculated_score": {"$gt": score_of_user["calculated_score"]}}) + 1
            score_of_user["place"] = place_of_user
            score_of_user["_id"] = str(score_of_user["_id"])
            sequence_memories.append(score_of_user)

        return sequence_memories

"Typing Model"
class Typing:
    def __init__(self):
        return
    
    "create typing"
    def create(user_id: str, score: int, username: str):
        new_typing= db.typing.insert_one({
            "user_id": user_id,
            "score": score,
            "timestamp": datetime.datetime.now(),
            "calculated_score": score,
            "username": username
        }).inserted_id
        return new_typing
    
    "get typing by user id"
    def get_by_user_id(user_id: str):
        typings= db.typing.find({"user_id": user_id})
        typings = [{**typing, "_id": str(typing["_id"])} for typing in typings]
        return typings
    
    "get top ten typings"
    def get_top_ten_typing(user_id: str):
        typings = list(db.typing.find().sort("calculated_score", 1).limit(10))
        typings = [{**typing, "_id": str(typing["_id"])} for typing in typings]
        user_in_top = any(typing["user_id"] == user_id for typing in typings)
        
        if not user_in_top:
            score_of_user = db.typing.find({"user_id": user_id}).sort("calculated_score", 1).limit(1)[0]
            place_of_user = db.typing.count_documents({"calculated_score": {"$lt": score_of_user["calculated_score"]}}) + 1
            score_of_user["place"] = place_of_user
            score_of_user["_id"] = str(score_of_user["_id"])
            typings.append(score_of_user)

        return typings

"Clicker Model"
class Clicker:
    def __init__(self):
        return
    
    "create clicker"
    def create(user_id: str, clicks_per_second: float, clicks: int, time: int, username: str):
        if time == 5:
            level_n = 1
        elif time == 10:
            level_n = 1.03
        elif time == 15:
            level_n = 1.06
        elif time == 20:
            level_n = 1.09
        else:
            level_n = 1.12
        calculated_score = clicks_per_second * level_n
        new_clicker= db.clicker.insert_one({
            "user_id": user_id,
            "clicks_per_second": clicks_per_second,
            "clicks": clicks,
            "time": time,
            "timestamp": datetime.datetime.now(),
            "calculated_score": calculated_score,
            "username": username
        }).inserted_id
        return new_clicker
    
    "get clicker by user id"
    def get_by_user_id(user_id: str):
        clickers= db.clicker.find({"user_id": user_id})
        clickers = [{**clicker, "_id": str(clicker["_id"])} for clicker in clickers]
        return clickers
    
    "get top ten clickers"
    def get_top_ten_clicker(user_id: str):
        clickers = list(db.clicker.find().sort("calculated_score", -1).limit(10))
        clickers = [{**clicker, "_id": str(clicker["_id"]), "calculated_score": float(clicker["calculated_score"])} for clicker in clickers]
        user_in_top = any(clicker["user_id"] == user_id for clicker in clickers)

        if not user_in_top:
            score_of_user = db.clicker.find({"user_id": user_id}).sort("calculated_score", -1).limit(1)[0]
            score_of_user["calculated_score"] = float(score_of_user["calculated_score"])
            place_of_user = db.clicker.count_documents({"calculated_score": {"$gt": score_of_user["calculated_score"]}}) + 1
            score_of_user["place"] = place_of_user
            score_of_user["_id"] = str(score_of_user["_id"])
            clickers.append(score_of_user)

        clickers.sort(key=lambda x: x["calculated_score"], reverse=True)
        return clickers


  
"Reaction Time Model"
class ReactionTime:
    def __init__(self):
        return
    
    "create reaction time"
    def create(user_id: str, time: float, username: str):
        new_reaction_time= db.reaction_time.insert_one({
            "user_id": user_id,
            "time": time,
            "timestamp": datetime.datetime.now(),
            "username": username
        }).inserted_id
        return new_reaction_time
    
    "get reaction time by user id"
    def get_by_user_id( user_id: str):
        reaction_times= db.reaction_time.find({"user_id": user_id})
        reaction_times = [{**reaction_time, "_id": str(reaction_time["_id"])} for reaction_time in reaction_times]
        return reaction_times
    
    "get top ten reaction times"
    def get_top_ten_reaction(user_id: str):
        reaction_times = list(db.reaction_time.find().sort("time", 1).limit(10))
        user_in_top = any(reaction_time["user_id"] == user_id for reaction_time in reaction_times)
        
        if not user_in_top:
            score_of_user = db.reaction_time.find({"user_id": user_id}).sort("time", 1).limit(1)[0]
            place_of_user = db.reaction_time.count_documents({"time": {"$lt": score_of_user["time"]}}) + 1
            score_of_user["place"] = place_of_user
            score_of_user["_id"] = str(score_of_user["_id"])
            reaction_times.append(score_of_user)

        return reaction_times
    
"Placeholder Model"
class Placeholder:
    def __init__(self):
        return
    
    "create placeholder"
    def create(user_id: str, score: int, username: str):
        new_placeholder= db.placeholder.insert_one({
            "user_id": user_id,
            "score": score,
            "timestamp": datetime.datetime.now(),
            "username": username
        }).inserted_id
        return new_placeholder
    
    "get placeholder by user id"
    def get_by_user_id(user_id: str):
        placeholders= db.placeholder.find({"user_id": user_id})
        placeholders = [{**placeholder, "_id": str(placeholder["_id"])} for placeholder in placeholders]
        return placeholders
    
    "get top ten placeholders"
    def get_top_ten_placeholder(user_id: str):
        placeholders = list(db.placeholder.find().sort("score", -1).limit(10))
        user_in_top = any(placeholder["user_id"] == user_id for placeholder in placeholders)
        
        if not user_in_top:
            score_of_user = db.placeholder.find({"user_id": user_id}).sort("score", -1).limit(1)[0]
            place_of_user = db.placeholder.count_documents({"score": {"$gt": score_of_user["score"]}}) + 1
            score_of_user["place"] = place_of_user
            score_of_user["_id"] = str(score_of_user["_id"])
            placeholders.append(score_of_user)

        return placeholders


"TZWCTR Model"
class TZWCTR:
    def __init__(self):
        return
    
    "create tzwctr"
    def create(user_id: str, time: float, level: int, username: str):

        calculated_score = time / level

        new_tzwctr= db.tzwctr.insert_one({
            "user_id": user_id,
            "time": time,
            "level": level,
            "timestamp": datetime.datetime.now(),
            "calculated_score": calculated_score,
            "username": username
        }).inserted_id
        return new_tzwctr
    
    "get tzwctr by user id"
    def get_by_user_id(user_id: str):
        tzwctrs= db.tzwctr.find({"user_id": user_id})
        tzwctrs = [{**tzwctr, "_id": str(tzwctr["_id"])} for tzwctr in tzwctrs]
        return tzwctrs
    
    "get top ten tzwctrs"
    def get_top_ten_tzwctr(user_id: str):
        tzwctrs = list(db.tzwctr.find().sort("calculated_score", 1).limit(10))
        tzwctrs = [{**tzwctr, "_id": str(tzwctr["_id"])} for tzwctr in tzwctrs]
        user_in_top = any(tzwctr["user_id"] == user_id for tzwctr in tzwctrs)
        
        if not user_in_top:
            score_of_user = db.tzwctr.find({"user_id": user_id}).sort("calculated_score", 1).limit(1)[0]
            place_of_user = db.tzwctr.count_documents({"calculated_score": {"$lt": score_of_user["calculated_score"]}}) + 1
            score_of_user["place"] = place_of_user
            score_of_user["_id"] = str(score_of_user["_id"])
            tzwctrs.append(score_of_user)

        return tzwctrs

"User model"
class Users:
    def __init__(self):
        return
    
    "create user"
    def create(self, username: str, email: str, password: str, data_created: str):
        hashed_password = generate_password_hash(password)

        new_user= db.user.insert_one({
            "email": email,
            "password": hashed_password,
            "username": username,
            "date_created": data_created
        }).inserted_id

        return new_user

    "get user by email"
    def get_by_email(self, email: str):
        user= db.user.find_one({"email": email})

        if not user:
            return 
        user["_id"] = str(user["_id"])
        return user
    
    "get user by username"
    def get_by_username(self, username: str):
        user= db.user.find_one({"username": username})

        if not user:
            return
        user["_id"] = str(user["_id"])
        return user
    
    "get user by id"
    def get_by_id(self, user_id: str):
        user= db.user.find_one({"_id": bson.objectid.ObjectId(user_id)})
        if not user:
            return
        user["_id"] = str(user["_id"])
        user.pop("password") # remove password from user object before returning
        return user
    
    "delete user"
    def delete(self, user_id: str):
        AimTrainers().delete_by_user_id(user_id)
        MemoryGame().delete_by_user_id(user_id)
        SequenceMemory().delete_by_user_id(user_id)
        Typing().delete_by_user_id(user_id)
        Clicker().delete_by_user_id(user_id)
        ReactionTime().delete_by_user_id(user_id)
        
        db.user.delete_one({"_id": bson.objectid.ObjectId(user_id)})
        user= self.get_by_id(user_id)
        return user

    "login user"
    def login(self, username: str, password: str):
        user= db.user.find_one({"username": username})

        if not user:
            return "user"
        if check_password_hash(user["password"], password):
            user["_id"] = str(user["_id"])
            user.pop("password")
            return user
        return "password"