from pymongo import MongoClient

MONGO_URI = "mongodb+srv://blackfalconx69_db_user:t2k6FxnaHMkFYXM9@cluster0.ms0ky1p.mongodb.net/?appName=Cluster0/"
client = MongoClient(MONGO_URI)
db = client["first_workshop"]  # Database name
def get_db():
    return db
