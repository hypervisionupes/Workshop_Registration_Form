from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["codehustle_workshop"]  # Database name
def get_db():
    return db
