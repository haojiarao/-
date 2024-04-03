<template>
  <tres-canvas clear-color="#201919" window-size>
    <tres-perspective-camera :position="[15, 20, 0]" :fov="45" :near="0.1" :far="10000" />
    <orbit-controls enable-damping />
    <tres-ambient-light :intensity="6.0" />
    <video-floor-com v-bind="configState" :position="[0, 0, 10]" :size="[10, 10]"
      v-src-path="https://opensource-1314935952.cos.ap-nanjing.myqcloud.com/video/floor/floorV1.mp4" />
    <video-floor-com color="#02a7ff" :position="[0, -1, 10]" :size="[13, 13]"
      v-src-path="https://opensource-1314935952.cos.ap-nanjing.myqcloud.com/video/floor/floorV2.mp4" />

    <video-floor-com color="#7300a8" :opacity="0.6" :position="[0, 0, -10]" :size="[10, 10]"
      v-src-path="https://opensource-1314935952.cos.ap-nanjing.myqcloud.com/video/floor/floorV3.mp4" />
    <video-floor-com color="#f605ff" :rotation-z="-0.01" :position="[0, -1, -10]" :size="[13, 13]"
      v-src-path="https://opensource-1314935952.cos.ap-nanjing.myqcloud.com/video/floor/floorV3.mp4" />

    <video-floor-com color="#02a7ff" :rotation-z="0" :position="[0, -1.99, 0]" :opacity="0.06" :texture-repeat="[3, 2]"
      :size="[40, 40]" v-src-path="https://opensource-1314935952.cos.ap-nanjing.myqcloud.com/video/floor/grid.mp4" />

    <!-- Suspense is not available in Vue 2, so you might need to handle loading states differently -->
    <reflector-dudv :position="[0, -2, 0]" v-bind="reflectorState" />
  </tres-canvas>
</template>

<script>
import Vue from 'vue';
import { OrbitControls } from '@tresjs/cientos';
import videoFloorCom from '../components/videoFloor.vue';
import reflectorDUDV from '../components/reflectorDUDV.vue';

export default {
  components: {
    'tres-perspective-camera': {}, // Replace with actual component
    'tres-ambient-light': {}, // Replace with actual component
    'tres-canvas': {}, // Replace with actual component
    'orbit-controls': OrbitControls,
    'video-floor-com': videoFloorCom,
    'reflector-dudv': reflectorDUDV
  },
  data() {
    return {
      reflectorState: {
        reflectivity: 2.6,
        showGridHelper: false,
        scale: 4
      },
      configState: {
        color: "#fff",
        opacity: 0.95,
        rotationZ: 0.01
      },
      paneControl: null // We will initialize this in the mounted hook
    };
  },
  mounted() {
    this.paneControl = new Pane({
      title: 'video地面',
      expanded: true,
    });
    this.paneControl.addInput(this.configState, 'color', { label: '颜色' });
    this.paneControl.addInput(this.configState, 'opacity', {
      label: '透明度', min: 0.0,
      max: 1.0,
      step: 0.01,
    });
    this.paneControl.addInput(this.configState, 'rotationZ', {
      label: '自转速度', min: -0.1,
      max: 0.1,
      step: 0.01,
    });
  }
};
</script>