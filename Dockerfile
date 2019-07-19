FROM node:carbon

RUN npm i npm@latest -g

ADD . /usr/src/app/signal

WORKDIR /usr/src/app/signal
RUN npm install --only=production

ENV NODE_ENV production
ENV PORT=3000
EXPOSE 3000
CMD [ "npm", "build" ]
CMD [ "npm", "start" ]

