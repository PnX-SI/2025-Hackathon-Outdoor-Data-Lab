<template>
  <div>
    <label for="month-select">Select Month:</label>
    <select id="month-select" v-model="selectedMonth" @change="handleChange">
      <option value="1">January</option>
      <option value="2">February</option>
      <option value="3">March</option>
      <option value="4">April</option>
      <option value="5">May</option>
      <option value="6">June</option>
      <option value="7">July</option>
      <option value="8">August</option>
      <option value="9">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectedMonth = ref(1)
const emit = defineEmits(['month-changed'])

const handleChange = () => {
  emit('month-changed', parseInt(selectedMonth.value))
}
</script>

<style scoped>
label {
  font-weight: 600;
  font-size: 14px;
}

#month-select {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  min-width: 150px;
  margin-left: 15px;
}
</style>
