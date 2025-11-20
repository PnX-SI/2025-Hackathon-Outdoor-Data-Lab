<template>
  <div id="attributes-panel">
    <h2>Attributes</h2>
    <div v-if="!attributes">
      <div id="zoom-info" class="zoom-info" :class="{ 'zoom-info-hidden': zoomLevel < 5 }">
        <template v-if="zoomLevel < 5">
          Zoom in to see features
        </template>
        <template v-else>
          Showing features for selected month at zoom {{ zoomLevel.toFixed(1) }}
        </template>
      </div>
      <div id="attributes-list">
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p>Zoom in and click on map features to see their attributes</p>
        </div>
      </div>
    </div>
    <div v-else id="attributes-list">
      <button @click="handleClearAttributes" class="clear-btn">×</button>
      <div
        v-for="(value, key) in attributes"
        :key="key"
        class="attribute-item"
      >
        <div class="label">{{ key }}</div>
        <div class="value">
          <template v-if="key === 'attributes'">
            <div class="attributes-sections">
              <div v-if="filteredSensitivityAreas && filteredSensitivityAreas.length > 0" class="attributes-section">
                <h4>Sensitivity Areas</h4>
                <div
                  v-for="(area, index) in filteredSensitivityAreas"
                  :key="'sensitivity-' + index"
                  class="area-item sensitivity-area"
                >
                  <div class="area-header">
                    <strong>{{ area.name }}</strong>
                    <span class="area-type">{{ area.type }}</span>
                  </div>
                  <div class="area-description">{{ area.description }}</div>
                  <div class="area-period">Period: {{ formatPeriod(area.period) }}</div>
                  <button
                    @click="handleShowSensitivityArea(JSON.stringify(area.coordinates))"
                    class="show-area-btn small"
                  >
                    Show on Map
                  </button>
                </div>
              </div>

              <div v-if="filteredRegulatedAreas && filteredRegulatedAreas.length > 0" class="attributes-section">
                <h4>Regulated Areas</h4>
                <div
                  v-for="(area, index) in filteredRegulatedAreas"
                  :key="'regulated-' + index"
                  class="area-item regulated-area"
                >
                  <div class="area-header">
                    <strong>{{ area.name }}</strong>
                    <span class="area-type">{{ area.type }}</span>
                  </div>
                  <div class="area-description">{{ area.description }}</div>
                  <button
                    @click="handleShowRegulatedArea(JSON.stringify(area.coordinates))"
                    class="show-area-btn small"
                  >
                    Show on Map
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            {{ value }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, inject } from 'vue'

const props = defineProps({
  attributes: {
    type: Object,
    default: null
  },
  zoomLevel: {
    type: Number,
    default: 6
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

const emit = defineEmits(['clear-attributes', 'show-sensitivity-area', 'show-regulated-area'])

// Computed properties
const parsedAttributes = computed(() => {
  if (props.attributes && props.attributes.attributes) {
    try {
      return JSON.parse(props.attributes.attributes)
    } catch (e) {
      console.error('Error parsing attributes:', e)
      return {}
    }
  }
  return {}
})

const toDate = (iso) => {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d)) return null
  return d
}

const periodToDateRange = (periodArray, year) => {
  if (!periodArray || periodArray.length < 2) return null
  const [start, end] = periodArray
  const startDate = new Date(year, (start[1] - 1), start[0])
  const endDate = new Date(year, (end[1] - 1), end[0])
  return { startDate, endDate }
}

const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return aStart <= bEnd && bStart <= aEnd
}

const areaMatchesRange = (area, beginIso, endIso) => {
  if (!beginIso && !endIso) return true
  const begin = toDate(beginIso)
  const end = toDate(endIso)
  if (!area.period) return true
  const nowYear = (new Date()).getFullYear()
  const pr = periodToDateRange(area.period, nowYear)
  if (!pr) return true
  const areaStart = pr.startDate
  const areaEnd = pr.endDate
  const filterStart = begin || new Date(nowYear, 0, 1)
  const filterEnd = end || new Date(nowYear, 11, 31)
  return rangesOverlap(areaStart, areaEnd, filterStart, filterEnd)
}

const filteredSensitivityAreas = computed(() => {
  const list = (parsedAttributes.value.sensitivityAreas || [])
  return list.filter(a => areaMatchesRange(a, props.beginDate, props.endDate))
})

const filteredRegulatedAreas = computed(() => {
  const list = (parsedAttributes.value.regulatedAreas || [])
  return list.filter(a => areaMatchesRange(a, props.beginDate, props.endDate))
})

// Methods
const handleClearAttributes = () => {
  emit('clear-attributes')
}

const handleShowSensitivityArea = (coordinatesStr) => {
  emit('show-sensitivity-area', coordinatesStr)
}

const handleShowRegulatedArea = (coordinatesStr) => {
  emit('show-regulated-area', coordinatesStr)
}

const formatPeriod = (periodArray) => {
  if (!periodArray || periodArray.length === 0) return 'Not specified'

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return periodArray.map(([day, month]) => {
    return `${day}/${monthNames[month - 1]}`
  }).join(' - ')
}
</script>

<style scoped>
.show-area-btn.small {
  padding: 4px 8px;
  font-size: 12px;
}

.attributes-sections {
  margin-top: 10px;
}

.attributes-section {
  margin-bottom: 15px;
}

.attributes-section h4 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.area-item {
  background: #f8f9fa;
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.sensitivity-area {
  border-left: 3px solid #e74c3c;
}

.regulated-area {
  border-left: 3px solid #f39c12;
}

.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.area-header strong {
  color: #2c3e50;
  font-size: 13px;
}

.area-type {
  font-size: 10px;
  color: #6c757d;
  text-transform: uppercase;
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
}

.area-description {
  font-size: 12px;
  color: #555;
  margin-bottom: 4px;
  font-style: italic;
}

.area-period {
  font-size: 11px;
  color: #6c757d;
  margin-bottom: 6px;
}

.attribute-item {
  background: white;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  border-left: 4px solid #3498db;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.attribute-item .label {
  font-weight: 600;
  color: #555;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.attribute-item .value {
  color: #2c3e50;
  font-size: 14px;
}

.clear-btn {
  float: right;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  margin-bottom: 10px;
  padding: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background: #e9ecef;
}

.show-area-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 4px;
}

.show-area-btn:hover {
  background: #2980b9;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #95a5a6;
  clear: both;
}

.empty-state svg {
  margin-bottom: 16px;
}

.empty-state p {
  margin-top: 10px;
  font-size: 14px;
}

.zoom-info {
  background: #27ae60;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 15px;
  text-align: center;
}

.zoom-info.zoom-info-hidden {
  background: #e74c3c;
}
</style>
