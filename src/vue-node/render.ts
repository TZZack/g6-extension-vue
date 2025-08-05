import type { VNode } from 'vue-demi';
import { isVue2, isVue3, Vue2, Vue as Vue3 } from 'vue-demi';

const VUE_MARK = '__vue_node_root__';

export type ContainerType = Element & {
  [VUE_MARK]?: typeof Vue2 | null;
};

export function render(
  vNode: VNode,
  container: ContainerType,
  isUpdate = false,
) {
  try {
    if (isVue2) {
      // vue2加个update处理，更新节点时避免创建新实例
      if (isUpdate && container[VUE_MARK]) {
        const vm = container[VUE_MARK];
        vm.$options.render = () => vNode;
        vm.$forceUpdate();
        return;
      }
      const vm = new Vue2({
        render: () => vNode,
      });
      const el = document.createElement('div');
      container.appendChild(el);
      vm.$mount(el);
      container[VUE_MARK] = vm;
    } else if (isVue3) {
      Vue3.render(vNode, container);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function unmount(container: ContainerType) {
  if (!container) {
    return;
  }

  if (isVue2) {
    if (container[VUE_MARK]) {
      // 销毁实例
      container[VUE_MARK].$destroy();
      container[VUE_MARK] = null;
      // 清除DOM
      container.innerHTML = '';
    }
  } else if (isVue3) {
    // vue3只需要render(null, container)，清除container内所有DOM节点和对应的vue组件实例
    Vue3.render(null, container);
  }
}
