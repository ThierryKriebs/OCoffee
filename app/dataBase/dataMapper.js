import database from './database.js'; 

const dataMapper = {
  async getAllCoffee() {
    const query = {
      text: `SELECT coffee.*, ch.name AS characteristic, country.name AS country FROM "coffee" 
      JOIN "characteristic" ch ON coffee.characteristic_id = ch.id 
      JOIN "country" ON coffee.country_id = country.id
      ORDER BY "coffee"."name" ASC;`
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

  async getseveralCoffeesByIds(allCoffeeId) {
    
    let requete = `SELECT coffee.*, ch.name AS characteristic, country.name AS country FROM "coffee" 
      JOIN "characteristic" ch ON coffee.characteristic_id = ch.id 
      JOIN "country" ON coffee.country_id = country.id 
      WHERE "coffee"."id" IN (`;
    
    let reqParams = "";

    if (Array.isArray(allCoffeeId)) {
      for (let indexCoffee = 0; indexCoffee < allCoffeeId.length; indexCoffee++) {
        reqParams += `$${indexCoffee + 1}, `;
      }
      reqParams = reqParams.substring(0, reqParams.length - 2); //delete the last ","
    }
    else {
      reqParams = "$1";
      allCoffeeId= [allCoffeeId];
    }
    
    requete = requete + reqParams + ');';
    console.log(requete)    ;
    const query = {
      text: requete,
      values: allCoffeeId
    };
    const results = await database.query(query);
    console.log("work!!");
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
    else price = Math.round(price * 100);

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


  async deleteCoffees(allCoffeeId) {
             
    let requete = `DELETE FROM "coffee" WHERE "id" IN (`;
    let reqParams = "";
    let values = "";
    let query = {};

    //When several Id must be delete
    if (Array.isArray(allCoffeeId)) {
      for (let indexCoffee = 0; indexCoffee < allCoffeeId.length; indexCoffee++) {
        reqParams += `$${indexCoffee + 1}, `;
      }

      reqParams = reqParams.substring(0, reqParams.length - 2); //delete the last ","

      values = allCoffeeId;
    }

    //If only one Id must be delete
    else {
      reqParams = "$1";
      values = [allCoffeeId];
    }
    
    requete = requete + reqParams + ');';
            
    query = {
      text: requete,
      values: values
    };

    await database.query(query);
    return {code: 1, error: "L'opération a réussie"};
  },


  async updateCoffee(id, name, reference, price, disponibility, description, country_id, characteristic_id) {
        
    //Verify that the price is convertible to number:
    if (isNaN(parseInt(price)) && price){
      return {code: -1, error: `Le prix est incorrect. Il doit être convertible en nombre. Enregistrement refusé`};
    }

    if (!price) price = 0;
    else {
      price = Math.round(price * 100);
      console.log("prix final:" + price);
    }

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

    const query = {
      text: `UPDATE "coffee" set "name"= $1, "reference" = $2, "price" = $3, "disponibility" = $4, "description" = $5, 
      "country_id" = $6, characteristic_id =$7 
       WHERE "id" = $8 RETURNING*;`,
      
      values: [name, reference, price, disponibility, description, country_id, characteristic_id, id]
    };
    await database.query(query);
    

    return {code: 1, error: "L'opération a réussie"};
  }
};

export default dataMapper;