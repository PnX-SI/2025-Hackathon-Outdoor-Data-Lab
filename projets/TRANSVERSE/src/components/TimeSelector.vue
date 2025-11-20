<template>
  <div class="date-range">
    <div class="date-select-group">
      <label>Début:</label>
      <select v-model="beginDay" @change="emitRange">
        <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
      </select>
      <select v-model="beginMonth" @change="emitRange">
        <option v-for="(m, idx) in months" :key="m" :value="idx+1">{{ m }}</option>
      </select>
    </div>
    <div class="date-select-group" style="margin-left:16px">
      <label>Fin:</label>
      <select v-model="endDay" @change="emitRange">
        <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
      </select>
      <select v-model="endMonth" @change="emitRange">
        <option v-for="(m, idx) in months" :key="m" :value="idx+1">{{ m }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const beginDay = ref(1)
const beginMonth = ref(1)
const endDay = ref(31)
const endMonth = ref(12)
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
const emit = defineEmits(['date-range-changed'])

const emitRange = () => {
  emit('date-range-changed', {
    beginDay: beginDay.value,
    beginMonth: beginMonth.value,
    endDay: endDay.value,
    endMonth: endMonth.value
  })
}
</script>

<style scoped>
.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-select-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: white;
}
.date-select-group select {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}
</style>
