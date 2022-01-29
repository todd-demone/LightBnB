# Lighthouse BnB

An Airbnb clone.

## Purpose

I worked on Lighthouse BnB while completing the [Lighthouse Labs Web Development Flex Program](https://www.lighthouselabs.ca/en/web-development-flex-program). 

The primary objectives of this project were:
- design a relational database using [database design](https://en.wikipedia.org/wiki/Database_design) best practices, including applying the [normalization rules](https://en.wikipedia.org/wiki/Database_normalization)
- use SQL and PostgreSQL to create the database and tables and seed the tables
- create database queries
- incorporate those queries into the Node.js/Express backend

## Dependencies

The instructions below assume that the following software is installed on your computer:
- [git](https://git-scm.com/)
- [Node.js](https://nodejs.org) (I used v. 12.8.2)
- [npm](https://www.npmjs.com/) - included with Node.js
- [PostgreSQL](https://www.postgresql.org/)

## Instructions for running the app

1. Clone the repository and install the dependencies via npm:

```bash
git clone git@github.com:todd-demone/lighthouse-bnb.git
cd lighthouse-bnb
npm install
```

2. Create a `.env` file in your root folder to store your database-related environment variables. An example file `.env.example` has been included in the root folder of the app.

3. Before proceeding, you may need to set up a password for your user on psql (the PostgreSQL command-line tool):
    - Open `psql` on the command line
    - Type `\password`
    - Type your new password, hit Enter, type the password again, hit Enter.

4. Create and seed the database:
    - Open `psql` on the command line
    - create a database
    - connect to the database
    - create the tables
    - seed the tables with some fake data

```
CREATE DATABASE lightbnb;
\c lightbnb;
\i db/migrations/01_schema.sql;
\i db/seeds/01_seeds.sql;
\i db/seeds/02_seeds.sql;
```

5. Run the server.
```
npm run start
```

6. go to <http://localhost:3000/> in your browser.

7. Click the login link. Use the following sample user data to complete the login:
    - email: `jacksonrose@hotmail.com` 
    - password: `password`

## Npm Dependencies

- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cookie-session](https://www.npmjs.com/package/cookie-session)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://expressjs.com/)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [pg](https://node-postgres.com/)
- [sass](https://sass-lang.com/)

## Author

[Todd Demone](https://github.com/todd-demone)

## Project Structure

```
├── db
│   ├── migrations
│   │   ├── 01_schema.sql
│   ├── queries
│   │   ├── 01_single_user.sql
│   │   ├── 02_avg_length_of_reservation.sql
│   │   ├── 03_property_listings_by_city.sql
│   │   ├── 04_most_visited_cities.sql
│   │   ├── 05_all_my_reservations.sql
│   ├── seeds
│   │   ├── 01_seeds.sql
│   │   ├── 02_seeds.sql
├── public
│   ├── index.html
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── index.js
│   │   ├── libraries
│   │   ├── network.js
│   │   └── views_manager.js
│   └── styles
├── sass
└── server
    ├── database
    │   └── apis.js
    │   └── connection.js
    │   └── users.js
    ├── routes
    │   ├── apiRoutes.js
    │   └── userRoutes.js
    └── express_server.js
```
