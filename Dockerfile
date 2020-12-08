FROM node:12-alpine

WORKDIR /usr/app

COPY package.json .

RUN npm i -g nodemon
RUN npm install --quiet

COPY . .

EXPOSE 8000
CMD [ "node", "index.js" ]
