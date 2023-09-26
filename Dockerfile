FROM node:19

WORKDIR /app

COPY package*.json ./


COPY . .

RUN npm install

RUN mv .env.example .env

RUN npm run generate

EXPOSE 9000

CMD ["./entrypoint.sh"]
