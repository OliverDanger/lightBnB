const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = (email) => {
  return pool
    .query (
      `SELECT *
      FROM users
      WHERE users.email = $1;`,[email]
    )
    .then(res => {
      if (!res.rows) {
        return null;
      }
      console.log(res.rows);
      return res.rows[0];
    })
    .catch(err => console.log(err.message));
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = (id) => {
  return pool
    .query (
      `SELECT *
      FROM users
      WHERE users.id = $1;`,[id]
    )
    .then(res => {
      if (!res.rows) {
        return null;
      }
      console.log(res.rows);
      return res.rows[0];
    })
    .catch(err => console.log(err.message));
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = (userObj) => {
  return pool
    .query (
      `INSERT INTO users (
        name, email, password) 
        VALUES (
        $1, $2, $3)
        RETURNING *;`,[userObj.name, userObj.email, userObj.password]
    )
    .then(res => {
      if (!res.rows) {
        return null;
      }
      console.log(res.rows);
      return res.rows
    })
    .catch(err => console.log(err.message));
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(
      `SELECT properties.*
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;`, [guest_id, limit]
    )
    .then(res => {
      return res.rows;
    })
    .catch(err => console.log(err));
}

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

//helper function
const andOrWhere = (length) => {
  if (length > 0){
    return `AND`
  }
  return `WHERE`
};

const getAllProperties = function (options, limit = 10) {

  const queryParams = [];

  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties 
    JOIN property_reviews ON properties.id = property_id `;
  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `${andOrWhere(queryParams.length)} properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `${andOrWhere(queryParams.length)} properties.cost_per_night > $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `${andOrWhere(queryParams.length)} properties.cost_per_night < $${queryParams.length} `;
  }

  queryString += `GROUP BY properties.id `

  if (options.minimum_rating) {
    queryParams.push(parseInt(options.minimum_rating));
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then(res => {
      console.log('RESPONSE: ',res.rows);
      return res.rows;
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
