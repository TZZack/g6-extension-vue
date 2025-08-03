<template>
  <div>{{ data.name }}</div>
</template>

<script setup lang="ts">
import type { DemoNodeData } from './types';

withDefaults(defineProps<{
  data: DemoNodeData;
}>(), {
  data: () => ({ name: '-' }),
});
</script>
