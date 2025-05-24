import dataMapper from '../dataBase/dataMapper.js'; 
import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';
import fileUtilities from '../utilities/fileFunctionUtilities.js';

const mainController = {

  async homePage(req, res) {

    try {
      let coffees = await dataMapper.getLastCoffee();
      
      coffees = fileUtilities.searchAllFileCoffeeName(coffees);

      res.render("pages/home", { coffees });
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },

  async cataloguePage(req, res) {

    try {
      const allCharacteristic = await dataMapper.getAllCharacteristic();
      
      let coffees = await dataMapper.getAllCoffee();
      coffees = fileUtilities.searchAllFileCoffeeName(coffees);

      res.render("pages/catalog", { allCharacteristic, coffees });
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },

  async produitPage(req, res) {

    try {

      if (!req.params.id){
        res.render("pages/404");
        return;
      }
      const id = req.params.id;

      let coffee = await dataMapper.getOneCoffeeById(id);

      coffee = fileUtilities.searchAllFileCoffeeName(coffee);

      if (coffee.length > 0) {
        res.render("pages/product", { coffee:coffee[0] });
      }

      else {
        console.log(`This Coffee id does not exist: ${id}` );
        res.status(400).render('pages/404');
      }

    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
    
  },

  localisationPage(req, res) {
    try {
      res.render("pages/localisation" );
      
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },

  async gpsCoordonatesJson(req, res) {
    try {
      const country = await dataMapper.getAllCountry();

      res.json(country);
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },

  async listCoffeeByLocalisationPage(req, res) {
    try {

      const countryId = req.params.countryId;
      
      if (!req.params.countryId){
        res.render("pages/404");
        return;
      }

      let coffees = await dataMapper.getAllCoffeeWithCountryId(countryId);
      coffees = fileUtilities.searchAllFileCoffeeName(coffees);
      const allCharacteristic = await dataMapper.getAllCharacteristic();
      
      res.render("pages/catalog", { allCharacteristic, coffees });
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },

  contactPage (req, res) {
    res.render("pages/contact");
  },

  async saveContactPage (req, res) {
    try {

      const urlOCoffee = req.protocol +"://" + req.get('host');

      if (!req.body.name || !req.body.email){
        res.render("pages/contactConfirmation", {
          name:"", 
          email:"", 
          urlOCoffee,
          message: `L'enregistrement de vos informations de contact a été annulé car des paramètres 
          sont manquants. Veuillez réessayer.<br><br>
          A bientôt sûr:`
        });
        return;
      }

      const name = req.body.name;
      const email = req.body.email;
      

      //Save contact in the Database:
      const saveSuccess =await dataMapper.setInformationContact(name, email);
      
      if (saveSuccess.code !== 1){
        res.render("pages/contactConfirmation", {
          name:name, 
          email:email, 
          urlOCoffee,
          message: `L'enregistrement de vos informations de contact a été annulé car 
          l'erreur suivante est apparue: <br> << ${saveSuccess.error}>> <br><br>  
          Vérifiez vos paramètres et réessayez.<br><br>
          A bientôt sûr:`
        });
        return;
      }
      const serviceID = process.env.serviceID;   //See https://dashboard.emailjs.com/admin
      const templateID = process.env.templateID; //See https://dashboard.emailjs.com/admin/templates/6lpazz8/settings
      const templateParams = {
        name: name,
        email: email,                            //@e-mail of the recipient, see Field To Email from https://dashboard.emailjs.com/admin/templates {{email}}
        urlOCoffee: urlOCoffee,
      };

      const options = {
        publicKey: process.env.publicKey,
        privateKey: process.env.privateKey, 
      };                                        //See https://dashboard.emailjs.com/admin/account

      await emailjs.send(serviceID, 
        templateID, 
        templateParams, 
        options);

      console.log('SEND Email SUCCESS!');
      
      res.render("pages/contactConfirmation", {
        name: name, 
        email: email, 
        urlOCoffee,
        message: `Vos informations de contact ont bien été enregistrées.<br>
        Vous recevrez sous peu un email de confirmation. Pensez à vérifier dans vos SPAM. <br><br>
        A bientôt sûr:`
      });
    }
    catch(error){
      if (error instanceof EmailJSResponseStatus) {
        console.log('EMAILJS FAILED...', error);
      } 

      else {
        console.error(error);
      }
      
      res.status(500).render('pages/500');
    }
  }
};


export default mainController;