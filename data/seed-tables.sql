BEGIN; -- Start transaction

TRUNCATE coffee, characteristic, country, contact RESTART IDENTITY;

INSERT INTO country(name, latitude, longitude) VALUES 
('Éthiopie', 9.148086, 40.493059),
('Italie', 41.873988, 12.564167),
('Colombie', 4.577316, -74.298973),
('Brésil', -22.97, -43.18),
('Guatemala', 15.776261,  -90.229744),
('Kenya', -4.07, 39.68),
('Indonésie', -2.518722, 118.015568),
('Costa Rica', 9.624897, -84.253307),
('Vietnam', 16.812913, 107.108177),
('Tanzanie', -6.16, 39.16),
('Jamaïque', 18.115265, -77.27348),
('Rwanda', -1.94708, 29.876376),
('Panama', 8.41771,  -80.112777),
('Pérou', -9.181352, -75.002365),
('Hawaï', 21.27, -157.82),
('Nicaragua', 12.866726, -85.214298);

INSERT INTO characteristic(	name) VALUES 
('Corsé'),
('Acide'),
('Fruité'),
('Doux'),
('Épicé'),
('Chocolaté');

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Espresso',
'Café fort et concentré préparé en faisant passer de l''eau chaude à travers du café finement moulu.',
'100955890',
(SELECT id FROM "country" WHERE "name" = 'Italie'),
2099,
(SELECT id FROM "characteristic" WHERE "name" = 'Corsé'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Columbian',
'Café moyennement corsé avec une acidité vive et une saveur riche.',
'100955894',
(SELECT id FROM "country" WHERE "name" = 'Colombie'),
1875,
(SELECT id FROM "characteristic" WHERE "name" = 'Acide'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Ethiopian Yirgacheffe',
'Réputé pour son arôme floral, son acidité vive et ses notes de saveur citronnée.',
'105589090',
(SELECT id FROM "country" WHERE "name" = 'Éthiopie'),
2250,
(SELECT id FROM "characteristic" WHERE "name" = 'Fruité'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Brazilian Santos',
'Café doux et lisse avec un profil de saveur de noisette.',
'134009550',
(SELECT id FROM "country" WHERE "name" = 'Brésil'),
1780,
(SELECT id FROM "characteristic" WHERE "name" = 'Doux'),
true
);


INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Guatemalan Antigua',
'Café corsé avec des nuances chocolatées et une pointe d''épice.',
'256505890',
(SELECT id FROM "country" WHERE "name" = 'Guatemala'),
2125,
(SELECT id FROM "characteristic" WHERE "name" = 'Corsé'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Kenyan AA',
'Café complexe connu pour son acidité rappelant le vin et ses saveurs fruitées.',
'295432730',
(SELECT id FROM "country" WHERE "name" = 'Kenya'),
2370,
(SELECT id FROM "characteristic" WHERE "name" = 'Acide'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Sumatra Mandheling',
'Café profond et terreux avec un corps lourd et une faible acidité.',
'302932754',
(SELECT id FROM "country" WHERE "name" = 'Indonésie'),
1995,
(SELECT id FROM "characteristic" WHERE "name" = 'Corsé'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Costa Rican Tarrazu',
'Café vif et net avec une finition propre et une acidité vive.',
'327302954',
(SELECT id FROM "country" WHERE "name" = 'Costa Rica'),
2450,
(SELECT id FROM "characteristic" WHERE "name" = 'Acide'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Vietnamese Robusta',
'Café audacieux et fort avec une saveur robuste distinctive.',
'549549090',
(SELECT id FROM "country" WHERE "name" = 'Vietnam'),
1675,
(SELECT id FROM "characteristic" WHERE "name" = 'Épicé'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Tanzanian Peaberry',
'Acidité vive avec un profil de saveur rappelant le vin et un corps moyen.',
'582954954',
(SELECT id FROM "country" WHERE "name" = 'Tanzanie'),
2680,
(SELECT id FROM "characteristic" WHERE "name" = 'Fruité'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Jamaican Blue Mountain',
'Reconnu pour sa saveur douce, son acidité vive et son absence d''amertume.',
'589100954',
(SELECT id FROM "country" WHERE "name" = 'Jamaïque'),
3925,
(SELECT id FROM "characteristic" WHERE "name" = 'Doux'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Rwandan Bourbon',
'Café avec des notes florales prononcées, une acidité vive et un corps moyen.',
'650753915',
(SELECT id FROM "country" WHERE "name" = 'Rwanda'),
2190,
(SELECT id FROM "characteristic" WHERE "name" = 'Fruité'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Panamanian Geisha',
'Café rare aux arômes floraux complexes, une acidité brillante et un profil de saveur distinctif.',
'795501340',
(SELECT id FROM "country" WHERE "name" = 'Panama'),
4200,
(SELECT id FROM "characteristic" WHERE "name" = 'Fruité'),
true
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Peruvian Arabica',
'Café équilibré avec des notes de chocolat, une acidité modérée et un corps velouté.',
'954589100',
(SELECT id FROM "country" WHERE "name" = 'Pérou'),
1940,
(SELECT id FROM "characteristic" WHERE "name" = 'Chocolaté'),
false
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Hawaiian Kona',
'Café rare au goût riche, une acidité douce et des nuances subtiles.',
'958090105',
(SELECT id FROM "country" WHERE "name" = 'Hawaï'),
5575,
(SELECT id FROM "characteristic" WHERE "name" = 'Doux'),
false
);

INSERT INTO coffee("name", "description", "reference", "country_id", "price", "characteristic_id", "disponibility") VALUES 
('Nicaraguan Maragogipe',
'Café avec des notes de fruits, une acidité vive et un corps plein.',
'691550753',
(SELECT id FROM "country" WHERE "name" = 'Nicaragua'),
2860,
(SELECT id FROM "characteristic" WHERE "name" = 'Fruité'),
false
);

COMMIT; --End transaction


