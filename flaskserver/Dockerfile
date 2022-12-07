FROM ubuntu:focal

COPY ./scripts /scripts

WORKDIR /scripts

ENV TZ=America/Los_Angeles

ENV DEBIAN_FRONTEND=noninteractive

ENV GUNICORN_CMD_ARGS=""

RUN apt update

RUN apt upgrade

RUN apt install -y python3 python3-pip unoconv

RUN python3 -m pip install pymongo flask flask-cors googlemaps numpy python-docx openpyxl requests

ENTRYPOINT ["gunicorn", "--chdir", "/app", "app:app"]
