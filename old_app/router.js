import { Router } from 'express';

// on importe nos controllers
import mainController from './controllers/mainController.js';
import adminController from './controllers/adminController.js';

//For upload Image
import multer from 'multer';


//For upload Image
const upload = multer({ 
  dest: process.env.pathCofeeImage,
  
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); //We accept the file

    } else {
      //cb(new Error('La fichier a été rejeté car il n\'est pas de type image!'), false);
      cb(null, false);
    }
  }
}); //Work but rename the file to make it unique

const router = Router();

// Page d'accueil
router.get('/', mainController.homePage);
router.get('/catalogue', mainController.cataloguePage);
router.get('/product/:id', mainController.produitPage);
router.get('/localisation', mainController.localisationPage); //Page with World Card of all our coffees
router.get('/GPSCoffeesCoordonates', mainController.gpsCoordonatesJson); //send JSON with all coordonates
router.get('/coffeeByLocation/:countryId', mainController.listCoffeeByLocalisationPage); 
router.get('/contact', mainController.contactPage); 
router.post('/saveContact', mainController.saveContactPage); 

router.get('/newCoffee', adminController.newCoffeePage); 
router.post('/newCoffee',  upload.single('filePhotoCoffee'), adminController.newCoffeeSave); 




// on exporte le router 
export default router;