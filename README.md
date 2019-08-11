

# Babyfoot Manager

## Introduction

A Babyfoot manager is a web application aim to manage your babyfoot games. The application allows users to create games and update the game status (in progress / done) with other users in real-time.
You can tchat with other people and make the babyfoot game crazy !!

In order to run and deploy the application you must have installed Docker and Docker-compose. It easier to manage the project through containers. When you're making a file edit, it's editing the file on the container automatically.

## Getting Started

### Manual Installation through docker-compose

You must create an env file called ".env" with the following configuration:
```dosini
PORT=3010
PGHOST=babyfoot.db
PGPORT=5432
PGUSER=root
PGPASSWORD=root
PGDATABASE=babyfoot
VIRTUAL_HOST=
LETSENCRYPT_HOST=
LETSENCRYPT_EMAIL=
```

to run the project:
```shell
docker-compose up -d
```

to run the unit tests, you must keep the containers up:
```shell
$ docker-compose -p bf-test run -p 3000 --rm bf-server npm run test
```

to stop the project:
```shell
$ docker-compose down
```
