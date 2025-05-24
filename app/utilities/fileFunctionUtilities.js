import fs from 'fs'; //For manipulate Cofee image

const fileUtilities = {
  
  //Search one coffee File
  searchOneFileCoffeeName(oneCoffee) {
       
    let searchName = oneCoffee.reference;
    let nameFound = "";
    
    //Read all repertory
    const allFiles = fs.readdirSync(process.env.pathCofeeImage);
    
    //Search the file name with the reference from the coffee
    nameFound = allFiles.find(fileName => fileName.includes(searchName));

    //When no name was found, we give the name from the not found Image
    if (!nameFound) nameFound = "noCoffeeImage.png";
    
    oneCoffee["image"] = nameFound;
    return oneCoffee;
  },

  //Search multiple coffee File
  searchAllFileCoffeeName(coffees) {
    for (let oneCoffee of coffees){
      oneCoffee = fileUtilities.searchOneFileCoffeeName(oneCoffee);
    }

    return coffees;
  }

};

export default fileUtilities;