import fs from 'fs'; //For manipulate Cofee image
import dataMapper from '../dataBase/dataMapper.js'; 
import fileUtilities from '../utilities/fileFunctionUtilities.js';



const adminController = {

  //Page for Coffee administration (CRUD)
  async gestionCoffeesPage(req, res) {
    const coffees = await dataMapper.getAllCoffee();
    const country = await dataMapper.getAllCountry(); //for the filter
    const characteristic = await dataMapper.getAllCharacteristic(); //for the filter

    //Search photo from all coffee and include in object coffees
    for (let oneCoffee of coffees){
      oneCoffee = fileUtilities.searchImageFromACoffeeObject(oneCoffee);
    }

    res.render("pages/administrationCoffees/gestionCoffees", {coffees, country, characteristic});
  },

  //Delete one or more Coffees or or render updateCoffeeFormular
  async gestionCoffeesAction (req, res) {
        
    try {
      if (!req.body || !req.body.hiddenAction){
        console.log(`La modification ou suppression d'un café a été annulée car des paramètres 
              sont manquants. Veuillez réessayer.`);
        res.render("pages/administrationCoffees/coffeeConfirmation", {
          message: `La modification ou suppression d'un café a été annulée car des paramètres 
              sont manquants. Veuillez réessayer.`
        });
        return;
      }

      const action = req.body.hiddenAction;
      
      //generalButton => Potential several coffe must be delete
      if (action === "generalDelete") {

        if (req.body.checkboxIdCoffee){
          const allCoffeeId = req.body.checkboxIdCoffee;
          console.log("Start deleting several coffees with id: " + allCoffeeId);

          //Search the reference from all coffees for delete images
          const allCoffee = await dataMapper.getseveralCoffeesByIds(allCoffeeId); 
        
          //Delete all Coffee
          await dataMapper.deleteCoffees(allCoffeeId);
          console.log("Coffees have been removed from database!");

          //Search and delete all associated images
          console.log("Start delete the files associated");
        
          for (let indexCoffee = 0; indexCoffee<allCoffee.length; indexCoffee++) {
          //1) Search the file with the reference
            const fileCoffeeName = fileUtilities.searchImageFromACoffeewitchAReference(allCoffee[indexCoffee].reference); 
         
            //2) Delete the File
            if (fileCoffeeName !== "-1") {
              fileUtilities.deleteOneFileCoffeeName(fileCoffeeName); 
            }
          }
        }
        
        //Reload the gestionCoffees page
        res.redirect("/gestionCoffees");
      }

      //A normal delete button => Only one coffee must be delete
      else if (action === "delete") {
        
        if(req.body.hiddenSelectId){
          const idToDelete = req.body.hiddenSelectId;
          console.log("Start deleting coffee with id: " + idToDelete);
          
          //Search the reference from a coffee for delete its image
          const oneCoffee = await dataMapper.getOneCoffeeById(idToDelete); 
          
          //delete the coffees in databae
          await dataMapper.deleteCoffees(idToDelete);
          console.log(`The coffee ${oneCoffee[0].name} was delete in database`);

          //Search and delete the correspondant file
          console.log("Start delete the file associated");
                    
          //1) Search the file with the reference
          const fileCoffeeName = fileUtilities.searchImageFromACoffeewitchAReference(oneCoffee[0].reference); 
          
          //2) Delete the File
          if (fileCoffeeName !== "-1") {
            fileUtilities.deleteOneFileCoffeeName(fileCoffeeName); 
          }
        }
        
        res.redirect("/gestionCoffees");
      }

      else if (action === "add") {
        res.redirect("/newCoffee");
      }

      else if (action === "modify") {
        if(req.body.hiddenSelectId){
          const idToModify = req.body.hiddenSelectId;
          
          console.log("idToModify= " + idToModify);

          let oneCoffee = await dataMapper.getOneCoffeeById(idToModify);
          oneCoffee = oneCoffee[0];
          console.log(oneCoffee);
          const country = await dataMapper.getAllCountry();
          const characteristics = await dataMapper.getAllCharacteristic();

          res.render("pages/administrationCoffees/updateCoffee", {oneCoffee, country, characteristics });
        }
        else{
          res.redirect("/gestionCoffees");
        }
      }
    }
    catch(error)  {
      console.error(error);
      res.status(500).render('pages/500');
    }
  },

 
  async newCoffeePage(req, res) {
  
    try {
      const country = await dataMapper.getAllCountry();
      const characteristics = await dataMapper.getAllCharacteristic();
      res.render("pages/administrationCoffees/newCoffee", { country, characteristics });
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
        res.render("pages/administrationCoffees/coffeeConfirmation", {
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
        res.render("pages/administrationCoffees/coffeeConfirmation", {
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
        
        //Multer has accept the file (see Filter function critere from the router.js)
        //Save the image with the good name reference
        if (req.file) {

          const pathFromImage = req.file.path;            //Path and name
          const originalFileName = req.file.originalname; //Name from the file BEFORE download, before the autoRename FROM multer
          const fileDestination = req.file.destination;   //destination file only (without image name)
          
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
            
      res.render("pages/administrationCoffees/coffeeConfirmation", {
        message: `Le café: << ${name} >> de référence: << ${reference} >> a été enregistré avec succès! <br> ${messageErrorForImage}`
      });
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },


  async updateCoffeePage(req, res) {
  
    try {
      const country = await dataMapper.getAllCountry();
      const characteristics = await dataMapper.getAllCharacteristic();
      res.render("pages/administrationCoffees/updateCoffee", { country, characteristics });
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },

  async updateCoffeeSave(req, res) {
  
    try {

      if (!req.body.name || !req.body.reference || !req.body.country_id || !req.body.characteristic_id 
        || !req.body.description || !req.body.disponibility || !req.body.price){
        res.render("pages/administrationCoffees/coffeeConfirmation", {
          message: `L'enregistrement du nouveau café a été annulé car des paramètres 
              sont manquants. Veuillez réessayer.`
        });
        console.log ('The modification from the coffee has been cancelled because some parameters are missing');
        return;
      }
    
      const id = req.body.id;
      const name = req.body.name;
      const reference = req.body.reference;
      const price = req.body.price;
      const disponibility = req.body.disponibility;
      const description = req.body.description;
      const country_id = req.body.country_id;
      const characteristic_id = req.body.characteristic_id;
      
      //Search old reference (for rename Image)
      const oldCoffeeData = await dataMapper.getOneCoffeeById(id);
      
      const saveSuccess =await dataMapper.updateCoffee(id, name, reference, price, disponibility, description, country_id, characteristic_id);
      
      if (saveSuccess.code !== 1){
        res.render("pages/administrationCoffees/coffeeConfirmation", {
          name:name, 
          message: `L'enregistrement du nouveau café: ${name} a été annulé car 
          l'erreur suivante est apparue: <br> << ${saveSuccess.error}>> <br><br>  
          Vérifiez vos paramètres et réessayez.`
        });
        console.log (`The modification from the coffee has been cancelled because a error appear: ${saveSuccess.error}`);
        return;
      }

      console.log('UPDATE COFFEE SAVE SUCCESS!');

      let messageErrorForImage = "";
      //If a image has been download
      //Multer has accept the file (see Filter function critere from the router.js)
      //Save the image with the good name reference
      if (req.file) {
        console.log ("A image has been downloaded!");

        //Search the download image
        const pathFromImage = req.file.path;            //Path and name
        const originalFileName = req.file.originalname; //Name from the file BEFORE download, before the autoRename FROM multer
        const fileDestination = req.file.destination;   //destination file only (without image name)

        //Recover the original file extension
        let extension = originalFileName.split(".");
          
        if (extension.length > 1) { //The file has a extension (For exemple .png)
          extension = "." + extension[1];
        }
        else {    //If not, we give a extension, but not the good...
          messageErrorForImage += "<br>No extension detected in the Coffee Image. We give .unknown!";
          console.log(messageErrorForImage);
          extension = ".unknown";
        }

        console.log("extension: " + extension);

        //Search the OLD image
        console.log(oldCoffeeData[0].reference);
        const oldFileName = fileUtilities.searchImageFromACoffeewitchAReference(oldCoffeeData[0].reference); 
        console.log("oldFileName: " + oldFileName);

        //Delete the old image
        if (oldFileName !== "-1") {
          fileUtilities.deleteOneFileCoffeeName(oldFileName); 
        }

        //Rename the new image
        fs.renameSync(pathFromImage, fileDestination + "/" + reference + extension);

        console.log("The download image has been rename with success!");
      }

      else {
        console.log ("No image was been downloaded!");
      }

      //Redirect to the coffeesgestion page
      res.redirect("/gestionCoffees");
    }
    catch(error){
      console.error(error);
      res.status(500).render('pages/500');
    }
  },
};  

export default adminController;