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
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
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

const pad = (n) => n.toString().padStart(2, '0')
const currentYear = new Date().getFullYear()
const onDateRangeChanged = ({ beginDay, beginMonth, endDay, endMonth }) => {
  // Convert to ISO date strings (YYYY-MM-DD)
  beginDate.value = `${currentYear}-${pad(beginMonth)}-${pad(beginDay)}`
  endDate.value = `${currentYear}-${pad(endMonth)}-${pad(endDay)}`
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

const displayedSensitivityAreas = ref(new Set())
const displayedRegulatedAreas = ref(new Set())
const displayedSensitivityMap = ref(new Map()) // str -> area obj
const displayedRegulatedMap = ref(new Map())

const areaPeriodOverlapsFilter = (area, filterStartIso, filterEndIso) => {
  const nowYear = new Date().getFullYear()
  const [start, end] = area.period || []
  if (!start || !end) return true
  const startDate = new Date(nowYear, (start[1] - 1), start[0])
  const endDate = new Date(nowYear, (end[1] - 1), end[0])
  const filterStart = filterStartIso ? new Date(filterStartIso) : new Date(nowYear, 0, 1)
  const filterEnd = filterEndIso ? new Date(filterEndIso) : new Date(nowYear, 11, 31)
  return startDate <= filterEnd && filterStart <= endDate
}

const showSensitivityArea = (areaOrStr) => {
  // Accept either area object (from AttributesPanel) or coordinates string
  let area = null
  if (typeof areaOrStr === 'string') {
    // no period info available
    const coords = JSON.parse(areaOrStr)
    area = { coordinates: coords }
  } else {
    area = areaOrStr
  }
  const str = JSON.stringify(area.coordinates)
  if (displayedSensitivityAreas.value.has(str)) {
    displayedSensitivityAreas.value.delete(str)
    displayedSensitivityMap.value.delete(str)
  } else {
    displayedSensitivityAreas.value.add(str)
    displayedSensitivityMap.value.set(str, area)
  }
  updateDisplayedAreas()
}

const showRegulatedArea = (areaOrStr) => {
  let area = null
  if (typeof areaOrStr === 'string') {
    const coords = JSON.parse(areaOrStr)
    area = { coordinates: coords }
  } else {
    area = areaOrStr
  }
  const str = JSON.stringify(area.coordinates)
  if (displayedRegulatedAreas.value.has(str)) {
    displayedRegulatedAreas.value.delete(str)
    displayedRegulatedMap.value.delete(str)
  } else {
    displayedRegulatedAreas.value.add(str)
    displayedRegulatedMap.value.set(str, area)
  }
  updateDisplayedAreas()
}

const updateDisplayedAreas = () => {
  if (mapComponent.value) {
    const allAreas = [
      ...Array.from(displayedSensitivityAreas.value),
      ...Array.from(displayedRegulatedAreas.value)
    ]
    mapComponent.value.showSensitivityAreas(allAreas)
  }
}

// Remove hidden areas when date filter changes (attributes disappear)

const filteredSensitivityCoordinates = computed(() => {
  if (!selectedAttributes.value || !selectedAttributes.value.attributes) return new Set()
  try {
    const attrs = JSON.parse(selectedAttributes.value.attributes)
    if (!attrs.sensitivityAreas) return new Set()
    return new Set(attrs.sensitivityAreas.filter(area => {
      // Use same filtering as AttributesPanel
      const nowYear = new Date().getFullYear()
      const [start, end] = area.period || []
      if (!start || !end) return true
      const startDate = new Date(nowYear, (start[1] - 1), start[0])
      const endDate = new Date(nowYear, (end[1] - 1), end[0])
      const filterStart = beginDate.value ? new Date(beginDate.value) : new Date(nowYear, 0, 1)
      const filterEnd = endDate.value ? new Date(endDate.value) : new Date(nowYear, 11, 31)
      return startDate <= filterEnd && filterStart <= endDate
    }).map(area => JSON.stringify(area.coordinates)))
  } catch { return new Set() }
})

const filteredRegulatedCoordinates = computed(() => {
  if (!selectedAttributes.value || !selectedAttributes.value.attributes) return new Set()
  try {
    const attrs = JSON.parse(selectedAttributes.value.attributes)
    if (!attrs.regulatedAreas) return new Set()
    return new Set(attrs.regulatedAreas.filter(area => {
      // Use same filtering as AttributesPanel
      const nowYear = new Date().getFullYear()
      const [start, end] = area.period || []
      if (!start || !end) return true
      const startDate = new Date(nowYear, (start[1] - 1), start[0])
      const endDate = new Date(nowYear, (end[1] - 1), end[0])
      const filterStart = beginDate.value ? new Date(beginDate.value) : new Date(nowYear, 0, 1)
      const filterEnd = endDate.value ? new Date(endDate.value) : new Date(nowYear, 11, 31)
      return startDate <= filterEnd && filterStart <= endDate
    }).map(area => JSON.stringify(area.coordinates)))
  } catch { return new Set() }
})

watch([beginDate, endDate], () => {
  // Remove any displayed areas whose period no longer overlaps filter
  const fStart = beginDate.value
  const fEnd = endDate.value
  displayedSensitivityMap.value.forEach((area, str) => {
    if (!areaPeriodOverlapsFilter(area, fStart, fEnd)) {
      displayedSensitivityMap.value.delete(str)
      displayedSensitivityAreas.value.delete(str)
    }
  })
  displayedRegulatedMap.value.forEach((area, str) => {
    if (!areaPeriodOverlapsFilter(area, fStart, fEnd)) {
      displayedRegulatedMap.value.delete(str)
      displayedRegulatedAreas.value.delete(str)
    }
  })
  updateDisplayedAreas()
})
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
