<template>
  <div ref="threeContainer" style="width: 100%; height: 100vh;">
    1231</div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createWallMesh
} from './WallMesh.js'; //流光围墙区域
export default {
  name: 'FenceLightEffect',
  mounted() {
    this.initThree();
    this.addFence();
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,

    }
  },
  methods: {
    initThree() {
      const width = this.$refs.threeContainer.clientWidth;
      const height = this.$refs.threeContainer.clientHeight;

      // 创建场景
      this.scene = new THREE.Scene();

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.scene.add(this.camera);

      //开启阻尼
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0xF1F2F7);
      this.renderer.setSize(width, height);
      this.$refs.threeContainer.appendChild(this.renderer.domElement);
      this.scene.background = new THREE.Color(0x000000);
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
      this.camera.lookAt(new THREE.Vector3(0, 0, 1));
      this.camera.position.set(0, 0, 100);
      // 添加灯光
      // const axesHelper = new THREE.AxesHelper(150);
      // this.scene.add(axesHelper);

      // 光线的照射

      const ambient = new THREE.AmbientLight(0xffffff, 8);
      this.scene.add(ambient);
      // const dirLightHelper = new THREE.DirectionalLightHelper(ambient, 5, 0xff0000);
      // this.scene.add(dirLightHelper);
      const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      light.position.set(0, 0, 100)
      // const ambientLight = new THREE.AmbientLight(0x404040);
      // this.scene.add(ambientLight);
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.update(); //update()函数内会执行camera.lookAt(controls.targe


      this.animate();

    },
    addFence() {
      // 这里是你提供的围栏顶点数据和构建geometry的代码

      var points = [
        -10, -10,   //顶点1坐标
        50, -10,  //顶点2坐标
        50, 50,   //顶点3坐标
        -10, 50,
        -10, -10
      ]
      const mesh = createWallMesh(points, '#FEFEFE');
      this.scene.add(mesh);


    },
    animate() {
      requestAnimationFrame(this.animate);
      // 如果你使用了OrbitControls，请确保在这里更新它

      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style>
/* 设置组件的样式 */
</style>