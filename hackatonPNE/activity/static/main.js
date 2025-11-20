var map;
var layers = {};

const layerConfigs = [
  {
    path: "static/data/aire_adhesion.geojson",
    name: "aire_adhesion",
    color: "#d8a7dfff",
    enabled: true,
    category: "Référentiels géographiques",
    isReferentiel: true
  },
  {
    path: "static/data/Zone_Coeur_PNE.geojson",
    name: "zone_coeur",
    color: "#aa11c9ff",
    enabled: true,
    category: "Référentiels géographiques",
    isReferentiel: true
  },
  {
    path: "static/data/maillage.geojson",
    name: "mailles",
    color: "#eb9e9eff",
    fillOpacity: 0.1,
    enabled: true,
    category: "Référentiels géographiques",
  },
  {
    path: "static/data/zones_humides.geojson",
    name: "Zones Humides",
    color: "#3498DB",
    enabled: false,
    category: "Biodiversité"
  },
  {
    path: "static/data/habitats.geojson",
    name: "Habitats",
    color: "#27AE60",
    enabled: false,
    category: "Biodiversité"
  },
  {
    path: "static/data/Geonature_PNE_2024.geojson",
    name: "Observations naturalistes",
    color: "#0004ffff",
    enabled: false,
    category: "Biodiversité"
  },
  // {
  //   path: "static/data/aire_aigles.geojson",
  //   name: "Aire aigles",
  //   color: "#bb4962ff",
  //   enabled: false,
  //   category: "Biodiversité"
  // },
  {
    path: "static/data/Outdoorvision_PNE_2024.geojson",
    name: "Outdoorvision",
    color: "#ffc400ff",
    enabled: false,
    category: "Fréquentation"
  },
  {
    path: "static/data/Strava_PNE_2024.geojson",
    name: "Strava",
    color: "#E74C3C",
    enabled: false,
    category: "Fréquentation"
  },
  {
    path: "static/data/Eco_Compteurs_PNE_2024.geojson",
    name: "Eco-compteurs",
    color: "#229100ff",
    enabled: false,
    category: "Fréquentation"
  },
  {
    path: "static/data/treks.geojson",
    name: "Itinéraires Geotrek",
    color: "#34ad10ff",
    enabled: false,
    category: "Fréquentation"
  }
];

window.addEventListener("map:init", function (e) {
  map = e.detail.map;

  // Grouper les couches par catégorie
  const categories = {};
  layerConfigs.forEach((config) => {
    if (!categories[config.category]) {
      categories[config.category] = [];
    }
    categories[config.category].push(config);
  });

  // Créer les sections pour chaque catégorie
  const layerList = document.getElementById('layer-list');
  let index = 0;

  for (const [category, configs] of Object.entries(categories)) {
    // Créer le titre de catégorie
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = category;
    layerList.appendChild(categoryTitle);

    // Ajouter les couches de cette catégorie
    configs.forEach((config) => {
      loadLayer(config, index);
      createLayerControl(config, index);
      index++;
    });
  }
});

function loadLayer(config, index) {
  fetch(config.path)
    .then(response => response.json())
    .then(data => {
      const layerId = 'layer-' + index;

      // Fonction pour obtenir la couleur en fonction du total_trip_count_2024
      function getColorForTripCount(tripCount) {
        if (tripCount === 0) return '#f0f0f0';  // Gris très clair pour 0
        if (tripCount < 50) return '#ffffb2';   // Jaune clair
        if (tripCount < 100) return '#fed976';  // Jaune
        if (tripCount < 200) return '#feb24c';  // Orange clair
        if (tripCount < 500) return '#fd8d3c';  // Orange
        if (tripCount < 1000) return '#fc4e2a'; // Rouge-orange
        if (tripCount < 2000) return '#e31a1c'; // Rouge
        return '#b10026';                       // Rouge foncé pour > 2000
      }

      layers[layerId] = L.geoJSON(data, {
        style: function (feature) {
          // Si c'est la couche mailles, utiliser la couleur basée sur total_trip_count_2024
          if (config.name === "mailles" && feature.properties.total_trip_count_2024 !== undefined && feature.properties.N_espece !== undefined) {
            return {
              color: '#666',
              weight: 1,
              opacity: 0.7,
              fillOpacity: 0.6,
              fillColor: getColorForTripCount(feature.properties.total_trip_count_2024 * feature.properties.N_espece)
            };
          }
          // Sinon, utiliser le style par défaut
          return {
            color: config.isReferentiel ? config.color : config.color,
            weight: config.isReferentiel ? 0 : 2,
            opacity: config.isReferentiel ? 0 : 0.7,
            fillOpacity: config.isReferentiel ? 0.3 : 0.5,
            fillColor: config.color
          };
        },
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: config.color,
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function (feature, layer) {
          if (feature.properties) {
            let popup = '<div style="max-width: 900px;">';

            // Si c'est un éco-compteur (ID 14 = Danchere), charger le CSV
            if (config.name === "Eco-compteurs" && feature.properties.ID === 14) {
              fetch('static/data/14.csv')
                .then(response => response.text())
                .then(csvData => {
                  const lines = csvData.split('\n');
                  const data = [];

                  // Parser le CSV
                  for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                      const cells = lines[i].split(',');
                      data.push({
                        date: cells[0],
                        count: parseInt(cells[2]) || 0
                      });
                    }
                  }

                  // Calculer les dimensions du graphique
                  const width = 800;
                  const height = 300;
                  const padding = 60;
                  const bottomPadding = 80;
                  const maxCount = Math.max(...data.map(d => d.count));

                  // Créer le SVG
                  popup = '<div style="max-width: 900px;">';
                  popup += '<h4 style="margin: 5px 0;">Fréquentation - Danchere</h4>';
                  popup += `<svg width="${width}" height="${height}" style="background: white;">`;

                  // Axes
                  popup += `<line x1="${padding}" y1="${height - bottomPadding}" x2="${width - 10}" y2="${height - bottomPadding}" stroke="#333" stroke-width="2"/>`;
                  popup += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - bottomPadding}" stroke="#333" stroke-width="2"/>`;

                  // Graduations Y
                  for (let i = 0; i <= 5; i++) {
                    const y = height - bottomPadding - (i * (height - bottomPadding - padding) / 5);
                    const val = Math.round((maxCount / 5) * i);
                    popup += `<text x="${padding - 5}" y="${y}" text-anchor="end" font-size="10" dy="3">${val}</text>`;
                    popup += `<line x1="${padding}" y1="${y}" x2="${padding - 5}" y2="${y}" stroke="#333"/>`;
                  }

                  // Barres et dates
                  const barWidth = (width - padding - 20) / data.length;
                  data.forEach((d, i) => {
                    const barHeight = (d.count / maxCount) * (height - bottomPadding - padding);
                    const x = padding + i * barWidth;
                    const y = height - bottomPadding - barHeight;
                    popup += `<rect x="${x}" y="${y}" width="${Math.max(barWidth - 1, 1)}" height="${barHeight}" fill="${config.color}" opacity="0.7">`;
                    popup += `<title>${d.date}: ${d.count} personnes</title>`;
                    popup += `</rect>`;

                    // Afficher une date sur 10
                    if (i % 10 === 0 || i === data.length - 1) {
                      const dateText = d.date.substring(5); // Afficher MM-DD seulement
                      popup += `<text x="${x + barWidth / 2}" y="${height - bottomPadding + 15}" text-anchor="end" font-size="9" transform="rotate(-45, ${x + barWidth / 2}, ${height - bottomPadding + 15})">${dateText}</text>`;
                    }
                  });

                  // Labels
                  popup += `<text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-size="12" font-weight="bold">Date</text>`;
                  popup += `<text x="15" y="${height / 2}" text-anchor="middle" font-size="12" font-weight="bold" transform="rotate(-90, 15, ${height / 2})">Nombre de personnes</text>`;

                  popup += '</svg>';
                  popup += `<p style="font-size: 11px; color: #666; margin: 5px 0;">Total: ${data.reduce((sum, d) => sum + d.count, 0)} personnes sur ${data.length} jours</p>`;
                  popup += '</div>';

                  layer.bindPopup(popup, { maxWidth: 900 }).openPopup();
                });
            } else {
              // Affichage normal des propriétés
              for (let key in feature.properties) {
                if (feature.properties[key] && key !== 'fid' && key !== 'gml_id') {
                  popup += `<b>${key}:</b> ${feature.properties[key]}<br>`;
                }
              }
              popup += '</div>';
              layer.bindPopup(popup);
            }
          }
        }
      });

      if (config.enabled) {
        layers[layerId].addTo(map);
      }
    })
    .catch(error => console.error('Erreur:', error));
}

function createLayerControl(config, index) {
  const layerList = document.getElementById('layer-list');
  const layerId = 'layer-' + index;

  const item = document.createElement('div');
  item.className = 'layer-item';

  // Pour les couches référentiels : afficher sans checkbox
  // if (config.isReferentiel) {
  //   item.innerHTML = `
  //     <div class="layer-color" style="background: ${config.color}"></div>
  //     <span style="color: #666;">${config.name}</span>
  //   `;
  // } else {
  // Pour les autres couches : afficher avec checkbox
  item.innerHTML = `
      <input type="checkbox" id="${layerId}" ${config.enabled ? 'checked' : ''}>
      <div class="layer-color" style="background: ${config.color}"></div>
      <label for="${layerId}">${config.name}</label>
    `;
  // }

  layerList.appendChild(item);

  // Ajouter l'event listener uniquement pour les couches non-référentiels
  document.getElementById(layerId).addEventListener('change', function () {
    if (this.checked) {
      if (layers[layerId]) layers[layerId].addTo(map);
    } else {
      if (layers[layerId]) map.removeLayer(layers[layerId]);
    }
  });
}
