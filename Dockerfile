FROM node:16.15

WORKDIR /root
COPY . .


CMD [ "node",  "dist/server.js" ]
