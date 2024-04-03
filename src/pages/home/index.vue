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



      // function addCube() {
      //   for (let i = 0; i < 100; i++) {
      //     const h = Math.random() * 6 + 5
      //     const cubeGeo = new THREE.BoxGeometry(1, h, 1);
      //     cubeGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(24 * 3), 3)); // setAttribute 以前是.addAttribute
      //     // 相当于在 shader中创建了 attribute vec4 position
      //     const colors1 = cubeGeo.attributes.color;
      //     for (let i = 0; i < 24; i += 2) {
      //       let r = Math.random() * 0.8, g = Math.random() * 0.7, b = Math.random() * 0.5;
      //       colors1.setXYZ(i, r, g, b);
      //       colors1.setXYZ(i + 1, r, g, b);
      //     }
      //     const k = 2;
      //     colors1.setXYZ(k * 4 + 0, .0, 1.0, 1.0);
      //     colors1.setXYZ(k * 4 + 1, .0, 1.0, 1.0);
      //     colors1.setXYZ(k * 4 + 2, .0, 1.0, 1.0);
      //     colors1.setXYZ(k * 4 + 3, .0, 1.0, 1.0);
      //     const cube = new THREE.Mesh(cubeGeo, material)


      //     cube.position.set(Math.random() * 100 - 50, h / 2, Math.random() * 100 - 50)
      //     scene.add(cube)
      //   }
      // }
      // addCube()

      loader.load('/3d/chengdu.glb', function (gltf) {
        // 递归遍历设置每个模型的材质，同时设置每个模型的边线
        gltf.scene.traverse(function (obj) {
          if (obj.name === '外框') {
            // 模型材质重新设置
            // 模型边线设置


            var vertexShader = [
              'varying vec3 vColor;',
              'varying vec3	vVertexNormal;',
              // 'uniform sampler2D Texture1;',
              "varying vec2 vUv;",
              'varying float v_pz; ',
              'void main(){',
              'vColor = color;',  //顶点颜色
              'vUv = uv;',
              // 'vec4 texColor = texture2D(Texture1, vUv);',
              // 'gl_FragColor = texColor;',
              'v_pz = position.y; ',   //获取顶点位置的y
              'vVertexNormal	= normal;', //顶点法向量---内置  

              'gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',//顶点位置
              '}'
            ].join('\n')
            var fragmentShader = [
              `uniform float boxH; // 立方体高度
        uniform sampler2D myTexture; // 纹理uniform
        varying vec3 vVertexNormal; // 顶点法向量
        varying vec3 vColor; // 顶点颜色
        varying vec2 vUv; // 纹理坐标
        varying float v_pz; // y的值

        float plot(float pct) {
        return smoothstep(pct - 30.0, pct, v_pz) - smoothstep(pct, pct + 0.1, v_pz);
        }
        void main() {
        float f1 = plot(boxH);
        vec4 texColor = texture2D(myTexture, vUv); // 使用纹理坐标获取纹理颜色
        vec4 finalColor = mix(vec4(vColor,0.0), texColor, f1); // 使用纹理颜色替换黄色

        if (f1 > 0.0) {
          vec4 lightColor = vec4(1.0, 0.85, 0.6, 1.0); // 浅金色
        gl_FragColor = mix(texColor, lightColor, f1);
        } else {
            gl_FragColor = texColor; // 使用模型的原始纹理颜色
        // 其他区域红色且完全不透明
        }
        }`


            ].join('\n')
            let img = require('../../../public/3d/wind.png')
            console.log(img)
            const textureLoader = new THREE.TextureLoader();

            const myTexture = textureLoader.load(img);

            ShaderBar = {
              uniforms: {
                boxH: { value: -30 },
                opacity: { value: 0 } // 假设你想要完全不透明的材质
              },
              vertexShader: vertexShader,
              fragmentShader: fragmentShader
            }
            render()
            const material = new THREE.ShaderMaterial({
              uniforms: ShaderBar.uniforms,
              vertexShader: ShaderBar.vertexShader,
              fragmentShader: ShaderBar.fragmentShader,
              vertexColors: ShaderBar,  //暂时未理解该处作用

              texture: {
                // 加载纹理贴图返回Texture对象作为texture的值
                // Texture对象对应着色器中sampler2D数据类型变量
                value: myTexture
              },

            })
            material.renderOrder = 1;

            obj.material = material
          }

        });

        // 将加载的模型添加到场景中
        scene.add(gltf.scene);

      })


      function render() {


        ShaderBar.uniforms.boxH.value += 0.3
        if (ShaderBar.uniforms.boxH.value > 60) {
          ShaderBar.uniforms.boxH.value = -30.0;

        }

        requestAnimationFrame(render)
      }


      camera.lookAt(new THREE.Vector3(0, 0, 1));








    },

    animate() {
      requestAnimationFrame(this.animate);
      renderer.render(scene, camera);
    }


  },



}
</script>

<style>
</style>