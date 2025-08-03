<template>
  <div
    ref="containerRef"
    style="width: 100%; height: 100%"
  />
</template>

<script setup lang="ts">
import type { GraphOptions } from '@antv/g6';
import { Graph as G6Graph } from '@antv/g6';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  options: GraphOptions;
}>();

let graph: null | G6Graph = null;
const containerRef = ref<HTMLDivElement | null>(null);

const updateGraphOptions = (options: GraphOptions) => {
  if (!graph || !options) {
    return;
  }
  graph.setOptions(options);
  graph.render();
};

onMounted(() => {
  graph = new G6Graph({ container: containerRef.value! });
  updateGraphOptions(props.options);
});

watch(
  () => props.options,
  (options) => {
    updateGraphOptions(options);
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>
