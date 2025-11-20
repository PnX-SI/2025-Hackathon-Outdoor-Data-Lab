<template>
  <div id="app">
    <div id="time-selector">
      <TimeSelector @date-range-changed="onDateRangeChanged" />
      <span id="selected-info" style="margin-left: auto; font-size: 14px; display:flex; gap:12px; align-items:center;">
        <span>Begin: <strong>{{ beginDate || '—' }}</strong></span>
        <span>End: <strong>{{ endDate || '—' }}</strong></span>
        <span>Current zoom: <span id="zoom-level">{{ zoomLevel.toFixed(1) }}</span></span>
      </span>
    </div>

    <div id="content" :class="{ 'mobile-layout': isMobile }">
      <MapComponent
        ref="mapComponent"
        :current-month="currentMonth"
        :begin-date="beginDate"
        :end-date="endDate"
        @zoom-changed="onZoomChanged"
        @map-click="onMapClick"
      />
      <AttributesPanel
        :attributes="selectedAttributes"
        :begin-date="beginDate"
        :end-date="endDate"
        @clear-attributes="clearAttributes"
        @show-sensitivity-area="showSensitivityArea"
        @show-regulated-area="showRegulatedArea"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import TimeSelector from './components/TimeSelector.vue'
import MapComponent from './components/MapComponent.vue'
import AttributesPanel from './components/AttributesPanel.vue'

const currentMonth = ref(1)
const zoomLevel = ref(6.0)
const selectedAttributes = ref(null)
const beginDate = ref(null)
const endDate = ref(null)
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 768)

const mapComponent = ref()

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
  // Restore the selected feature from localStorage
  restoreSelectedFeature()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const onMonthChanged = (month) => {
  currentMonth.value = month
}

const onDateRangeChanged = ({ beginDate: b, endDate: e }) => {
  beginDate.value = b
  endDate.value = e
}
const onZoomChanged = (zoom) => {
  zoomLevel.value = zoom
}

const onMapClick = (attributes) => {
  selectedAttributes.value = attributes
  // Save to localStorage
  try {
    localStorage.setItem('map-selected-feature', JSON.stringify(attributes))
  } catch (e) {
    console.warn('Could not save selected feature to localStorage:', e)
  }
}

const clearAttributes = () => {
  selectedAttributes.value = null
  if (mapComponent.value) {
    mapComponent.value.clearSensitivityArea()
  }
  // Clear from localStorage
  try {
    localStorage.removeItem('map-selected-feature')
  } catch (e) {
    console.warn('Could not clear selected feature from localStorage:', e)
  }
}

const restoreSelectedFeature = () => {
  try {
    const savedFeature = localStorage.getItem('map-selected-feature')
    if (savedFeature) {
      selectedAttributes.value = JSON.parse(savedFeature)
    }
  } catch (e) {
    console.warn('Could not restore selected feature from localStorage:', e)
  }
}

const showSensitivityArea = (coordinatesStr) => {
  if (mapComponent.value) {
    mapComponent.value.showSensitivityArea(coordinatesStr)
  }
}

const showRegulatedArea = (coordinatesStr) => {
  // For now, use the same method as sensitivity areas (they use the same visual styling)
  if (mapComponent.value) {
    mapComponent.value.showSensitivityArea(coordinatesStr)
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

#time-selector {
  background: #2c3e50;
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

#time-selector label {
  font-weight: 600;
  font-size: 14px;
}

#time-selector select {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  min-width: 150px;
}

#content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 767px) {
  #content.mobile-layout {
    flex-direction: column;
  }

  #time-selector {
    flex-wrap: wrap;
    padding: 10px 15px;
    gap: 10px;
  }

  #time-selector select {
    min-width: 120px;
  }

  #selected-info {
    margin-left: 0 !important;
    margin-top: 10px;
    width: 100%;
    text-align: center;
  }

  #time-selector label {
    display: none;
  }

  #time-selector select {
    flex: 1;
  }
}
</style>
