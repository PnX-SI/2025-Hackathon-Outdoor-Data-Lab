var map;
const control = L.control.layers(null, null, {
  collapsed: false,
});
window.addEventListener(
  "map:init",
  function (e) {
    var detail = e.detail;
    map = detail.map;
    const allOverlaysPath = [
      {
        path: "static/data/treks.geojson",
        name: "Itineraire",
        style: {
          color: "green",
          weight: 2,
          opacity: 0.5,
        },
      },
    ];

    allOverlaysPath.forEach((elem) => {
      get_data(elem);
    });
  },
  false
);

function get_data(elem) {
  fetch(elem.path)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let overlay = L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
          }
        },
        style: elem.style,
      });
      control.addOverlay(overlay, elem.name);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  control.addTo(map);
}
