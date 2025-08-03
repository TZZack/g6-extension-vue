<template>
  <div>
    <div ref="containerRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup lang="ts">
import type { NodeData } from '@antv/g6';
import type { DemoNodeData } from './types';
import { ref, h, onMounted } from 'vue';
import { register, ExtensionCategory, Graph } from '@antv/g6';
import { VueNode } from '@TZZack/g6-extension-vue';
import DemoNode from './node.vue';

// 注册Vue节点类型
register(ExtensionCategory.NODE, 'vue-node', VueNode);

// 图形数据
const data = {
  nodes: [
    { id: '0', data: { name: 'id0' } },
    { id: '1', data: { name: 'id1' } },
    { id: '2', data: { name: 'id2' } },
    { id: '3', data: { name: 'id3' } },
    { id: '4', data: { name: 'id4' } },
    { id: '5', data: { name: 'id5' } },
    { id: '6', data: { name: 'id6' } },
    { id: '7', data: { name: 'id7' } },
    { id: '8', data: { name: 'id8' } },
    { id: '9', data: { name: 'id9' } },
  ],
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    { source: '1', target: '4' },
    { source: '0', target: '3' },
    { source: '3', target: '4' },
    { source: '4', target: '5' },
    { source: '4', target: '6' },
    { source: '5', target: '7' },
    { source: '5', target: '8' },
    { source: '8', target: '9' },
    { source: '2', target: '9' },
    { source: '3', target: '9' },
  ],
};

let graph: null | Graph = null;
const containerRef = ref<HTMLDivElement | null>(null);
onMounted(() => {
  graph = new Graph({
    container: containerRef.value!,
    autoFit: 'view',
    data,
    layout: {
      type: 'antv-dagre',
      nodeSize: [60, 30],
      nodesep: 60,
      ranksep: 40,
      controlPoints: true,
    },
    node: {
      type: 'vue-node',
      style: {
        component: (datum: NodeData) => {
          const nodeData = Object.assign({}, datum.data) as unknown as DemoNodeData;
          return h(DemoNode, { data: nodeData });
        },
      }
    },
    edge: {
      type: 'polyline',
    },
    behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
  });
  graph.render();
});
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
