
Nom : à venir en fin de session

Fiche : https://cloud.ecrins-parcnational.fr/index.php/s/ATkgQmctWQgJ4rk?dir=/Donn%C3%A9es%20cas%20d%27application&editing=false&openfile=true

# Le concept :

Démarche de R&D avec une logique la plus transversale possible en plusieurs étapes :

1. Dashboard pour les gestionnaires et plateformes
   1. Variables : 
      1. Variabilité temporelle (saisons, par mois…)
   2. Géométries d’étude : 

      Avec un buffer pondéré sur la distance au sentier.
      1. Chemins, itinéraires (avec buffer paramétrable)
      2. Sites de pratique outdoor
   3. Types de données : 
      1. Fréquentation : 
         1. Visualisation de flux de fréquentation (données Outdoorvision, écocompteurs) 
         2. Prédiction de l’affluence (flux passé x prévision météo x calendrier vacances et fériés)
      2. Biodiversité :
         1. Espèces (// BAM)
         2. Habitats
         3. Statuts, Listes rouges
         4. Zones de sensibilité de biodiversité (// Biodiv’Sports)
      3. Réglementation  :
         1. Périmètre et réglementation de l’espace naturel protégé (Parc national, Natura 2000, Réserve naturelle, APPB, …) ⟶ en fonction des arrêtés, les règlements peuvent être différents selon les sites
         2. Réglementation pêche
         3. Arrêtés communaux, etc.
      4. Information autres usages / signalements
         1. Fermeture des itinéraires (dégâts sentiers/travaux…)
         2. Zones d’alpage, présence de chiens de protection des troupeaux
         3. Signalements de désordres (// Suricate)
         4. Chasse (// https://chasse-croise.net/, mais pas d’API apparemment, // https://www.chasseinfo.fr/)
      5. Météo et Climat
         1. MeteoNet, un dataset ouvert pour faciliter la prise en main des données de Météo France (stations, modèles, radars…) - https://meteonet.umr-cnrm.fr/
         2. Portail des API de Météo France (prévisions, vigilance…) : https://portail-api.meteofrance.fr/web/fr/
         3. API des modèles de prévision météorologique AROME et ARPEGE : https://portail-api.meteofrance.fr/web/fr/liste-api/categorie/Pr%C3%A9vision 
         4. Jeux de données de référence sur le changement climatique : https://meteo.data.gouv.fr/datasets?topic=6571f2db0273fc306408f265
         5. Données des bulletins de Vigilance Météo France : https://www.data.gouv.fr/datasets/vigilance-meteorologique-en-metropole/ 
         6. Données d’un modèle nivologique simulant le manteau neigeux sur les massifs montagneux : https://www.data.gouv.fr/datasets/donnees-de-modele-de-simulation-nivologique/
         7. Vigicrues
      6. Données globales : 
         1. Occupation du sol à grande échelle : https://geoservices.ign.fr/ocsge
         2. Occupation du sol CORINE LAND COVER : https://www.data.gouv.fr/datasets/corine-land-cover-occupation-des-sols-en-france/
            1. Utiliser CLC ou OCS GE + MNT pour récupérer les zones de bivouac potentielle + capacité
         3. BD Topo IGN (Infrastructures, réseaux…)
         4. Données OpenStreetMap
         5. Météo et CC : Météo France, scénarios GIEC…
         6. IGN BD ORTHO, BD Forêt, ADMIN

      | Données                                                        |      P? | Source                                                                                                                                                                       | Objectif                                                              | Temporalité                                 |
      |----------------------------------------------------------------|--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|---------------------------------------------|
      | Itinéraires                                                    | 1 - OSM | OSM, Geotrek, données internes des départements                                                                                                                              | Géométries d’études                                                   | Saisonnière (randonnée, ski de alpinisme…)  |
      | Sites de pratique outdoor                                      |         | OSM, Geotrek, données internes des départements                                                                                                                              | Géométries d’études                                                   | Saisonnière (exemple: ski/raquette)         |
      | Flux de fréquentation                                          |         | Outdoorvision, écocompteurs                                                                                                                                                  | Arbitrer sur la question de concentration ou dilution des pratiquants | Journalière/Horaire                         |
      | Prédiction de l’affluence                                      |         | flux passé x prévision météo x calendrier vacances et fériés                                                                                                                 | Arbitrer sur la question de concentration ou dilution des pratiquants | Journalière/Horaire                         |
      | Espèces                                                        |       1 | https://api.gbif.org/v1/species/                                                                                                                                             | Affiner l’affichage                                                   |                                             |
      | Habitats                                                       |         |                                                                                                                                                                              |                                                                       |                                             |
      | Statuts, Listes rouges                                         |         |                                                                                                                                                                              |                                                                       |                                             |
      | Zones de sensibilité de biodiversité                           |         | Biodiv’Sports                                                                                                                                                                |                                                                       | Saisonnière                                 |
      | Périmètre de l’espace naturel protégé                          |         |                                                                                                                                                                              |                                                                       |                                             |
      | Réglementation de l’espace naturel protégé                     |         |                                                                                                                                                                              |                                                                       | Saisonnière                                 |
      | Réglementation pêche                                           |         |                                                                                                                                                                              |                                                                       | Saisonnière                                 |
      | Arrêtés communaux                                              |         |                                                                                                                                                                              |                                                                       |                                             |
      | Fermeture des itinéraires                                      |         | Locale ?                                                                                                                                                                     |                                                                       | Saisonnière ?                               |
      | Zones d’alpage, présence de chiens de protection des troupeaux |         | map patou sur AURA                                                                                                                                                           |                                                                       |                                             |
      | Signalements de désordres                                      |         | Suricate<br />https://sentinelles-preprod.sportsdenature.fr/rest/suricate-preprod/wsstandard/ (préprod)<br />https://sentinelles.sportsdenature.fr/rest/suricate/wsstandard/ |                                                                       |                                             |
      | Météo                                                          |         |                                                                                                                                                                              |                                                                       | Quotidienne voire horaire                   |
      | Zones de chasse                                                |         |                                                                                                                                                                              |                                                                       |                                             |
      | Calendrier scolaire                                            |         | https://data.education.fr/api/explore/v2.2                                                                                                                                   |                                                                       | Annuelle                                    |
      |                                                                |         |                                                                                                                                                                              |                                                                       |                                             |
      |                                                                |         |                                                                                                                                                                              |                                                                       |                                             |
      |                                                                |         |                                                                                                                                                                              |                                                                       |                                             |
      |                                                                |         |                                                                                                                                                                              |                                                                       |                                             |
      |                                                                |         |                                                                                                                                                                              |                                                                       |                                             |

      Filtres géographiques (communes, EPCI, Parc, département ?)
      1. Widget existants
      2. Localisation des refuges, des zones de bivouac …
      3. Infrastructures
2. Élaborer un modèle de scoring avec une pondération adaptable en fonction du contexte pour le grand public
   1. Le scoring est éditable par chaque gestionnaire de la biodiversité
   2. Présent sur chaque thématique avec une possibilité d’éditer la pondération de la thématique en entier ou même des variable unitaires
3. Widget grand public dérivé du dashboard
4. API pour publier les données dans les plateformes pour ne pas passer que par le widget

Le hackathon concerne la première étape.

# Publics : 

Les gestionnaires d’espaces naturels, les gestionnaires publics d’itinéraires

Les prescripteurs d'activités et randonnée pour qu'ils aient conscience des contraintes et enjeux de gestion de la biodiversité et des flux (OT, Visorando, Decathlon, Outdooractive, etc.). 

# Quoi ?

Widget ? 

Agréger et faire remonter différents types d'objets ? 

En préparation de valorisation : 

- D'itinéraires ?
- De sorties par le public ?

Les sujets potentiels : 

- Affluence
- Risques
- Fermeture / ouverture sentiers
- Réglementation
- Biodiversité
- Zones de sensibilité / Biodiv'Sports

Widgets existants : 

- BAM
- Biodiv'Sports
- Geotrek

Widget : choisir les paramètres génériques dès le départ et qui pourrait concerner plusieurs types : géométrie/quoi, zone, période de l'année,

Enjeux : 

- Rendre lisible les types de données aux gestionnaires
- Plateformes utilisateurs sans les noyer d'informations peu lisibles

| é |  |  |
|---|--|--|
|   |  |  |
|   |  |  |

# Maquette

Interface composée de sections suivantes :

- Canevas cartographique
- Tableau de détail des éléments en interaction avec la géométrie d’étude
- Curseur de temporalité

Le canevas cartographique permet d’afficher la géométrie d’étude (itinéraire, périmètre d’étude dessiné, etc.)

Le détail des éléments permet d’afficher les éléments qui ont un impact.  
Chaque ligne représente la thématique en question et peut être affichée sur le canevas (soit par survol, soit en cochant une cas)  
C’est une porte d’entrée pour expliquer le score d’impact qui est traité par ailleurs au travers d’un travail de pondération à faire par la structure gestionnaire.

Le curseur temporel agit comme filtre sur les données thématiques et doit permettre de rafraîchir la liste des objets qui sont concernés (ou non) par la valeur du curseur temporel.

# Liens : 

- Outils similaires : 
  - https://gbif.github.io/gbif-api/apidocs/org/gbif/api/vocabulary/ThreatStatus.html#ENDANGERED
    - BAM : https://pnx-si.github.io/BAM-widget/docs/#/
    - BOB : https://www.patrinat.fr/fr/la-boite-outils-biodiversite-bob-7293