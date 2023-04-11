import json
import os
from datetime import datetime, timedelta
from functools import wraps
import subprocess
from urllib.parse import unquote

import googlemaps
import jwt
import pymongo
from bson import ObjectId
from bson import json_util
from flask import Flask, request, send_from_directory, make_response, jsonify
from flask_cors import CORS

from invoice_n import make_invoice

gmaps_key = os.environ.get('GMAPS_API_KEY', '')
gmaps = googlemaps.Client(key=gmaps_key) if gmaps_key != '' else None

mongo_host = os.environ.get('MONGO_HOST', '')
mongo_port = os.environ.get('MONGO_PORT', '')


def mongo(user, password, host=mongo_host, port=mongo_port):
    client = pymongo.MongoClient(f'mongodb://{user}:{password}@{host}:{port}')
    return client


app = Flask(__name__)
CORS(app, resources={r"/flask/*": {"origins": os.environ.get('FLASK_DOMAIN', '*')}})
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', '')


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        # ensure the jwt-token is passed with the headers
        if 'X-Access-Token' in request.headers:
            token = request.headers['x-access-token']
        if not token:  # throw error if no token provided
            return make_response(jsonify({"message": "A valid token is missing!"}), 401)
        # try:
        # decode the token to obtain user db
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])

        # except:
        #     return make_response(jsonify({"message": "Invalid token!"}), 402)
        # Return the user information attached to the token
        db = mongo(data["user"], data["password"], host=mongo_host, port=mongo_port)
        return f(db.database, *args, **kwargs)

    return decorator


@app.route('/flask/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = json.loads(request.data)
        user = data.get("username")
        password = data.get("password")
        if user and password:
            try:
                client = mongo(user, password)
                client.server_info()
                db = client.database
                token = jwt.encode({'user': user, 'password': password}, app.config['SECRET_KEY'], 'HS256')
                return make_response(jsonify({'token': token}), 201)
            except:
                pass
        return make_response(jsonify({"message": "Invalid Login"}), 401)


@app.route("/flask/invoices/<path:name>")
@token_required
def download_file(db, name):
    if os.path.isfile('/invoices/' + name):
        return send_from_directory(
            '/invoices/', name, as_attachment=True
        )
    elif os.path.isfile('/invoices/' + name.replace(' .pdf', '.pdf')):
        return send_from_directory(
            '/invoices/', name.replace(' .pdf', '.pdf'), as_attachment=True)
    else:
        n = name.split(' ')[1]
        make_invoice(['-N', str(n)])
        return send_from_directory('/invoices/', name, as_attachment=True)


@app.route("/flask/recreate/<path:name>")
@token_required
def recreate_file(db, name):
    print(name)
    n = name.split(' ')[1]
    make_invoice(['-N', str(n)])
    return send_from_directory('/invoices/', name, as_attachment=True)


@app.route("/flask/weekend", methods=['GET'])
@token_required
def weekend(db):
    if request.method == 'GET':
        today = datetime.today()
        date1 = today + timedelta(days=4 - today.weekday())
        date2 = date1 + timedelta(days=2)
        out = list(db.Recent.find({"ISODate": {"$gte": date1, "$lte": date2}}).sort("ISODate", pymongo.ASCENDING))
        return json_util.dumps({"data": out}), 200


@app.route("/flask/day/<day>", methods=['GET'])
@token_required
def date(db, day):
    if request.method == 'GET':
        out = list(db.Recent.find({"Date": {"$eq": day}}).sort("ISODate", pymongo.ASCENDING))
        for cur_record in out:
            cur_record["_id"] = str(cur_record["_id"])
        return json_util.dumps({"data": out}), 200


@app.route("/flask/record/<ID>", methods=['GET'])
@app.route("/flask/record", methods=['GET'])
@token_required
def record(db, ID=None):
    if request.method == 'GET':
        if ID is not None:
            out = list(db.Recent.find({"_id": ObjectId(ID)}))
        else:
            out = list(db.Recent.find({}))
        for cur_record in out:
            cur_record["_id"] = str(cur_record["_id"])
        return json_util.dumps({"data": out}), 200


@app.route("/flask/history/<field>", methods=['GET'])
@token_required
def get_field(db, field):
    if request.method == 'GET':
        out = list(db.Historical.find({unquote(field): {"$exists": True}}).sort("ISODate", pymongo.DESCENDING).limit(4))
        return json_util.dumps({"data": out}), 200


@app.route("/flask/update/<ID>", methods=['POST'])
@token_required
def update_record(db, ID):
    if request.method == 'POST':
        record = json.loads(request.data)
        filtered = {k: v for k, v in record.items() if v}
        if 'Date' in filtered:
            filtered['ISODate'] = datetime.strptime(filtered['Date'], '%Y-%m-%d')
        if 'DNBReason' in filtered:
            record['DNB'] = 'X'
        else:
            if 'DNB' in record:
                record['DNB'] = ""
        db.Recent.update_one({'_id': ObjectId(ID)}, {"$set": filtered})
        db.Recent.update_one({'_id': ObjectId(ID)}, {"$unset": {k: v for k, v in record.items() if not v}})
        return 'Success', 200


@app.route("/flask/delete/<ID>", methods=['POST'])
@token_required
def delete_record(db, ID):
    print(ID)
    if request.method == 'POST':
        db.Recent.delete_one({'_id': ObjectId(ID)})
        return 'Success', 200


@app.route("/flask/add", methods=['POST'])
@token_required
def add_record(db):
    if request.method == 'POST':
        record = json.loads(request.data)
        if record['Date']:
            max_record = list(db.Recent.find().sort("N", pymongo.DESCENDING).limit(1))[0]
            record['N'] = max_record["N"] + 1
            if record["Name"]:
                if isinstance(record['Name'], str):
                    record["Name"] = record["Name"].title()

            if record['Location']:
                geocode = gmaps.geocode(record['Location'])
                if len(geocode) > 0:
                    record['Location'] = geocode[0]['formatted_address']
                    record['Geocode'] = geocode
                    for cur in geocode[0]["address_components"]:
                        if "locality" in cur["types"]:
                            record["City"] = cur["long_name"]
                else:
                    record["City"] = ""

            record['ISODate'] = datetime.strptime(record['Date'], '%Y-%m-%d')
            dnb = [x['Location'] for x in list(db.DNB.find())]
            if record['Location'] in dnb:
                dnb_data = {'Location': record.get('Location'), 'Name': record.get('Name'),
                            'Number': record.get('Number')}
                dnb_filtered = {k: v for k, v in dnb_data.items() if v}
                db.DNB.insert_one(dnb_filtered)
                record['DNB'] = 'X'
            filtered = {k: v for k, v in record.items() if v}
            db.Recent.insert_one(filtered)
            return 'Success', 200
        else:
            return 'Must at least specify date', 500


@app.route("/flask/distinct", methods=['GET'])
@token_required
def distinct(db):
    if request.method == 'GET':
        key = request.args.get("key")
        if key is not None:
            output = db.Recent.distinct(key)
            return json.dumps(output), 200
        else:
            return 'Must specify field in GET request', 500
