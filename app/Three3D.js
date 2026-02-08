'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Three3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 3;

    // Create rotating wand
    const wandGroup = new THREE.Group();
    
    // Wand handle
    const handleGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 16);
    const handleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      shininess: 30
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.z = 0;
    wandGroup.add(handle);

    // Wand tip
    const tipGeometry = new THREE.ConeGeometry(0.05, 0.4, 8);
    const tipMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700,
      shininess: 100
    });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.z = 0.6;
    wandGroup.add(tip);

    // Magic sparkles from wand tip
    const sparklesGeometry = new THREE.BufferGeometry();
    const sparklesCount = 150;
    const positions = new Float32Array(sparklesCount * 3);
    
    for (let i = 0; i < sparklesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3;
      positions[i + 1] = (Math.random() - 0.5) * 3;
      positions[i + 2] = (Math.random() - 0.5) * 3;
    }
    
    sparklesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sparklesMaterial = new THREE.PointsMaterial({ 
      size: 0.05, 
      color: 0xFF69B4,
      sizeAttenuation: true
    });
    const sparkles = new THREE.Points(sparklesGeometry, sparklesMaterial);
    wandGroup.add(sparkles);

    scene.add(wandGroup);

    // Create Hogwarts Castle in background
    const castleGroup = new THREE.Group();
    castleGroup.position.z = -8;
    castleGroup.position.y = -0.5;

    // Main castle body
    const mainBodyGeometry = new THREE.BoxGeometry(3, 2.5, 1.5);
    const castleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2a2a2a,
      shininess: 20
    });
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x4a3728 });
    const mainBody = new THREE.Mesh(mainBodyGeometry, castleMaterial);
    castleGroup.add(mainBody);

    // Function to create a tower
    const createTower = (x, y, z) => {
      const towerGroup = new THREE.Group();
      
      // Tower body
      const towerBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.4, 3, 8),
        castleMaterial
      );
      towerBody.position.y = y;
      towerGroup.add(towerBody);

      // Tower roof - cone
      const roofGeometry = new THREE.ConeGeometry(0.45, 0.8, 8);
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = y + 1.8;
      towerGroup.add(roof);

      // Small windows
      for (let i = 0; i < 4; i++) {
        const windowGeometry = new THREE.PlaneGeometry(0.15, 0.15);
        const windowMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xffeb3b,
          emissive: 0xffeb3b,
          emissiveIntensity: 0.6
        });
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.z = 0.25;
        window.position.y = y - 0.3 + (i * 0.5);
        towerGroup.add(window);
      }

      towerGroup.position.set(x, 0, z);
      return towerGroup;
    };

    // Add towers around the castle
    castleGroup.add(createTower(-1.8, 0.2, -0.5));  // Front left
    castleGroup.add(createTower(1.8, 0.2, -0.5));   // Front right
    castleGroup.add(createTower(-1.8, 0, 0.5));     // Back left
    castleGroup.add(createTower(1.8, 0, 0.5));      // Back right
    castleGroup.add(createTower(0, 0.5, -1.2));     // Center front (taller)

    // Add middle towers - shorter
    castleGroup.add(createTower(-0.9, -0.1, -0.3));
    castleGroup.add(createTower(0.9, -0.1, -0.3));

    // Main central tower - tallest
    const centralTowerGroup = new THREE.Group();
    const centralTower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.35, 3.5, 8),
      castleMaterial
    );
    centralTower.position.y = 0.25;
    centralTowerGroup.add(centralTower);

    const centralRoof = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1, 8),
      roofMaterial
    );
    centralRoof.position.y = 2.3;
    centralTowerGroup.add(centralRoof);

    // Windows for central tower
    for (let i = 0; i < 5; i++) {
      const windowGeometry = new THREE.PlaneGeometry(0.12, 0.12);
      const windowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffeb3b,
        emissive: 0xffeb3b,
        emissiveIntensity: 0.6
      });
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.z = 0.22;
      window.position.y = -0.4 + (i * 0.45);
      centralTowerGroup.add(window);
    }

    centralTowerGroup.position.set(0, 0.1, 0);
    castleGroup.add(centralTowerGroup);

    // Add walls between towers
    const wallGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.2);
    const wallPositions = [
      [-1.2, 0, -0.4],
      [1.2, 0, -0.4],
      [0, 0, 0.2]
    ];

    wallPositions.forEach(pos => {
      const wall = new THREE.Mesh(wallGeometry, castleMaterial);
      wall.position.set(pos[0], pos[1], pos[2]);
      castleGroup.add(wall);
    });

    scene.add(castleGroup);

    // Create flying witches/wizards on broomsticks
    const broomRiders = [];
    const createBroomRider = (startX, startY, startZ) => {
      const riderGroup = new THREE.Group();
      
      // Broomstick
      const broomHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8),
        new THREE.MeshPhongMaterial({ color: 0x8B4513, shininess: 20 })
      );
      broomHandle.rotation.z = Math.PI / 4;
      riderGroup.add(broomHandle);

      // Broomstraw
      const broomStraw = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.08, 0.05),
        new THREE.MeshPhongMaterial({ color: 0xDAA520, shininess: 10 })
      );
      broomStraw.position.set(0.1, -0.25, 0);
      broomStraw.rotation.z = Math.PI / 4;
      riderGroup.add(broomStraw);

      // Wizard/Witch body (simple)
      const bodyGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: Math.random() > 0.5 ? 0x8B0000 : 0x4B0082,
        shininess: 30
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.15;
      riderGroup.add(body);

      // Hat (cone)
      const hatGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
      const hatMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
      const hat = new THREE.Mesh(hatGeometry, hatMaterial);
      hat.position.set(0, 0.35, 0);
      riderGroup.add(hat);

      // Robe/dress (torus or cone)
      const robeGeometry = new THREE.ConeGeometry(0.12, 0.2, 8);
      const robeMaterial = new THREE.MeshPhongMaterial({ 
        color: Math.random() > 0.5 ? 0x228B22 : 0xFF1493,
        opacity: 0.9,
        transparent: true
      });
      const robe = new THREE.Mesh(robeGeometry, robeMaterial);
      robe.position.y = 0.05;
      riderGroup.add(robe);

      riderGroup.position.set(startX, startY, startZ);
      
      return {
        group: riderGroup,
        orbitRadius: Math.sqrt(startX * startX + startZ * startZ),
        orbitSpeed: 0.3 + Math.random() * 0.4,
        angle: Math.atan2(startZ, startX),
        verticalSpeed: (Math.random() - 0.5) * 0.05,
        verticalPos: startY
      };
    };

    // Create multiple broomstick riders orbiting the castle
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 3 + Math.random() * 1;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 1 + Math.random() * 1;
      
      const rider = createBroomRider(x, y, z);
      broomRiders.push(rider);
      scene.add(rider.group);
    }

    const hearts = [];
    for (let i = 0; i < 15; i++) {
      const heartGroup = new THREE.Group();
      
      // Simple heart shape using geometry
      const heartShape = new THREE.Shape();
      const x = 0, y = 0;
      heartShape.moveTo(x + 5, y + 5);
      heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y + 0, x + 0, y + 0);
      heartShape.bezierCurveTo(x - 6, y + 0, x - 6, y + 7, x - 6, y + 7);
      heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
      heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
      heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y + 0, x + 9, y + 0);
      heartShape.bezierCurveTo(x + 5, y + 0, x + 5, y + 5, x + 5, y + 5);

      const geometry = new THREE.ShapeGeometry(heartShape);
      geometry.scale(0.04, 0.04, 0.04);
      geometry.center();

      const material = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 1, 0.6),
        emissive: new THREE.Color().setHSL(Math.random(), 1, 0.3),
        shininess: 100
      });
      
      const heart = new THREE.Mesh(geometry, material);
      heart.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      heart.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      
      hearts.push({
        mesh: heart,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        speedZ: (Math.random() - 0.5) * 0.02,
        rotX: (Math.random() - 0.5) * 0.03,
        rotY: (Math.random() - 0.5) * 0.03
      });
      
      wandGroup.add(heart);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xFF69B4, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFFD700, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate wand
      wandGroup.rotation.x += 0.005;
      wandGroup.rotation.y += 0.008;

      // Subtle castle rotation for atmosphere
      castleGroup.rotation.y += 0.0008;

      // Update sparkles
      const positionAttribute = sparklesGeometry.getAttribute('position');
      const positions = positionAttribute.array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.1;
        positions[i + 1] += (Math.random() - 0.5) * 0.1;
        positions[i + 2] += (Math.random() - 0.5) * 0.1;

        // Reset if too far
        if (Math.abs(positions[i]) > 3) positions[i] = (Math.random() - 0.5) * 0.5;
        if (Math.abs(positions[i + 1]) > 3) positions[i + 1] = (Math.random() - 0.5) * 0.5;
        if (Math.abs(positions[i + 2]) > 3) positions[i + 2] = (Math.random() - 0.5) * 0.5;
      }
      positionAttribute.needsUpdate = true;

      // Update hearts
      hearts.forEach(heart => {
        heart.mesh.position.x += heart.speedX;
        heart.mesh.position.y += heart.speedY;
        heart.mesh.position.z += heart.speedZ;
        heart.mesh.rotation.x += heart.rotX;
        heart.mesh.rotation.y += heart.rotY;

        // Bounce off walls
        if (Math.abs(heart.mesh.position.x) > 3) heart.speedX *= -1;
        if (Math.abs(heart.mesh.position.y) > 3) heart.speedY *= -1;
        if (Math.abs(heart.mesh.position.z) > 3) heart.speedZ *= -1;
      });

      // Update broomstick riders - orbit around castle
      broomRiders.forEach(rider => {
        rider.angle += rider.orbitSpeed * 0.01;
        const x = Math.cos(rider.angle) * rider.orbitRadius;
        const z = Math.sin(rider.angle) * rider.orbitRadius;
        
        // Vertical bobbing motion
        rider.verticalPos += rider.verticalSpeed;
        if (rider.verticalPos > 2 || rider.verticalPos < 0.5) {
          rider.verticalSpeed *= -1;
        }

        rider.group.position.x = x;
        rider.group.position.y = rider.verticalPos;
        rider.group.position.z = z;

        // Face direction of movement
        rider.group.rotation.z = rider.angle;
        rider.group.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Dispose geometries
      handleGeometry.dispose();
      tipGeometry.dispose();
      sparklesGeometry.dispose();
      mainBodyGeometry.dispose();
      
      // Dispose materials
      castleMaterial.dispose();
      roofMaterial.dispose();
      tipMaterial.dispose();
      sparklesMaterial.dispose();
      
      // Dispose hearts
      hearts.forEach(h => {
        h.mesh.geometry.dispose();
        h.mesh.material.dispose();
      });

      // Dispose broomstick riders
      broomRiders.forEach(rider => {
        rider.group.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(180deg, #0f1220 0%, #121829 45%, #090b13 100%)'
      }}
    />
  );
}
