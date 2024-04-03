<template>
  <tres-mesh :rotation-x="rotationX" ref="tmRef">
    <tres-plane-geometry :args="size" />
    <tres-mesh-standard-material :color="tmsMaterial.color" :alpha-map="tmsMaterial.alphaMap" :side="tmsMaterial.side"
      :transparent="tmsMaterial.transparent" :opacity="tmsMaterial.opacity" :blending="tmsMaterial.blending"
      :flat-shading="tmsMaterial.flatShading" :depth-test="tmsMaterial.depthTest" />
  </tres-mesh>
</template>

<script>
import * as THREE from 'three';
import { VideoTexture, RepeatWrapping, DoubleSide, AdditiveBlending, Color } from 'three';
import { TresMesh, TresPlaneGeometry, TresMeshStandardMaterial } from '@tresjs/core';

export default {
  components: {
    TresMesh,
    TresPlaneGeometry,
    TresMeshStandardMaterial
  },
  props: {
    size: {
      type: Array,
      default: () => [10, 10]
    },
    vSrcPath: {
      type: String,
      required: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#fff'
    },
    opacity: {
      type: Number,
      default: 0.95
    },
    rotationZ: {
      type: Number,
      default: 0.01
    },
    textureRepeat: {
      type: Array,
      default: () => [1, 1]
    }
  },
  data() {
    return {
      rotationX: -Math.PI / 2,
      tmsMaterial: {
        color: this.color,
        alphaMap: null,
        side: DoubleSide,
        transparent: true,
        opacity: this.opacity,
        blending: AdditiveBlending,
        flatShading: true,
        depthTest: false
      }
    };
  },
  watch: {
    color(newVal) {
      this.tmsMaterial.color = new Color(newVal);
    },
    opacity(newVal) {
      this.tmsMaterial.opacity = newVal;
    }
  },
  mounted() {
    let video = document.createElement('video');
    video.src = this.vSrcPath;
    video.loop = this.loop;
    video.muted = true;
    video.crossOrigin = '';
    video.play();
    let videoTexture = new VideoTexture(video);
    videoTexture.wrapS = RepeatWrapping;
    videoTexture.wrapT = RepeatWrapping;
    videoTexture.repeat.set(this.textureRepeat[0], this.textureRepeat[1]);

    this.tmsMaterial.alphaMap = videoTexture;

    this.$refs.tmRef.rotation.z += this.rotationZ;

    this.$nextTick(() => {
      this.animate();
    });
  },
  methods: {
    animate() {
      requestAnimationFrame(this.animate);
      if (this.$refs.tmRef) {
        this.$refs.tmRef.rotation.z += this.rotationZ;
      }
    }
  }
};
</script>