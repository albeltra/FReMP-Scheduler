FROM ubuntu:focal

ENV TZ=America/Los_Angeles

ENV DEBIAN_FRONTEND=noninteractive

ENV GUNICORN_CMD_ARGS=""

RUN apt-get update

RUN apt-get upgrade -y

RUN apt install -y python3 python3-pip unoconv

RUN python3 -m pip install pymongo flask flask-cors googlemaps numpy python-docx openpyxl requests gunicorn pyjwt

COPY ./scripts/docx_edit_functions.py /scripts/docx_edit_functions.py

#COPY ./scripts/invoice.py /scripts/invoice.py

#COPY ./scripts/invoice_functions.py /scripts/invoice_functions.py   

#COPY ./scripts/invoice_n.py /scripts/invoice_n.py   

#COPY ./scripts/prices/prices.txt /scripts/prices/prices.txt

#COPY ./scripts/template/Invoice-Template.docx /scripts/template/Invoice-Template.docx

WORKDIR /scripts

ENTRYPOINT ["gunicorn", "-b", "0.0.0.0",  "--chdir", "/scripts", "app:app"]
