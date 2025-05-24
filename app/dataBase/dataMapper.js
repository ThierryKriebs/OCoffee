import database from './database.js'; 

const dataMapper = {
  async getAllCoffee() {
    const query = {
      text: `SELECT coffee.*, ch.name AS characteristic, country.name AS country FROM "coffee" 
      JOIN "characteristic" ch ON coffee.characteristic_id = ch.id 
      JOIN "country" ON coffee.country_id = country.id;`
    };
    const results = await database.query(query);
    return results.rows;
  },

  async getLastCoffee(numberOfCoffee = 3) {
    const query = {
      text: `SELECT coffee.*, ch.name AS characteristic, country.name AS country FROM "coffee" 
      JOIN "characteristic" ch ON coffee.characteristic_id = ch.id 
      JOIN "country" ON coffee.country_id = country.id
      ORDER BY "id" DESC
      LIMIT $1;`,
      
      values: [numberOfCoffee]
    };
    const results = await database.query(query);
    return results.rows;
  },

  async getOneCoffeeById(id) {
    const query = {
      text: `SELECT coffee.*, ch.name AS characteristic, country.name AS country FROM "coffee" 
      JOIN "characteristic" ch ON coffee.characteristic_id = ch.id 
      JOIN "country" ON coffee.country_id = country.id 
      WHERE "coffee"."id" = $1;`,
      
      values: [id]
    };
    const results = await database.query(query);
    return results.rows;
  },

  async getAllCharacteristic() {
    const query = {
      text: `SELECT * FROM "characteristic" 
      ORDER BY "name";`,
    };
    const results = await database.query(query);
    return results.rows;
  },

  async getAllCountry() {
    const query = {
      text: `SELECT * FROM "country" 
      ORDER BY "name";`,
    };
    const results = await database.query(query);
    return results.rows;
  },
  
  async  getAllCoffeeWithCountryId(countryId) {
    const query = {
      text: `SELECT "coffee".*, ch.name AS characteristic, country.name AS country FROM "coffee" 
      JOIN "characteristic" ch ON coffee.characteristic_id = ch.id 
      JOIN "country" ON coffee.country_id = country.id 
      WHERE "country"."id" = $1 
      ORDER BY "coffee"."name" ASC;`,
      
      values: [countryId]
    };
    const results = await database.query(query);
    return results.rows;
  },

  async  setInformationContact(name, email) {

    //Verify that the email does not exist in the database:
    let query = {
      text: `SELECT * FROM "contact" WHERE email = $1;`,
      values: [email]
    };
    let result = await database.query(query);

    if (result.rows.length > 0) {
      return {code: -1, error: "L'adresse email existe déjà dans la base de données"};
    }
    
    query = {
      text: `INSERT INTO "contact" (name, email) VALUES ($1, $2) RETURNING*;`,
      
      values: [name, email]
    };
    result = await database.query(query);

    return {code: 1, error: "L'opération a réussie"};
  },

  async  setNewCoffee(name, reference, price, disponibility, description, country_id, characteristic_id) {

    //Verify that the coffee does not exist in the database:
    let query = {
      text: `SELECT * FROM "coffee" WHERE name = $1 OR reference = $2;`,
      values: [name, reference]
    };
    let result = await database.query(query);

    if (result.rows.length > 0) {
      return {code: -1, error: `Le café: ${name}, référence: ${reference} existe déjà dans la base de données`};
    }

    //Verify that the price is convertible to number:
    if (isNaN(parseInt(price)) && price){
      return {code: -1, error: `Le prix est incorrect. Il doit être convertible en nombre. Enregistrement refusé`};
    }

    if (!price) price = 0;
    else price = price * 100;

    //Verify that the country_id is convertible to number:
    if (isNaN(parseInt(country_id)) && country_id){
      return {code: -1, error: `Le paramètre pays_id est incorrect. Il doit être convertible en nombre. Enregistrement refusé`};
    }

    //Verify that the characteristic_id is convertible to number:
    if (isNaN(parseInt(characteristic_id)) && characteristic_id){
      return {code: -1, error: `Le paramètre characteristic_id est incorrect. Il doit être convertible en nombre. Enregistrement refusé`};
    }

    //Verify that the disponibility is a boolean:
    if (disponibility !== "true" && disponibility !== "false"){
      return {code: -1, error: `Le paramètre disponibility est incorrect. Il doit être convertible en booléen. Enregistrement refusé`};
    }

    query = {
      text: `INSERT INTO "coffee" (name, reference, price, disponibility, description, country_id, characteristic_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING*;`,
      
      values: [name, reference, price, disponibility, description, country_id, characteristic_id]
    };
    result = await database.query(query);

    return {code: 1, error: "L'opération a réussie"};
  },
};

export default dataMapper;