## G6 Extension Vue

This extension allows you to define G6 node by Vue ( ^2.0.0 || >=3.0.0 ) component and JSX syntax.

## Usage

1. Install

```bash
npm install @tzzack/g6-extension-vue
```

2. Import and Register

```ts
import { ExtensionCategory, register } from '@antv/g6';
import { VueNode } from '@tzzack/g6-extension-react';

register(ExtensionCategory.NODE, 'vue', VueNode);
```

3. Define Vue Node

Just vue2 or vue3 SFC, for example:

```html
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
```

4. Use

Make `component` attritude return a `VNode` with `h` function.

```ts
import type { DemoNodeData } from './types';
import { type NodeData, Graph } from '@antv/g6';
import DemoNode from './node.vue';

const graph = new Graph({
  // other options ...
  node: {
    type: 'vue',
    style: {
      component: (datum: NodeData) => {
        const nodeData = Object.assign({}, datum.data) as unknown as DemoNodeData;
        return h(DemoNode, { data: nodeData });
      },
    }
  }
});
```