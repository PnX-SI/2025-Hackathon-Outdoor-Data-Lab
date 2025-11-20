<template>
  <div id="map" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import maplibregl from 'maplibre-gl'
import { sampleFeatures } from '../data/sampleFeatures.js'

const props = defineProps({
  currentMonth: {
    type: Number,
    default: 1
  },
  beginDate: {
    type: String,
    default: null
  },
  endDate: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['zoom-changed', 'map-click'])


let map = null
let zoom = ref(11)

const onZoomChanged = () => {
  zoom.value = Math.round(map.getZoom() * 10) / 10
  emit('zoom-changed', zoom.value)
}

const createGeoJSON = (month) => {
  return {
    type: 'FeatureCollection',
    features: sampleFeatures.map(f => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: f.coordinates
      },
      properties: {
        id: f.id,
        name: f.name,
        type: f.type,
        description: f.description,
        attributes: JSON.stringify(f.attributes)
      }
    }))
  }
}

const showSensitivityAreas = (coordinatesArr) => {
  // coordinatesArr: array of JSON.stringify(coordinates)
  const features = coordinatesArr.map(str => {
    const coordinates = JSON.parse(str)
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      }
    }
  })
  const geojson = {
    type: 'FeatureCollection',
    features
  }
  const source = map.getSource('sensitivity-area')
  if (source) {
    source.setData(geojson)
  }
}

const clearSensitivityArea = () => {
  const source = map.getSource('sensitivity-area')
  if (source) {
    source.setData({
      type: 'FeatureCollection',
      features: []
    })
  }
}

watch(() => props.currentMonth, () => {
  if (map) {
    const source = map.getSource('features')
    if (source) {
      source.setData(createGeoJSON(props.currentMonth))
    }
    clearSensitivityArea()
  }
})

onMounted(() => {
  map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    },
    center: [ 6.859542070268517, 45.586392639320337 ],
    zoom: zoom.value
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('load', () => {
    // Add features source
    map.addSource('features', {
      type: 'geojson',
      data: createGeoJSON(props.currentMonth)
    })

      // Note: sensitivity/regulation areas are not added automatically.
      // They are shown only when the user clicks "Show on Map" in the Attributes panel.

    // Add sensitivity area source
    map.addSource('sensitivity-area', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    // Add layers
    map.addLayer({
      id: 'sensitivity-area-fill',
      type: 'fill',
      source: 'sensitivity-area',
      paint: {
        'fill-color': '#ff6b6b',
        'fill-opacity': 0.3
      }
    })

    map.addLayer({
      id: 'sensitivity-area-outline',
      type: 'line',
      source: 'sensitivity-area',
      paint: {
        'line-color': '#ff0000',
        'line-width': 2
      }
    })

    map.addLayer({
      id: 'features-layer',
      type: 'line',
      source: 'features',
      paint: {
        'line-color': '#3498db',
        'line-width': 4
      }
    })

    console.log('Layers added, verifying...')
    console.log('Features layer exists:', map.getLayer('features-layer'))
    console.log('Features source exists:', map.getSource('features'))

    // Click event
    map.on('click', 'features-layer', (e) => {
      if (e.features.length > 0) {
        emit('map-click', e.features[0].properties)
      }
    })

    // Change cursor on hover
    map.on('mouseenter', 'features-layer', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'features-layer', () => {
      map.getCanvas().style.cursor = ''
    })

    // Zoom event
    map.on('zoom', onZoomChanged)

    // Set initial zoom
    onZoomChanged()
  })
})

// No automatic update of area layers — areas are displayed only via explicit "Show on Map" actions

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

defineExpose({
  showSensitivityAreas,
  clearSensitivityArea
})
</script>

<style scoped>
.map-container {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
