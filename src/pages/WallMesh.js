import * as THREE from 'three';

function createWallMesh(points, color) {
  let posArr = [];
  let uvrr = [];
  let h = 10;
  //围墙拉伸高度
  for (let i = 0; i < points.length - 2; i += 2) {
    posArr.push(points[i], points[i + 1], 0, points[i + 2], points[i + 3], 0, points[i + 2], points[i + 3], h);
    // 矩形的三角形2
    posArr.push(points[i], points[i + 1], 0, points[i + 2], points[i + 3], h, points[i], points[i + 1], h);
    // 注意顺序问题，和顶点位置坐标对应
    uvrr.push(0, 0, 1, 0, 1, 1);
    uvrr.push(0, 0, 1, 1, 0, 1);
  }
  let geometry = new THREE.BufferGeometry();
  geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(posArr), 3);
  geometry.attributes.uv = new THREE.BufferAttribute(new Float32Array(uvrr), 2);
  geometry.computeVertexNormals()
  let texload = new THREE.TextureLoader();
  let texture = texload.load('/3d/wind-hot.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.x = Math.xnum(points); // x方向阵列
  function flowAnimation() {
    requestAnimationFrame(flowAnimation);
    // 设置纹理偏移
    // y方向流量  光带流动效果
    texture.offset.y -= 0.003;
  }
  flowAnimation();

  let material = new THREE.MeshLambertMaterial({
    color: color,
    map: texture,
    side: THREE.DoubleSide, //两面可见
    transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
    depthTest: false,
  });
  let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh

  let mesh2 = mesh.clone();
  mesh2.material = new THREE.MeshLambertMaterial({
    color: color,
    map: texload.load('/3d/jianbian.png'),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
    depthTest: false,
  });
  const wallMesh = new THREE.Group();
  wallMesh.add(mesh);
  wallMesh.add(mesh2);

  mesh2.rotation.x += -Math.PI / 2; //旋转物体
  mesh.rotation.x += -Math.PI / 2;

  // 两个mesh一样大，深度冲突问题
  mesh.renderOrder = 0;
  mesh2.renderOrder = -1;
  wallMesh.update = {

  }
  return wallMesh;
}



Math.xnum = function (arr) {
  let S = 0;
  for (let i = 0; i < arr.length - 2; i += 2) {
    const x1 = arr[i];
    const y1 = arr[i + 1];
    const x2 = arr[i + 2];
    const y2 = arr[i + 3];
    S += Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
  }
  return S / 10;
}
export {
  createWallMesh
}