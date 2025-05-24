import 'dotenv/config';
import express from 'express';

import router from './app/router.js';
import { notFoundMiddleware } from "./app/middlewares/not-found.middleware.js";



// Création de l'app Express
const app = express();

// Configuration du view engine
app.set("view engine", "ejs");
app.set("views", "./app/views");

// Rendre un dossier static
app.use(express.static('public'));

//use POST requete Body Parser
app.use(express.urlencoded());

// Branche le routeur
app.use(router);

// Middleware Not found
app.use(notFoundMiddleware);

// Démarre le serveur
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});


