<template>
  <div>

    <div id="box">

    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Sky } from 'three/addons/objects/Sky.js';
// 导入水面
import { Water } from 'three/addons/objects/Water.js';
// 解析 HDR 纹理数据
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

const scene = new THREE.Scene();
const Loader = new GLTFLoader();
var models = null
var originalMaterials = []; // 用于存储原始材质
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {





      this.loadModel()
    },


    // 设置一个过渡时间，例如5秒
    loadModel() {



      Loader.load("/3d/chengdu.glb", (gltf) => {
        const model = gltf.scene;
        console.log(gltf);

        model.scale.set(0.5, 0.5, 0.5);
        model.rotation.y = 10;

        // // 存储原始材质
        // model.traverse((child) => {
        //   // 外框
        //   // if (child.name === "外框") {
        //   //   console.log(child)
        //   // }
        //   if (child.name === "外框" ||
        //     child.name === "立方体001" ||
        //     child.name === "玻璃0" ||
        //     child.name === "玻璃1" ||
        //     child.name === "玻璃2" ||
        //     child.name === "玻璃3" ||
        //     child.name === "玻璃4" ||
        //     child.name === "玻璃5" ||
        //     child.name === "玻璃6" ||
        //     child.name === "玻璃7" ||
        //     child.name === "玻璃8" ||
        //     child.name === "路径-8002" ||
        //     child.name === "路径-8004" ||
        //     child.name === "路径-8006" ||
        //     child.name === "路径-8008" ||
        //     child.name === "路径-8010"
        //   ) {
        //     this.originalMaterials[child.id] = child.material; // 使用对象存储原始材质
        //     // child.material = new THREE.MeshBasicMaterial({
        //     //   color: 'blue',
        //     //   wireframe: true,
        //     //   transparent: true,
        //     //   opacity: 1,
        //     // });
        //   }
        // });

        this.models = model; // 存储模型引用
        scene.add(model); // 将模型添加到场景中

        this.transitionStart = this.clock.getElapsedTime(); // 设置过渡开始时间

        // 如果animate是Vue组件的方法，确保绑定了正确的上下文
        this.animate();
      });
    },
    // 动画函数
    animate() {
      requestAnimationFrame(this.animate.bind(this));

      // 获取当前时间
      let currentTime = this.clock.getElapsedTime();
      // 计算过渡的进度，范围从0到1
      let transitionProgress = (currentTime - this.transitionStart) / this.transitionDuration;
      transitionProgress = Math.min(transitionProgress, 1); // 确保不超过1

      // 遍历模型的每个子对象
      // this.models.traverse((child) => {
      //   if (child.name === "外框" ||
      //     child.name === "立方体001" ||
      //     child.name === "玻璃0" ||
      //     child.name === "玻璃1" ||
      //     child.name === "玻璃2" ||
      //     child.name === "玻璃3" ||
      //     child.name === "玻璃4" ||
      //     child.name === "玻璃5" ||
      //     child.name === "玻璃6" ||
      //     child.name === "玻璃7" ||
      //     child.name === "玻璃8" ||
      //     child.name === "路径-8002" ||
      //     child.name === "路径-8004" ||
      //     child.name === "路径-8006" ||
      //     child.name === "路径-8008" ||
      //     child.name === "路径-8010"
      //   ) {
      //     // 根据过渡进度，逐步应用原始材质的属性
      //     // 这里我们将使用子对象的世界坐标来决定其透明度
      //     let worldPosition = new THREE.Vector3();
      //     child.getWorldPosition(worldPosition);

      //     // 假设模型的高度范围是从0到height
      //     let height = 10; // 你需要根据实际模型的大小来设置这个值
      //     let opacity = (worldPosition.y <= transitionProgress * height) ? 0 : 1;
      //     child.material.opacity = opacity;

      //     // 如果过渡完成，将材质切换为原始材质
      //     if (transitionProgress === 1) {
      //       child.material = child.material = new THREE.MeshBasicMaterial({
      //         color: 'blue',
      //         wireframe: true,
      //         transparent: true,
      //         opacity: 1,
      //       });
      //     }
      //   //   }
      // });

      // 渲染场景
      this.renderer.render(this.scene, this.camera);
    }

  }
}
</script>


<style scoped>
#box {
  width: 100%;
  height: 100%;
}
</style>
