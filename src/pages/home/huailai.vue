<template>
  <div id="box" style="width: 100%;height: 100vh;">

  </div>
</template>

<script>
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
var edgeGroup = new THREE.Group();

export default {
  data() {
    return {
      ShaderBar: null
    }
  },
  mounted() {
    this.init()
    this.animate();
  },
  methods: {

    renderFrameMesh(obj) {
      const edges = new THREE.EdgesGeometry(obj.geometry);
      let color = new THREE.Color(1, 0, 0);
      var lineBasematerial = new THREE.LineBasicMaterial({
        color: color,
        side: THREE.FrontSide,
        linecap: 'round',
        linejoin: 'round',
      });
      const line = new THREE.LineSegments(edges, lineBasematerial);
      return line;
    },

    init() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      var ShaderBar = null
      let box = document.getElementById('box')
      box.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.update(); //update()函数内会执行camera.lookAt(controls.targe
      camera.position.y = 50;
      camera.position.z = 100;
      camera.position.x = 10;
      const loader = new GLTFLoader();
      const ambient = new THREE.AmbientLight(0xffffff, 5);
      scene.add(ambient);
      const self = this;  // 绑定 this 到 self

      loader.load('/3d/huailai-test2.glb', function (gltf) {
        console.log(gltf)

        scene.add(gltf.scene);

        gltf.scene.traverse(function (obj) {
          if (obj.name === "A5") {
            // 顶点着色器
            var vertexShader = `
varying vec3 vWorldPosition;
varying vec2 vUv; // 添加纹理坐标变量

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vUv = uv; // 将顶点的纹理坐标传递给片段着色器
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
            var fragmentShader = `
uniform float time; // 扫描线的位置
uniform vec3 color; // 扫描线的颜色
uniform float scanWidth; // 扫描线的宽度
uniform float switchHeight; // 切换到X轴扫描的Y轴高度
uniform sampler2D myTexture; // 添加纹理采样器
uniform sampler2D myTexture1;
varying vec3 vWorldPosition;
varying vec2 vUv; // 接收纹理坐标

void main() {
  // 判断是否达到切换高度
  bool switchToXAxis = vWorldPosition.y < switchHeight;
  
  // 根据切换条件选择扫描线的轴
  float distance = switchToXAxis ? abs(vWorldPosition.x - time) : abs(vWorldPosition.y - time);
  
  // 判断当前片段是否在扫描线的宽度范围内
  bool withinScanLine = distance < scanWidth;
  
  // 获取模型的原始纹理颜色
  vec4 texColor = texture2D(myTexture, vUv);
  vec4 texColor1 = texture2D(myTexture1, vUv);
  
  // 如果在扫描线范围内，则显示为指定颜色，否则显示纹理的本色
  gl_FragColor = withinScanLine ? texColor * vec4(color, 1.0) : texColor1;
}
`;

            ShaderBar = {
              uniforms: {
                time: { value: -40 },
                color: { value: new THREE.Color() }, // 蓝色
                scanWidth: { value: 4 }, // 扫描线的宽度
                myTexture: { value: new THREE.TextureLoader().load(require('../../../public/3d/蓝色网格.png')) }, // 替换为你的纹理路径
                myTexture1: '', // 替换为你的纹理路径
                switchHeight: -20
              },

              vertexShader: vertexShader, // 使用前面定义的顶点着色器
              fragmentShader: fragmentShader
            };
            render()
            const material = new THREE.ShaderMaterial({
              uniforms: ShaderBar.uniforms,
              vertexShader: ShaderBar.vertexShader,
              fragmentShader: ShaderBar.fragmentShader,
              transparent: true,
              side: THREE.DoubleSide
            });
            material.renderOrder = 1;

            obj.material = material

          }



          // console.log(obj)



        });
        scene.add(edgeGroup);
        console.log(edgeGroup)
        // console.log(edgeGroup)
      })
      const clock = new THREE.Clock();
      function render() {
        requestAnimationFrame(render)

        const delta = clock.getDelta();

        // 更新扫描线位置，这里的0.5是扫描速度，可以根据需要调整
        ShaderBar.uniforms.time.value += 0.1;
        if (ShaderBar.uniforms.time.value >= 40) {
          ShaderBar.uniforms.time.value = -40;
        }

      }

      camera.lookAt(new THREE.Vector3(0, 0, 1));
    },

    animate() {
      requestAnimationFrame(this.animate);
      edgeGroup.children.forEach(mesh => {
        mesh.material.color.setHSL(Math.random(), 0.5, 0.5);
      });
      renderer.render(scene, camera);
    }


  },



}
</script>

<style>
</style>