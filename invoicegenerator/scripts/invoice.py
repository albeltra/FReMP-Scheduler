import argparse
import os
from datetime import datetime, timedelta

from pymongo import MongoClient

from invoice_functions import create_invoices

mongo_user = os.environ.get('MONGO_USER', '')
mongo_password = os.environ.get('MONGO_PASSWORD', '')
mongo_host = os.environ.get('MONGO_HOST', '')
mongo_port = os.environ.get('MONGO_PORT', '')


parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('-days', type=int, help='Description for foo argument', required=True)
args = parser.parse_args()

def mongo(user, password, host=mongo_host, port=mongo_port):
    client = MongoClient(f'mongodb://{user}:{password}@{host}:{port}')
    return client


if all([x != '' for x in [mongo_user, mongo_password, mongo_host, mongo_port]]):
    conn = mongo(mongo_user, mongo_password).database
else:
    conn = None

date = datetime.today() + timedelta(days=args.days)
db = conn.database
current = db.Recent.find({'Date': date.strftime('%Y-%m-%d')})
template_path = '/scripts/template/Invoice-Template.docx'
create_invoices(current, template_path)
