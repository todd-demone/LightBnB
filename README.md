# LightBnB WebApp

## Purpose

I worked on Lighthouse BnB while completing the [Lighthouse Labs Web Development Flex Program](https://www.lighthouselabs.ca/en/web-development-flex-program). 

The primary purpose of this project was to design a relatIonal database and use SQL and PostgreSQL to create and query the database. The SQL was incorporated into the Node.js/Express backend.

## Getting Started

Clone the repository and run the app using the following commands:

```bash
git clone git@github.com:todd-demone/lighthouse-bnb.git
cd lighthouse-bnb
npm install
node server/server
```

To use the app, go to <http://localhost:3000/> in your browser.

## Dependencies

- [node](https://nodejs.org)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cookie-session](https://www.npmjs.com/package/cookie-session)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://expressjs.com/)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [node-postgres](https://node-postgres.com/)
- [sass](https://sass-lang.com/)

## Author

[Todd Demone](https://github.com/todd-demone)

## Project Structure

```
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
    ├── db
    |   ├── 1_queries
    |   |   ├── 01_single_user.sql
    |   |   ├── 02_avg_length_of_reservation.sql
    |   |   ├── 03_property_listings_by_city.sql
    |   |   ├── 04_most_visited_cities.sql
    |   |   └── 05_all_my_reservations.sql
    |   ├── migrations
    |   |   └── 01_schema.sql
    |   ├── seeds
    |   |   ├── 01_seeds.sql
    |   |   └── 02_seeds.sql
    │   └── index.js
    ├── routes
    │   ├── api.js
    │   └── user.js
    └── server.js
```

* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `sass` contains all of the sass files. 
* `server` contains all of the server side and database code.
  * `server.js` is the entry point to the application. This connects the routes to the database.
  * `db/index.js` is responsible for communicating with the database including establishing a connection. It also exports an object with a `.query` method that is called whenever one of the routes needs to query the database.
  * `routes/api.js` and `routes/user.js` are responsible for any HTTP requests to `/api/something` or `/user/something`. `db/index.js` is required in this file so the routes can be connected to the database.