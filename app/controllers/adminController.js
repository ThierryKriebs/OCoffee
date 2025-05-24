import fs from 'fs'; //For manipulate Cofee image
import dataMapper from '../dataBase/dataMapper.js'; 


const adminController = {

  async newCoffeePage(req, res) {
  
    try {
      const country = await dataMapper.getAllCountry();
      const characteristics = await dataMapper.getAllCharacteristic();
      res.render("pages/newCoffee", { country, characteristics });
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },

  //Save new Coffee in Database + Download Cofee image
  async newCoffeeSave(req, res) {
  
    try {

      if (!req.body.name || !req.body.reference || !req.body.country_id || !req.body.characteristic_id){
        res.render("pages/coffeeConfirmation", {
          message: `L'enregistrement du nouveau café a été annulé car des paramètres 
              sont manquants. Veuillez réessayer.`
        });
        return;
      }
    
      const name = req.body.name;
      const reference = req.body.reference;
      const price = req.body.price;
      const disponibility = req.body.disponibility;
      const description = req.body.description;
      const country_id = req.body.country_id;
      const characteristic_id = req.body.characteristic_id;
      
      const saveSuccess =await dataMapper.setNewCoffee(name, reference, price, disponibility, description, country_id, characteristic_id);
      
      if (saveSuccess.code !== 1){
        res.render("pages/coffeeConfirmation", {
          name:name, 
          message: `L'enregistrement du nouveau café: ${name} a été annulé car 
          l'erreur suivante est apparue: <br> << ${saveSuccess.error}>> <br><br>  
          Vérifiez vos paramètres et réessayez.`
        });
        return;
      }

      console.log('NEW COFFEE SAVE SUCCESS!');

      //Rename the Coffee image Downloaded
      //Verify that the final filename is unique in the directory
      let messageErrorForImage = "";
      const allFiles = fs.readdirSync(process.env.pathCofeeImage);

      //Search the file name with the reference from the coffee
      if (!allFiles.find(fileName => fileName.includes(reference)) ) {
        
        //Multer has accept the file (seel Filter function critere from the router.js)
        //Save the image with the good name reference
        if (req.file) {

          const pathFromImage = req.file.path;            //Path and name
          const originalFileName = req.file.originalname; //Name from the file BEFORE download, before the autoRename FROM multer
          const fileDestination = req.file.destination;
          
          //recover the original file extension
          let extension = originalFileName.split(".");
          
          if (extension.length > 1) { //The file has a extension (For exemple .png)
            extension = "." + extension[1];
          }
          else {    //If not, we give a extension, but not the good...
            messageErrorForImage += "<br>No extension detected in the Coffee Image. We give .unknown!";
            console.log(messageErrorForImage);
            extension = ".unknown";
          }
          
          //Rename the Coffee image with the Final Name and The extension
          fs.renameSync(pathFromImage, fileDestination + "/" + reference + extension);
        }

        else {
          messageErrorForImage += `<br>Le téléchargement de l'image a été refusé (Vérifiez qu'il s'agissait bien d'une image et qu'elle était inférieure à 1 MO).
             Une image par défaut sera attribué.`;
          console.log(messageErrorForImage);
        }
      }  
      else {
        messageErrorForImage += "<br>Une image de café ayant cette référence existe déjà, le téléchargement de la nouvelle image a été annulée!";
        console.log(messageErrorForImage);
      }
            
      res.render("pages/coffeeConfirmation", {
        message: `Le café: << ${name} >> de référence: << ${reference} >> a été enregistré avec succès! <br> ${messageErrorForImage}`
      });
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },
};  

export default adminController;