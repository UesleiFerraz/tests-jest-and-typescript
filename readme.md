# use tests with a postgres Database

another database could not work as expected!

## start tests

To start the tests use yarn test, yarn test:verbose or yarn test:coverage,  
These scripts already run docker-compose-up -d, so be sure to have docker running your machine

## specific tests

use yarn test:integration to run only integration tests or  
yarn test:unit to run only unit tests  
remember be sure to have docker running on your machine to tests scripts works or
just use any local or remote postgres database and create a .env file with
`DOCKER_TEST_DB_URL={your database url}`  
and retire docker-compose up -d on the yarn test:setup script
