import json
import os
from datetime import datetime, timedelta
from functools import wraps
from urllib.parse import unquote
import googlemaps
import jwt
import pymongo
from bson import ObjectId
from bson import json_util
from flask import Flask, request, send_from_directory, make_response, jsonify
from flask_cors import CORS

gmaps_key = os.environ.get('GMAPS_API_KEY', '')
gmaps = googlemaps.Client(key=gmaps_key) if gmaps_key != '' else None

mongo_user = os.environ.get('MONGO_USER', '')
mongo_password = os.environ.get('MONGO_PASSWORD', '')
mongo_host = os.environ.get('MONGO_HOST', '')
mongo_port = os.environ.get('MONGO_PORT', '')


def mongo(user, password, host=mongo_host, port=mongo_port):
    client = pymongo.MongoClient(f'mongodb://{user}:{password}@{host}:{port}')
    return client


if all([x != '' for x in [mongo_user, mongo_password, mongo_host, mongo_port]]):
    db = mongo(mongo_user, mongo_password)
else:
    db = None

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
        try:
            # decode the token to obtain user public_id
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])

        except:
            return make_response(jsonify({"message": "Invalid token!"}), 401)
        # Return the user information attached to the token
        return f(data, *args, **kwargs)

    return decorator


@app.route('/flask/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = json.loads(request.data)
        print(request.data)
        print(data)
        user = data.get("username")
        password = data.get("password")
        global db
        if db is None:
            try:
                if user and password:
                    client = mongo(user, password)
                    client.server_info()
                    db = client.scheduler
            except:
                return make_response(jsonify({"message": "Invalid Login"}), 401)
        token = jwt.encode({'user': user, 'password': password}, app.config['SECRET_KEY'], 'HS256')
        return make_response(jsonify({'token': token}), 201)


@app.route("/flask/invoices/<path:name>")
@token_required
def download_file(public_id, name):
    if os.path.isfile('/invoices/' + name):
        return send_from_directory(
            '/invoices/', name, as_attachment=True
        )
    elif os.path.isfile('/invoices/' + name.replace(' .pdf', '.pdf')):
        return send_from_directory(
            '/invoices/', name.replace(' .pdf', '.pdf'), as_attachment=True)
    else:
        N = name.split(' ')[1]
        command = f"python3 /scripts/invoice_n.py -N {N}"
        os.system(command)
        return send_from_directory(
            '/invoices/', name, as_attachment=True
        )


@app.route("/flask/recreate/<path:name>")
@token_required
def recreate_file(public_id, name):
    print(name)
    N = name.split(' ')[1]
    command = f"python3 /scripts/invoice_n.py -N {N}"
    os.system(command)
    return send_from_directory(
        '/invoices/', name, as_attachment=True
    )


@app.route("/flask/weekend", methods=['GET'])
@token_required
def weekend(public_id):
    if request.method == 'GET':
        today = datetime.today()
        date1 = today + timedelta(days=4 - today.weekday())
        date2 = date1 + timedelta(days=2)
        out = list(db.Recent.find({"ISODate": {"$gte": date1, "$lte": date2}}).sort("ISODate", pymongo.ASCENDING))
        return json_util.dumps({"data": out}), 200


@app.route("/flask/history/<field>", methods=['GET'])
def get_field(field):
    if request.method == 'GET':
        out = list(db.Historical.find({unquote(field): {"$exists": True}}).sort("ISODate", pymongo.DESCENDING).limit(4))
        return json_util.dumps({"data": out}), 200


@app.route("/flask/update/<ID>", methods=['POST'])
@token_required
def update_record(public_id, ID):
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
        print(filtered)
        return 'Success', 200


@app.route("/flask/add", methods=['POST'])
@token_required
def add_record(public_id):
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
def distinct(public_id):
    if request.method == 'GET':
        print(request.args)
        key = request.args.get("key")
        if key is not None:
            output = db.Recent.distinct(key)
            return json.dumps(output), 200
        else:
            return 'Must specify field in GET request', 500
