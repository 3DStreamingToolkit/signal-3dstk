FROM node:carbon

RUN npm i npm@latest -g

WORKDIR /usr/src/app
RUN git clone https://github.com/bengreenier/3dtoolkit-signal.git signal

WORKDIR /usr/src/app/signal
RUN npm install --only=production

ENV NODE_ENV production
ENV PORT=3000
EXPOSE 3000
CMD [ "npm", "start" ]
