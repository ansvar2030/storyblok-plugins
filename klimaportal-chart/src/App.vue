<script setup lang="ts">
import FieldPlugin from './components/FieldPlugin.vue'
import FieldPluginProvider from './components/FieldPluginProvider.vue'
// import resizeWatcher from '@/tools/resizeWatcher'
// import { provide, ref, onMounted } from 'vue'

// const resizeData = ref({})
// provide('resizeData', resizeData)

// onMounted(() => {
//     console.info('app mounted')
//     resizeWatcher.init()

//     resizeData.value = resizeWatcher.getData()

//     resizeWatcher.on((data) => {
//         resizeData.value = data
//     })
// })
</script>

<template>
    <FieldPluginProvider>
        <template v-slot:loading><span>Loading...</span></template>
        <template v-slot:error><span>Error</span></template>

        <FieldPlugin />
    </FieldPluginProvider>
</template>
