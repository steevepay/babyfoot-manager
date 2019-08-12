# Babyfoot Manager

## Introduction

Babyfoot Manager is a web application aimed to manage babyfoot games. The application allows users to create games and update the game status (in progress / done) with other users in real-time.
You can tchat with other people and make the babyfoot game crazier !!

## Demo

[Click here to visit the app online.](https://babyfoot.steevep.com)
![Web Capture](./doc/captured.gif)

## Table of Contents

- [Babyfoot Manager](#babyfoot-manager)
  - [Introduction](#introduction)
  - [Demo](#demo)
  - [Table of Contents](#table-of-contents)
  - [Babyfoot API Documentation](#babyfoot-api-documentation)
  - [Setup](#setup)
  - [Quick Start](#quick-start)
    - [Installation through docker-compose](#installation-through-docker-compose)
    - [Installation without docker-compose](#installation-without-docker-compose)
  - [File Structure](#file-structure)
  - [Project Structure](#project-structure)

## Babyfoot API Documentation

To view the API documentation, visit [babyfoot.steevep.com/api/v1/](https://babyfoot.steevep.com/api/v1). You can also access the documentation locally after running the project at the url [localhost:3010/api/v1](http://localhost:3010/api/v1)

## Setup

In order to run and deploy the application, you may install Docker and Docker-compose. Then follow the [setup through docker-compose](#installation-through-docker-compose) section. It is easier to manage the project through containers. When you are making a file edit, it edits the file on the container automatically.

Otherwise, you can setup and run the project locally on your laptop without containers. Follow the [Installation without docker-compose](#installation-without-docker-compose) section.

## Quick Start

### Installation through docker-compose

Make sure you have installed docker-compose and docker before continuing, otherwise [install here](https://docs.docker.com/install/).

You must create a the root directory with an env file called ".env" with the following configuration:
```js
PORT=3010 // Server port
PGHOST='babyfoot.db' // Postgresql Host by docker
PGPORT=5432 // Postgresql Port
PGUSER='root' // Postgresql User
PGPASSWORD='root' // Postgresql password
PGDATABASE='babyfoot' // Database name
```

to run the project:
```shell
$ docker-compose up -d
```
Now the web application is running on http://localhost:3010.

To run the unit tests, you must keep the containers up:
```shell
$ docker-compose -p bf-test run -p 3000 --rm bf-server npm run test
```

to stop the project:
```shell
$ docker-compose down
```

### Installation without docker-compose

You must have postgresql installed before continuing, [check-out](https://www.postgresql.org/download/).

If you have not created a user, you should run execute the following command:
`createuser <username> --createdb`.
First, you need to create your database with the following command:
```shell
$ createdb -h localhost -p 5432 -U $USER babyfoot
```
Then create the tables by dumping the database:
```shell
$ psql babyfoot < ./db/init.sql
```
If you want to check your database on postgresql, you can run:
`psql -U $USER -d babyfoot` and display the tables in the psql cli with: `\dt`;

Create a the root directory with an env file ".env" with the following configuration:

```js
PORT=3010 // Server port
PGHOST='localhost' // Postgresql Host
PGPORT=5432 // Postgresql Port
PGUSER='$USER' // Postgresql User - insert your laptop username
PGPASSWORD=null // Postgresql password by default null
PGDATABASE='babyfoot' // Database name
```

Then, install the required packages in the root directory:
```shell
$ npm install
```

Launch the project with the following command:
```shell
$ npm start
```
Now the web application is running on http://localhost:3010

To launch the tests, execute the command:
```shell
$ npm test
```

## File Structure

Within the download, you will find the following directories and files:

```
|-- Babyfoot Manager,
    |-- .dockerignore',
    |-- .gitignore',
    |-- Dockerfile',
    |-- README.md',
    |-- app.js',
    |-- docker-compose.yml',
    |-- package-lock.json',
    |-- package.json',
    |-- api',
    |   |-- index.js',
    |-- bin',
    |   |-- www',
    |-- db',
    |   |-- init.sql',
    |-- doc',
    |   |-- captured.gif',
    |   |-- structure.jpg',
    |   |-- swagger.yml',
    |-- public',
    |   |-- index.html',
    |   |-- favicons',
    |   |   |-- android-icon-144x144.png',
    |   |   |-- android-icon-192x192.png',
    |   |   |-- android-icon-36x36.png',
    |   |   |-- android-icon-48x48.png',
    |   |   |-- android-icon-72x72.png',
    |   |   |-- android-icon-96x96.png',
    |   |   |-- apple-icon-114x114.png',
    |   |   |-- apple-icon-120x120.png',
    |   |   |-- apple-icon-144x144.png',
    |   |   |-- apple-icon-152x152.png',
    |   |   |-- apple-icon-180x180.png',
    |   |   |-- apple-icon-57x57.png',
    |   |   |-- apple-icon-60x60.png',
    |   |   |-- apple-icon-72x72.png',
    |   |   |-- apple-icon-76x76.png',
    |   |   |-- apple-icon-precomposed.png',
    |   |   |-- apple-icon.png',
    |   |   |-- browserconfig.xml',
    |   |   |-- favicon-16x16.png',
    |   |   |-- favicon-32x32.png',
    |   |   |-- favicon-96x96.png',
    |   |   |-- favicon.ico',
    |   |   |-- manifest.json',
    |   |   |-- ms-icon-144x144.png',
    |   |   |-- ms-icon-150x150.png',
    |   |   |-- ms-icon-310x310.png',
    |   |   |-- ms-icon-70x70.png',
    |   |-- images',
    |   |   |-- delete.png',
    |   |-- javascripts',
    |   |   |-- main.controller.js',
    |   |   |-- main.design.js',
    |   |   |-- babyfoot',
    |   |   |   |-- babyfoot.api.service.js',
    |   |   |   |-- babyfoot.controller.js',
    |   |   |   |-- babyfoot.design.js',
    |   |   |-- services',
    |   |   |   |-- websocket.service.js',
    |   |   |-- tchat',
    |   |       |-- tchat.api.service.js',
    |   |       |-- tchat.controller.js',
    |   |       |-- tchat.design.js',
    |   |-- stylesheets',
    |       |-- babyfoot.css',
    |       |-- global.css',
    |       |-- tchat.css',
    |       |-- themes.css',
    |-- routes',
    |   |-- api.js',
    |   |-- index.js',
    |-- test',
        |-- api.test.js',
```

## Project Structure

![structure schema](./doc/structure.jpg)
