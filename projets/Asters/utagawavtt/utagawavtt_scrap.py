import json
import gpxpy
import gpxpy.gpx
from playwright.sync_api import sync_playwright

# URL de la page à scraper
# TODO mieux gérer la bounding box
url = "https://www.utagawavtt.com/search?d=74&city=&w=[6.63017,45.75462,6.84989,45.82716]&q=[1,2,3,4]&k=0&l=all&u=1&ak=41823&aa=25"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # True pour pas ouvrir le navigateur
    page = browser.new_page()
    page.goto(url, wait_until="networkidle")    # attend que tout le JS soit chargé

    rows = page.locator("div.searchresultsRow")
    count = rows.count()
    print(f"{count} éléments trouvés")

    # Liste pour stocker les résultats
    data_list = []

    for i in range(count):
        row = rows.nth(i)
        data_id = row.get_attribute("data-tid")
        title_element = row.locator("span.titre")  
        titre = title_element.inner_text() if title_element.count() > 0 else ""
        
        # Récupérer le href d'un bouton avec la classe utgbutton
        #link_element = row.locator(".utgButton")  # sélectionne n'importe quel élément avec cette classe
        
        # page_fiche = link_element.get_attribute("href") if link_element.count() > 0 else ""
     
        # TODO a automatiser pour récupérer les GPX.
        # Attention il semblerait que pour télécharger il faut un compte, il y a un showrestricted 
        # TODO egalement pour chercher les infos sur l itineraire, le nombre de telechargement. Ce serait top.
        
        # GPX téléchargés à la main au préalable pour les tests
        gpx_file = "utgtrack-"+data_id+".gpx"  
        with open(gpx_file, "r", encoding="utf-8") as f:
            gpx = gpxpy.parse(f)

        geometry = None  
        if gpx.tracks:
            tracks_coords = []
            for trk in gpx.tracks:
                for segment in trk.segments:
                    coords = [[p.longitude, p.latitude] for p in segment.points]
                    tracks_coords.append(coords)
            geometry = {
                "type": "MultiLineString",
                "coordinates": tracks_coords
            }
     
        # Stocker dans un dict
        props = {
            "id": data_id,
            "titre": titre,
            "activite": "VTT",
            "nb_personnes": 9999,
            "type": "Topo",
            "description": '',
            "nb_sorties": 9999,
        }
        
        
        data_list.append(
            {
                "type": "Feature",
                "properties": props,
                "geometry": geometry
            }
        )

    browser.close()

geojson = {
    "type": "FeatureCollection",
    "features": data_list
}

output_file = "uttagawat.geojson"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(geojson, f, indent=4, ensure_ascii=False)


