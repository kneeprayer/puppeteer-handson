FROM node:latest
WORKDIR /usr/src/app
COPY script.js .
COPY package.json .
RUN npm install
CMD [ "node", "script.js" ]