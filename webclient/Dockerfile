FROM node:16.13.0

ENV TZ=America/Los_Angeles

ENV PATH="${PATH}:/scripts/node_modules/.bin/"

RUN apt update

RUN apt install -y xsel

COPY ./scripts /scripts

WORKDIR /scripts

RUN npm install

RUN npm run build

ENTRYPOINT ["serve", "-s", "build"]
