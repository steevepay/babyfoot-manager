

# Babyfoot Manager

## Introduction

A Babyfoot manager is a web application aim to manage your babyfoot games. The application allows users to create games and update the game status (in progress / done) with other users in real-time.
You can tchat with other people and make the babyfoot game crazy !!

In order to run and deploy quickly the application you may have install Docker and Docker-compose. Then follow the [setup through docker-compose](#installation-through-docker-compose) section. It easier to manage the project through containers. When you're making a file edit, it's editing the file on the container automatically.

Otherwise, you can setup and run the project locally on your laptop without containers. Follow the [Installation without docker-compose](#installation-without-docker-compose) section.

## Babyfoot API Documentation

To view the API documentation, visit babyfoot.steeve.com/api/v1/. You can access locally to the documentation after running the project at the url [localhost:3010/api/v1](http://localhost:3010/api/v1)

## Getting Started

### Installation through docker-compose

You must create a the root directory an env file called ".env" with the following configuration:
```js
PORT=3010
PGHOST='babyfoot.db'
PGPORT=5432
PGUSER='root'
PGPASSWORD='root'
PGDATABASE='babyfoot'
```

to run the project:
```shell
$ docker-compose up -d
```

to run the unit tests, you must keep the containers up:
```shell
$ docker-compose -p bf-test run -p 3000 --rm bf-server npm run test
```

to stop the project:
```shell
$ docker-compose down
```

### Installation without docker-compose

You must have postgresql installed before continu, [check-out](https://www.postgresql.org/download/).

If you haven't created a user, you should run before:
`createuser <username> --createdb`.
First you need to create your database with the following command:
```shell
$ createdb -h localhost -p 5432 -U $USER babyfoot
```
Then create the tables by dumping the database:
```shell
$ psql babyfoot < ./db/init.sql
```
If you want to check your database on postgresql, you can run:
`psql -U $USER -d babyfoot` and display the tables in the psql cli with: `\dt`;

Create a the root directory an env file ".env" with the following configuration:

```js
PORT=3010
PGHOST='localhost'
PGPORT=5432
PGUSER=<$USER> //insert your laptop username
PGPASSWORD=null
PGDATABASE='babyfoot'
```

Then, install the required packages in the root directory:
```shell
$ npm install
```

Launch the project with the following command:
```shell
$ npm start
```

To launch the tests, execute the command:
```shell
$ npm test
```
