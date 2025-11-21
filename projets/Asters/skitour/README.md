Exploitation des données de Skitour
===================================

Skitour propose une API (<https://skitour.fr/api/>) permettant 1000 requêtes/jour après la simple création d’un compte.

Dans le cadre du hackathon, les données suivantes ont été récupérées (à la main avec curl, éventuellement des boucles bash sur des listes d’id extraits avec jq):

- listes des topos des massifs 21 (Beaufortain) et 25 (Mont-Blanc) (API/topos?m=XX)
- récupération de chaque topo figurant dans les listes 21 & 25 (API/topo/?t=XX)
- récupération des sorties des massifs 21 & 25 pour la saison 2024 (API/sorties?a=2024&m=21&l=1000)

Le script `aggregate.py` cré un fichier `skitour.geojson` qui a servit à l’analyse de données dans QGIS.

Quelques commandes d’exploitation des données :

- Recherche du massif du Mont-Blanc dans la liste des massifs : `cat data/massifs | jq '.[] | select(.nom | test(".*mont.*blanc.*";"i"))'`
- Sommets du Mont-Blanc: `cat data/sommets | jq '.[] | select(.massif.id=="25")'`
- Nombre de sommets dans le massif du Mont-Blanc : `cat data/sommets | jq '[.[] | select(.massif.id=="25")] | length'`
- Liste des départs dans le massif du Mont-Blanc : `cat data/departs | jq '[.[] | select(.massifs | .[].id=="25")] | length'`
- Nombre de topos Mont-Blanc : `cat 'data/topos/m=25' | jq 'length'`
- Liste des ID de topos avec GPX : `cat 'data/topos/m=25/p=1' | jq '.[] | select(.gpx != "0") | .id'` (pour récupérer le GPX, https://skitour.fr/topos/gpx/ID.gpx) (pour les sorties, idem avec sorties à la place de topos)