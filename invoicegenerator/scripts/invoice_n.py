import argparse
import os

from pymongo import MongoClient

from invoice_functions import create_invoices


def make_invoice(args):
    mongo_user = os.environ.get('MONGO_USER', '')
    mongo_password = os.environ.get('MONGO_PASSWORD', '')
    mongo_host = os.environ.get('MONGO_HOST', '')
    mongo_port = os.environ.get('MONGO_PORT', '')

    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('-N', type=int, help='Description for foo argument', required=True)
    parsed_args = parser.parse_args(args)

    def mongo(user, password, host=mongo_host, port=mongo_port):
        client = MongoClient(f'mongodb://{user}:{password}@{host}:{port}')
        return client

    if all([x != '' for x in [mongo_user, mongo_password, mongo_host, mongo_port]]):
        conn = mongo(mongo_user, mongo_password).database
    else:
        conn = None

    db = conn.database
    current = db.Recent.find({'N': parsed_args.N})
    template_path = '/scripts/template/Invoice-Template.docx'
    create_invoices(current, template_path, flag=0)


if __name__ == '__main__':
    make_invoice()
