FROM ubuntu:focal

ENV TZ=America/Los_Angeles

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update

RUN apt upgrade

RUN apt install -y python3 python3-pip unoconv

RUN python3 -m pip install python-docx openpyxl requests pymongo

COPY ./scripts /scripts

COPY scripts/prices /prices

RUN mkdir /logs

RUN touch /logs/log.log

ENTRYPOINT ["tail", "-f", "/logs/log.log"]
