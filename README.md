# Senior Backend Engineer Test

Develop a Blog RESTful API using Node.js, Express, TypeScript, and PostgreSQL/Prisma

** Getting The App Running **:

- Ensure you have node v18+, postgres and redis installed

- Clone the repo

- update .env with your postgres database and redis credentials

- Run `npm install` follow by `npm run migrate:dev` and `npm start`

** Getting App Running via docker **:

- In the root directory, Run the command `docker-compose up` in the root directory and visit 127.0.0.1:9000/health to confirm its up

** To run the integrations and units test **:

-  Copy the contents of `.env.example` as it is to `.env.test` 
- update the database name with the database you want to use for testing, in case of docker `test_db` then run `npm run migrate:test` afterward, run `npm run test` to run successfully both unit and integration tests
