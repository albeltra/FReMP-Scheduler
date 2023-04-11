import os
import pymongo
from datetime import datetime, timedelta
from variables import variables, modifiers, primaries, products
import numpy as np

mongo_user = os.environ.get('MONGO_USER', '')
mongo_password = os.environ.get('MONGO_PASSWORD', '')
mongo_host = os.environ.get('MONGO_HOST', '')
mongo_port = os.environ.get('MONGO_PORT', '')

n_per_month = int(os.environ.get('N_PER_MONTH', 150))
months_ahead = int(os.environ.get('MONTHS_AHEAD', 3))
days_behind = int(os.environ.get('DAYS_BEHIND', 3))

def mongo(user, password, host=mongo_host, port=mongo_port):
    client = pymongo.MongoClient(f'mongodb://{user}:{password}@{host}:{port}')
    return client


if all([x != '' for x in [mongo_user, mongo_password, mongo_host, mongo_port]]):
    db = mongo(mongo_user, mongo_password).database
else:
    db = None

start_date = datetime.today() - timedelta(days=days_behind)
end_date = start_date + timedelta(days=30 * months_ahead)

date_range = []
weights = np.array([1 if (start_date + timedelta(days=x)).weekday() < 4 else 3 for x in range(30 * months_ahead)])
samples = np.random.choice(a=np.arange(30 * months_ahead), p=weights / sum(weights), size=months_ahead * n_per_month)
days, counts = np.unique(samples, return_counts=True)

addresses = [

]

first_names = ["John",
               "Mary",
               "Tom",
               "Jessica",
               "Sarah",
               "Alex",
               "Amanda",
               "Joseph",
               ]
last_names = ["Johnson",
              "Robinson",
              "Lopez",
              "Smith"]
addresses = ["One Apple Park Way, Cupertino, CA 95014",
             "1600 Amphitheatre Pkwy, Mountain View, CA 94043",
             "888 Brannan St, San Francisco, CA 94103"]
weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
counter = 0
for day, count in zip(days, counts):
    cur_date = start_date + timedelta(days=int(day))
    records = []
    for _ in range(count):
        cur_record = dict()
        cur_record["N"] = counter
        cur_record['ISODate'] = cur_date
        cur_record['Date'] = datetime.strftime(cur_record['ISODate'], "%Y-%m-%d")
        cur_record["Day"] = weekdays[cur_date.weekday()] + " " + cur_record["Date"][5:]
        cur_record['Location'] = np.random.choice(addresses)
        cur_record['Name'] = np.random.choice(first_names) + " " + np.random.choice(last_names)
        cur_record['Number'] = "5555555555"
        for primary, modifier in zip(primaries, modifiers):
            cur_modifier = np.random.choice(modifier)
            cur_record[cur_modifier + " " + primary] = 1

        for product in products:
            if product not in primaries and product != "Notes":
                if np.random.choice(2):
                    cur_record[product] = int(np.random.choice(2) + 1)
        for key in variables:
            if key not in cur_record:
                cur_record[key] = ""

        counter += 1
        records.append(cur_record)
    db.Recent.insert_many(records)

