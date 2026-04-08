/**
 * 13 CNEFA · Video Publicitario 3D
 * cnefa_video.js — Three.js cosmic background + slide logic
 */

(function () {
  'use strict';

  /* ── SLIDES ──────────────────────────────────── */
  let currentSlide = 0;
  const totalSlides = 4;
  let autoTimer = null;

  function goSlide(n) {
    document.getElementById('sl-' + currentSlide).classList.remove('active');
    document.querySelectorAll('.dot')[currentSlide].classList.remove('on');
    currentSlide = ((n % totalSlides) + totalSlides) % totalSlides;
    document.getElementById('sl-' + currentSlide).classList.add('active');
    document.querySelectorAll('.dot')[currentSlide].classList.add('on');
    resetAutoSlide();
  }

  function nextSlide() { goSlide(currentSlide + 1); }

  function resetAutoSlide() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 5000);
  }

  window.goSlide = goSlide;

  /* ── AR TOGGLE ───────────────────────────────── */
  window.toggleAR = function () {
    var scene = document.getElementById('arScene');
    var closeBtn = document.getElementById('arClose');
    scene.classList.add('visible');
    closeBtn.style.display = 'block';
    clearInterval(autoTimer);
  };

  window.closeAR = function () {
    var scene = document.getElementById('arScene');
    var closeBtn = document.getElementById('arClose');
    scene.classList.remove('visible');
    closeBtn.style.display = 'none';
    resetAutoSlide();
  };

  /* ── THREE.JS COSMIC BG ──────────────────────── */
  var canvas = document.getElementById('canvas3d');
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x030b1a, 1);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 5);

  /* ── RESIZE ──────────────────────────────────── */
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── STARFIELD ───────────────────────────────── */
  function makeStarfield(count, spread) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    var sizes = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.4;
      sizes[i] = Math.random() * 2.5 + 0.3;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var mat = new THREE.PointsMaterial({
      color: 0xddeeff,
      size: 0.04,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.75
    });
    return new THREE.Points(geo, mat);
  }

  var stars1 = makeStarfield(1200, 80);
  var stars2 = makeStarfield(400, 60);
  stars2.material.color.setHex(0xaaccff);
  stars2.material.size = 0.07;
  scene.add(stars1);
  scene.add(stars2);

  /* ── NEBULA-LIKE BACKGROUND GRADIENT ─────────── */
  (function () {
    var bgGeo = new THREE.PlaneGeometry(40, 60);
    var bgMat = new THREE.MeshBasicMaterial({
      color: 0x030b1a,
      transparent: true,
      opacity: 1
    });
    var bg = new THREE.Mesh(bgGeo, bgMat);
    bg.position.z = -8;
    scene.add(bg);
  })();

  /* ── MOON ─────────────────────────────────────── */
  var moonGeo = new THREE.SphereGeometry(0.9, 64, 64);
  var moonMat = new THREE.MeshStandardMaterial({
    color: 0x9ab0c8,
    roughness: 0.9,
    metalness: 0.05
  });
  var moon = new THREE.Mesh(moonGeo, moonMat);
  moon.position.set(3.2, 4.5, -3);
  scene.add(moon);

  // moon craters (dark spots)
  var craterMat = new THREE.MeshStandardMaterial({ color: 0x7090a8, roughness: 1 });
  [[0.3, 0.6, 0.92],[−0.4, 0.3, 0.88],[0.1, −0.5, 0.90]].forEach(function(c) {
    var cg = new THREE.SphereGeometry(0.12, 16, 16);
    var cm = new THREE.Mesh(cg, craterMat);
    cm.position.set(c[0] * 0.9, c[1] * 0.9, c[2] * 0.9);
    moon.add(cm);
  });

  // Moon glow halo
  var haloGeo = new THREE.SphereGeometry(1.05, 32, 32);
  var haloMat = new THREE.MeshBasicMaterial({
    color: 0x9ab0c8,
    transparent: true,
    opacity: 0.06,
    side: THREE.BackSide
  });
  moon.add(new THREE.Mesh(haloGeo, haloMat));

  /* ── SATURN-LIKE PLANET ──────────────────────── */
  var saturnGeo = new THREE.SphereGeometry(0.55, 64, 64);
  var saturnMat = new THREE.MeshStandardMaterial({
    color: 0x4a6a9e,
    roughness: 0.6,
    metalness: 0.2
  });
  var saturn = new THREE.Mesh(saturnGeo, saturnMat);
  saturn.position.set(-3.5, -2.5, -2);
  scene.add(saturn);

  // Saturn rings
  var ringGeo = new THREE.TorusGeometry(0.85, 0.08, 4, 80);
  var ringMat = new THREE.MeshBasicMaterial({
    color: 0x6a90cc,
    transparent: true,
    opacity: 0.45
  });
  var ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI * 0.42;
  saturn.add(ring1);

  var ring2Geo = new THREE.TorusGeometry(1.05, 0.04, 4, 80);
  var ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x8ab0dd,
    transparent: true,
    opacity: 0.25
  });
  var ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI * 0.42;
  saturn.add(ring2);

  // Saturn glow
  var sHaloGeo = new THREE.SphereGeometry(0.62, 32, 32);
  var sHaloMat = new THREE.MeshBasicMaterial({
    color: 0x4a6aae,
    transparent: true,
    opacity: 0.07,
    side: THREE.BackSide
  });
  saturn.add(new THREE.Mesh(sHaloGeo, sHaloMat));

  /* ── SMALL DISTANT PLANET (blue) ─────────────── */
  var planet3Geo = new THREE.SphereGeometry(0.28, 32, 32);
  var planet3Mat = new THREE.MeshStandardMaterial({
    color: 0x1a3a8f,
    roughness: 0.5,
    metalness: 0.3,
    emissive: 0x081840,
    emissiveIntensity: 0.3
  });
  var planet3 = new THREE.Mesh(planet3Geo, planet3Mat);
  planet3.position.set(2.8, -3.8, -1.5);
  scene.add(planet3);

  // orbit ring around small planet
  var op3Geo = new THREE.TorusGeometry(0.42, 0.015, 4, 60);
  var op3Mat = new THREE.MeshBasicMaterial({ color: 0x00c8ff, transparent: true, opacity: 0.3 });
  var op3 = new THREE.Mesh(op3Geo, op3Mat);
  op3.rotation.x = Math.PI * 0.3;
  planet3.add(op3);

  /* ── TINY ORBITING SATELLITE ─────────────────── */
  var satGroup = new THREE.Group();
  planet3.add(satGroup);
  var satGeo = new THREE.BoxGeometry(0.05, 0.02, 0.08);
  var satMat = new THREE.MeshBasicMaterial({ color: 0x00ddff });
  var satMesh = new THREE.Mesh(satGeo, satMat);
  satMesh.position.set(0.55, 0, 0);
  satGroup.add(satMesh);

  /* ── SHOOTING STARS ──────────────────────────── */
  var shootingStars = [];
  function spawnShootingStar() {
    var geo = new THREE.BufferGeometry();
    var len = 0.6 + Math.random() * 1.0;
    var x = (Math.random() - 0.5) * 10;
    var y = 3 + Math.random() * 4;
    var z = -1 - Math.random() * 2;
    var pts = new Float32Array([x, y, z, x + len, y + len * 0.3, z]);
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    var mat = new THREE.LineBasicMaterial({
      color: 0xaaddff,
      transparent: true,
      opacity: 0.85
    });
    var line = new THREE.Line(geo, mat);
    scene.add(line);
    shootingStars.push({ mesh: line, vx: -0.12 - Math.random() * 0.08, vy: -0.08, life: 1.0 });
    setTimeout(spawnShootingStar, 2500 + Math.random() * 4000);
  }
  spawnShootingStar();

  /* ── LIGHTS ──────────────────────────────────── */
  var ambLight = new THREE.AmbientLight(0x223366, 0.8);
  scene.add(ambLight);
  var dirLight = new THREE.DirectionalLight(0x6699ff, 0.7);
  dirLight.position.set(-5, 8, 3);
  scene.add(dirLight);
  var moonLight = new THREE.PointLight(0x9ab0c8, 0.5, 15);
  moonLight.position.set(3.2, 4.5, -1);
  scene.add(moonLight);

  /* ── FLOATING PARTICLES ──────────────────────── */
  var particleGeo = new THREE.BufferGeometry();
  var pCount = 80;
  var pPos = new Float32Array(pCount * 3);
  var pVel = new Float32Array(pCount * 3);
  for (var i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 12;
    pPos[i*3+1] = (Math.random() - 0.5) * 18;
    pPos[i*3+2] = (Math.random() - 0.5) * 4;
    pVel[i*3]   = (Math.random() - 0.5) * 0.004;
    pVel[i*3+1] = 0.003 + Math.random() * 0.003;
    pVel[i*3+2] = 0;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  var particleMat = new THREE.PointsMaterial({
    color: 0x00c8ff,
    size: 0.06,
    transparent: true,
    opacity: 0.5
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── CLOCK ───────────────────────────────────── */
  var clock = new THREE.Clock();

  /* ── ANIMATE ─────────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    // rotate starfields slowly
    stars1.rotation.y = t * 0.006;
    stars2.rotation.z = t * 0.004;

    // Moon gentle bob + slow rotation
    moon.position.y = 4.5 + Math.sin(t * 0.3) * 0.12;
    moon.rotation.y = t * 0.03;

    // Saturn float + rotate
    saturn.position.y = -2.5 + Math.sin(t * 0.22 + 1) * 0.18;
    saturn.rotation.y = t * 0.07;
    ring1.rotation.z = t * 0.02;

    // Small planet
    planet3.position.y = -3.8 + Math.sin(t * 0.18 + 2) * 0.14;
    planet3.rotation.y = t * 0.12;
    satGroup.rotation.y = t * 2.0;

    // Floating particles
    var pArr = particleGeo.attributes.position.array;
    for (var i = 0; i < pCount; i++) {
      pArr[i*3]   += pVel[i*3];
      pArr[i*3+1] += pVel[i*3+1];
      if (pArr[i*3+1] > 9) { pArr[i*3+1] = -9; pArr[i*3] = (Math.random() - 0.5) * 12; }
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Shooting stars
    for (var s = shootingStars.length - 1; s >= 0; s--) {
      var ss = shootingStars[s];
      ss.life -= 0.025;
      ss.mesh.material.opacity = ss.life * 0.85;
      var arr = ss.mesh.geometry.attributes.position.array;
      arr[0] += ss.vx; arr[1] += ss.vy;
      arr[3] += ss.vx; arr[4] += ss.vy;
      ss.mesh.geometry.attributes.position.needsUpdate = true;
      if (ss.life <= 0) {
        scene.remove(ss.mesh);
        shootingStars.splice(s, 1);
      }
    }

    // Gentle camera drift
    camera.position.x = Math.sin(t * 0.05) * 0.15;
    camera.position.y = Math.cos(t * 0.04) * 0.1;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  /* ── SWIPE GESTURE ───────────────────────────── */
  var touchStartX = 0;
  var touchStartY = 0;
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
      if (dy < 0) goSlide(currentSlide + 1);
      else goSlide(currentSlide - 1);
    }
  }, { passive: true });

  /* ── KEYBOARD ────────────────────────────────── */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goSlide(currentSlide + 1);
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goSlide(currentSlide - 1);
  });

  /* ── START ───────────────────────────────────── */
  resetAutoSlide();
  animate();

})();
