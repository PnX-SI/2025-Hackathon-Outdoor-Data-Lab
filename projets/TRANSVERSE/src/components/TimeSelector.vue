<template>
  <div class="date-range">
    <label for="begin-date">Begin date:</label>
    <input id="begin-date" type="date" v-model="beginDate" @change="emitRange" />

    <label for="end-date" style="margin-left:12px">End date:</label>
    <input id="end-date" type="date" v-model="endDate" @change="emitRange" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const beginDate = ref('')
const endDate = ref('')
const emit = defineEmits(['date-range-changed'])

const emitRange = () => {
  // Emit empty string as null to parent if not set
  emit('date-range-changed', {
    beginDate: beginDate.value || null,
    endDate: endDate.value || null
  })
}
</script>

<style scoped>
.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: white;
}

input[type="date"] {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  min-width: 160px;
}
</style>
