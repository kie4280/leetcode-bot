FROM node:16.15

WORKDIR /root
COPY package.json .
RUN npm install

COPY src .

CMD [ "node src/main.js" ]
