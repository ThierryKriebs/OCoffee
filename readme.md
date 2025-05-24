# OCoffee
OCoffee est un projet pédagogique dont le but est de créer une application Web pour une boutique fictive de café haut de gamme.
Ce site permet la consultation des différentes sortes de café que propose la boutique.
Il permet également aux administrateurs d'ajouter de nouveaux cafés.

## Page d'accueil:
![Presentation](/public/images/captures/1_Accueil.png)

  
  
Le site est **TEMPORAIREMENT** disponible à cette adresse: 
[Lien vers OCofee](https://ocoffee-kagt.onrender.com/)


## Technologie utilisée:
Ce site a été développé avec l'environnement Node et le framework Express. 

Il utilise les technologies suivantes:
- NodeJs avec le framework Express
- Une base de données PostgreSQL pour la gestion des cafés, des pays, des catégories de cafés et des contacts
- Le package Node Leaflet pour la gestion de la carte du monde interactive
- Le package Multer ainsi que Node fs, pour le téléchargement et la gestion des images (recherche, renommage…)
- EmailJs pour l'envoi des emails au client

## Installation:
Pour déployer cette application en local:
- Installer NodeJs
- Installer PostgreSQL
- Créer un rôle pour la future base de données, puis une base de données. Exemple avec le client psql:
```
psql -U postgres
CREATE ROLE nom_utilisateur WITH LOGIN PASSWORD 'mot de passe';
CREATE DATABASE nom_de_la_base WITH OWNER nom_utilisateur;
```
- Initialiser la base de données à l'aide de la commande suivante `npm run db:reset` (voir fichier *package.json*)
- Créer un compte utilisateur sur **emailjs.com** et lier ce compte à son compte email
- Créer un template d'email sous **emailjs.com** (suivez simplement les étapes proposées)
- Récupérer le contenu du dépôt
- Ouvrir un terminal et entrer la commande suivante : `npm install` Cela va installer les différents packages nécessaires à l'application.
- Dupliquer le fichier **.env.example** et renommer le nouveau fichier **.env**
- Editer le fichier **.env** et renseigner les différents paramètres:
```
PORT=3001

#PostgresParameter
PG_URL=postgresql://user:password@localhost/database_name

#EmailJsParameter
serviceID=       #See https://dashboard.emailjs.com/admin
templateID=      #See https://dashboard.emailjs.com/admin/templates/
publicKey=       #See https://dashboard.emailjs.com/admin/account
privateKey=      #See https://dashboard.emailjs.com/admin/account

#Muter Download Image
pathCofeeImage=public/images/coffees
```
- Enfin, démarrer le serveur web à l'aide de la commande `npm run start` si vous êtes en production, ou `npm run dev` si vous êtes en développement (voir fichier *package.json*)


## Quelques rendus:
### Page d'accueil avec les 3 derniers cafés ajoutés:
![Presentation](/public/images/captures/1_Accueil.png)

### Page catalogue:
![Presentation](/public/images/captures/2_Catalogue.png)

### Carte interactive:
![Presentation](/public/images/captures/3_carte.png)

### Formulaire d'ajout de café:
![Presentation](/public/images/captures/4_Ajouter_un_café-2.png)

### Version mobile:
![Presentation](/public/images/captures/5_Version_mobile.png)
