# Vue extension for G6

本拓展支持使用 `Vue (^2.6.0 || 3.0.0)` 自定义 `G6 (>=5.0.0)` 节点

## 推荐场景

- 节点展示形式、交互复杂，比如表单输入、状态切换等（使用 `G6` 内置图形和事件系统实现起来较繁琐）

- 节点数量较少（最好控制在 `2000` 个节点内，毕竟是 `dom` ，超过的建议提前验证下是否存在性能问题）

## 专业词汇说明

- `datum` : 表示基础信息单元，在 `G6` 种， `datum` 即代表着节点/边（ G6 是数据驱动的，这个概念很重要）

- `data` : 在 G6 种，`data` 一般指节点/边绑定的 `data` 属性，即 `datum.data` ，通常用来存储业务数据

## 用法

### 1. 安装

```bash
npm install @tzzack/g6-extension-vue
```

### 2. 注册节点类型

具体可了解 `G6` 官网 [注册自定义节点](https://g6.antv.antgroup.com/manual/element/node/custom-node#%E7%AC%AC%E4%BA%8C%E6%AD%A5%E6%B3%A8%E5%86%8C%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8A%82%E7%82%B9)

```ts
import { ExtensionCategory, register } from '@antv/g6';
import { VueNode } from '@tzzack/g6-extension-vue';

register(ExtensionCategory.NODE, 'vue', VueNode);
```

### 3. 自定义的 Vue 节点展示

比如 `Vue3` ：

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

### 4. 使用

`component` 属性配置为 `VNode` 即 Vue 虚拟节点

#### 4.1 推荐用法一

- `component` 支持回调函数（ G6 提供的特性支持 ），可通过参数 `datum` 获取节点数据传递给节点组件回显，示例如下: 

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
        const nodeData = { ...datum.data };
        const nodeData = Object.assign({}, datum.data) as unknown as DemoNodeData;
        return h(DemoNode, { data: nodeData });
      },
    },
  },
});
```

**注意**

- `G6` 每次更新节点（比如 `graph.updateNodeData([...])` ）都会触发执行回调函数，因为需要生成最新的 `style` 属性

- `datum` 参数在 G6 底层处理中都是同个引用（为了减少内存开销）且非 Vue 响应式变量，因此这里不能直接把 `datum` 通过 `props` 传给 vue 组件，否则更新时 Vue 判断虚拟节点没有变更，则不会触发视图更新，比如下面通过 `updateNodeData` 更新节点数据，视图不会更新:

```ts
const graph = new Graph({
  // other options ...
  node: {
    type: 'vue',
    style: {
      component: (datum: NodeData) => {
        return h(DemoNode, { data: datum });
      },
    },
  },
});
await graph.render();

graph.updateNodeData([{ id: 'ndoe1', data: { name: 'new_name' } }]);
graph.draw();
```

- 正确的做法是应该是生成一个新的引用对象，比如 `Object.assign({}, datum)` 或者 `{ ...datum }`

- 如果使用的是 `datum.data` ，实际上在 `updateNodeData` 后会生成新的 `datum.data` 引用（不管更新时是否用的同一个 `data` 引用），比如:

```ts
const nodeDatum = graph.getNodeData(['node1']);
const data = nodeDatum.data;
data.name = 'new_name';
graph.updateNodeData([{ id: 'node1', data }]);
```

这个场景即便不生成新的引用对象（即 `h(DemoNde, { data: datum.data })` ），更新后也会出发视图更新。**但即便这样，最好还是生成新的引用，避免引发诡异问题**

#### 4.2 推荐用法二

- `style` 为回调函数，也就是节点其它属性也需要通过节点数据来判断赋值的场景

- `style` 和 `component` 不能同时为回调函数，因为当 `style` 为回调函数时， `compoent` 的回调不会被执行（也就是 G6 只解析一层回调，当然这种用法也肯定是没必要的）

```ts
import type { DemoNodeData } from './types';
import { type NodeData, Graph } from '@antv/g6';
import DemoNode from './node.vue';

const graph = new Graph({
  // other options ...
  node: {
    type: 'vue',
    style: (datum: NodeData) => {
      const nodeData = { ...datum };
      return {
        size: nodeData.x > 0 ? 40 : 20,
        component: h(DemoNode, { data: nodeData });
      };
    },
  },
});
```

#### 推荐用法三

- 支持 `jsx` : 实际上 `jsx` 语法在编译后也是个 `VNode`

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
        const nodeData = { ...datum };
        return <DemoNode data={nodeData} />;
      },
    }
  },
});
```
