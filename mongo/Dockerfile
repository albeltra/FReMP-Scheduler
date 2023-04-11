FROM python:3.9.16-slim-bullseye

COPY ./scripts /scripts

RUN cd /scripts; pip install -r requirements.txt

WORKDIR /scripts