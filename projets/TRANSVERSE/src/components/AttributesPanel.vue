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
          <template v-if="key === 'sensitivityArea'">
            <button @click="handleShowSensitivityArea(value)" class="show-area-btn">
              Show on Map
            </button>
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
  }
})

const emit = defineEmits(['clear-attributes', 'show-sensitivity-area'])

const handleClearAttributes = () => {
  emit('clear-attributes')
}

const handleShowSensitivityArea = (coordinatesStr) => {
  emit('show-sensitivity-area', coordinatesStr)
}
</script>

<style scoped>
#attributes-panel {
  width: 300px;
  background: #f8f9fa;
  border-left: 1px solid #dee2e6;
  overflow-y: auto;
  padding: 20px;
}

/* Responsive design */
@media (max-width: 767px) {
  #attributes-panel {
    width: 100%;
    height: auto;
    max-height: 40vh;
    border-left: none;
    border-top: 1px solid #dee2e6;
    flex-shrink: 0;
  }
}

#attributes-panel h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #2c3e50;
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
