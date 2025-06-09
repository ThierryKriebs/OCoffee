import fs from 'fs'; //For manipulate Cofee image

const fileUtilities = {
  
  //Search a image file from a cofee with his reference
  searchImageFromACoffeewitchAReference(reference) {
        
    //Read all repertory
    const allFiles = fs.readdirSync(process.env.pathCofeeImage);
    
    //Search the file name with the reference from the coffee
    let nameFound = allFiles.find(fileName => fileName.includes(reference));

    // console.log("File found: '" + nameFound);

    //When no name was found, we return -1
    if (!nameFound){
      console.log("The file with reference: '" +reference + "' was not found!");
      nameFound = "-1";
    } 
            
    return nameFound;
  },


  // //Search one coffee File and insert in the object oneCoffee, the img found
  // searchImageFromACoffeeObject(oneCoffee) {
       
  //   let searchName = oneCoffee.reference;
  //   let nameFound = "";
    
  //   //Read all repertory
  //   const allFiles = fs.readdirSync(process.env.pathCofeeImage);
    
  //   //Search the file name with the reference from the coffee
  //   nameFound = allFiles.find(fileName => fileName.includes(searchName));

  //   //When no name was found, we give the name from the not found Image
  //   if (!nameFound) nameFound = "noCoffeeImage.png";
    
  //   oneCoffee["image"] = nameFound;
  //   return oneCoffee;
  // },

  //Search one coffee File and insert in the object oneCoffee, the img found
  searchImageFromACoffeeObject(oneCoffee) {
       
    let searchName = oneCoffee.reference;
    let nameFound = "";
    
    nameFound = fileUtilities.searchImageFromACoffeewitchAReference(searchName);

    //When no name was found, we give the name from the not found Image
    if (nameFound === "-1") nameFound = "noCoffeeImage.png";
    
    oneCoffee["image"] = nameFound;
    return oneCoffee;
  },

  //Search multiple coffee File
  searchAllImageFromSeveralCoffeesObjects(coffees) {
    for (let oneCoffee of coffees){
      oneCoffee = fileUtilities.searchImageFromACoffeeObject(oneCoffee);
    }

    return coffees;
  },

  
  deleteOneFileCoffeeName(fileCoffeeName) {
    try {
      fs.unlinkSync(process.env.pathCofeeImage + "/" + fileCoffeeName);
      console.log(`File: ${fileCoffeeName} was delete`);
      return true;
    }
    catch(error){
      console.error('Erreur lors de la suppression du fichier :', error);
      return false;
    }    
  }
    

};

export default fileUtilities;