"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type ViewMode = "explore" | "orbit" | "gravity";

type Planet = {
  key: string;
  name: string;
  english: string;
  color: string;
  accent: string;
  distance: number;
  radius: number;
  period: number;
  day: string;
  temp: string;
  moons: number;
  fact: string;
  kind: string;
  realDistance: string;
  gravity: string;
  tilt: number;
};

const PLANETS: Planet[] = [
  {
    key: "mercury",
    name: "ดาวพุธ",
    english: "MERCURY",
    color: "#b9a58e",
    accent: "#e8c49b",
    distance: 8,
    radius: 0.42,
    period: 88,
    day: "59 วันโลก",
    temp: "167°C",
    moons: 0,
    fact: "ดาวเคราะห์ที่เล็กที่สุด และวิ่งรอบดวงอาทิตย์เร็วที่สุด",
    kind: "ดาวเคราะห์หิน",
    realDistance: "57.9 ล้าน กม.",
    gravity: "0.38 เท่าของโลก",
    tilt: 0.03,
  },
  {
    key: "venus",
    name: "ดาวศุกร์",
    english: "VENUS",
    color: "#d9a656",
    accent: "#ffd58b",
    distance: 11,
    radius: 0.72,
    period: 225,
    day: "243 วันโลก",
    temp: "464°C",
    moons: 0,
    fact: "ดาวเคราะห์ที่ร้อนที่สุด เพราะชั้นบรรยากาศกักเก็บความร้อน",
    kind: "ดาวเคราะห์หิน",
    realDistance: "108.2 ล้าน กม.",
    gravity: "0.90 เท่าของโลก",
    tilt: 177.4,
  },
  {
    key: "earth",
    name: "โลก",
    english: "EARTH",
    color: "#277cd8",
    accent: "#61b9ff",
    distance: 15,
    radius: 0.78,
    period: 365,
    day: "24 ชั่วโมง",
    temp: "15°C",
    moons: 1,
    fact: "บ้านของเรา และเป็นดาวดวงเดียวที่รู้ว่ามีสิ่งมีชีวิต",
    kind: "ดาวเคราะห์หิน",
    realDistance: "149.6 ล้าน กม.",
    gravity: "1.00 เท่า",
    tilt: 23.4,
  },
  {
    key: "mars",
    name: "ดาวอังคาร",
    english: "MARS",
    color: "#b95131",
    accent: "#ff8c62",
    distance: 19,
    radius: 0.58,
    period: 687,
    day: "24.6 ชั่วโมง",
    temp: "−63°C",
    moons: 2,
    fact: "ดาวเคราะห์สีแดง มีภูเขาไฟที่สูงที่สุดในระบบสุริยะ",
    kind: "ดาวเคราะห์หิน",
    realDistance: "227.9 ล้าน กม.",
    gravity: "0.38 เท่าของโลก",
    tilt: 25.2,
  },
  {
    key: "jupiter",
    name: "ดาวพฤหัสบดี",
    english: "JUPITER",
    color: "#b98f6b",
    accent: "#f3c18e",
    distance: 25,
    radius: 1.72,
    period: 4333,
    day: "9.9 ชั่วโมง",
    temp: "−110°C",
    moons: 95,
    fact: "ดาวเคราะห์ที่ใหญ่ที่สุด มีพายุจุดแดงยักษ์ใหญ่กว่าโลก",
    kind: "ดาวแก๊สยักษ์",
    realDistance: "778.5 ล้าน กม.",
    gravity: "2.53 เท่าของโลก",
    tilt: 3.1,
  },
  {
    key: "saturn",
    name: "ดาวเสาร์",
    english: "SATURN",
    color: "#d6bd77",
    accent: "#ffe5a4",
    distance: 32,
    radius: 1.48,
    period: 10759,
    day: "10.7 ชั่วโมง",
    temp: "−140°C",
    moons: 146,
    fact: "วงแหวนเกิดจากก้อนน้ำแข็งและหินนับล้านชิ้น",
    kind: "ดาวแก๊สยักษ์",
    realDistance: "1,434 ล้าน กม.",
    gravity: "1.07 เท่าของโลก",
    tilt: 26.7,
  },
  {
    key: "uranus",
    name: "ดาวยูเรนัส",
    english: "URANUS",
    color: "#72c8d7",
    accent: "#adf1f7",
    distance: 39,
    radius: 1.08,
    period: 30687,
    day: "17.2 ชั่วโมง",
    temp: "−195°C",
    moons: 28,
    fact: "หมุนตะแคงข้างราวกับลูกบอลกลิ้งไปตามวงโคจร",
    kind: "ดาวน้ำแข็งยักษ์",
    realDistance: "2,871 ล้าน กม.",
    gravity: "0.89 เท่าของโลก",
    tilt: 97.8,
  },
  {
    key: "neptune",
    name: "ดาวเนปจูน",
    english: "NEPTUNE",
    color: "#3158c9",
    accent: "#7197ff",
    distance: 46,
    radius: 1.04,
    period: 60190,
    day: "16.1 ชั่วโมง",
    temp: "−200°C",
    moons: 16,
    fact: "มีลมพายุเร็วที่สุดในระบบสุริยะ มากกว่า 2,000 กม./ชม.",
    kind: "ดาวน้ำแข็งยักษ์",
    realDistance: "4,495 ล้าน กม.",
    gravity: "1.14 เท่าของโลก",
    tilt: 28.3,
  },
];

const STAR_NAMES = ["ORION", "SIRIUS", "POLARIS", "BETELGEUSE"];

function formatPeriod(days: number) {
  if (days < 1000) return `${days.toLocaleString("th-TH")} วัน`;
  return `${(days / 365.25).toFixed(1)} ปี`;
}

function MiniPlanet({ planet, active }: { planet: Planet; active: boolean }) {
  return (
    <span
      className={`mini-planet ${active ? "active" : ""}`}
      style={{
        background: `radial-gradient(circle at 32% 28%, ${planet.accent}, ${planet.color} 54%, #121b34 120%)`,
        boxShadow: active ? `0 0 18px ${planet.accent}88` : undefined,
      }}
    />
  );
}

function Icon({ name }: { name: "orbit" | "gravity" | "info" | "view" }) {
  if (name === "orbit") return <span className="ui-icon orbit-icon">●</span>;
  if (name === "gravity") return <span className="ui-icon gravity-icon">↙</span>;
  if (name === "view") return <span className="ui-icon">◎</span>;
  return <span className="ui-icon info-icon">i</span>;
}

export default function SolarSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneApi = useRef<{
    reset: () => void;
    zoom: (delta: number) => void;
    focus: (key: string) => void;
  } | null>(null);
  const selectedRef = useRef("earth");
  const pausedRef = useRef(false);
  const speedRef = useRef(1);
  const gravityRef = useRef(false);
  const orbitRef = useRef(true);

  const [selected, setSelected] = useState("earth");
  const [mode, setMode] = useState<ViewMode>("explore");
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showGravity, setShowGravity] = useState(false);
  const [labels, setLabels] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [tipOpen, setTipOpen] = useState(true);
  const [simDays, setSimDays] = useState(0);

  const activePlanet = useMemo(
    () => PLANETS.find((p) => p.key === selected) ?? PLANETS[2],
    [selected],
  );

  useEffect(() => {
    selectedRef.current = selected;
    sceneApi.current?.focus(selected);
  }, [selected]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    gravityRef.current = showGravity;
  }, [showGravity]);

  useEffect(() => {
    orbitRef.current = showOrbits;
  }, [showOrbits]);

  const chooseMode = useCallback((next: ViewMode) => {
    setMode(next);
    if (next === "orbit") {
      setShowOrbits(true);
      setShowGravity(false);
    } else if (next === "gravity") {
      setShowGravity(true);
      setShowOrbits(true);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050a18, 0.0065);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);

    let yaw = -0.45;
    let pitch = 0.93;
    let cameraDistance = 62;
    let targetDistance = 62;
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    const targetLook = new THREE.Vector3(0, 0, 0);

    const ambient = new THREE.AmbientLight(0x4c6090, 0.52);
    scene.add(ambient);
    const sunLight = new THREE.PointLight(0xffd49b, 900, 120, 1.55);
    scene.add(sunLight);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1650 * 3);
    const starColors = new Float32Array(1650 * 3);
    for (let i = 0; i < 1650; i += 1) {
      const radius = 65 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi) * 0.55;
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const tone = 0.62 + Math.random() * 0.38;
      starColors[i * 3] = tone * (Math.random() > 0.8 ? 0.7 : 1);
      starColors[i * 3 + 1] = tone * (Math.random() > 0.82 ? 0.82 : 1);
      starColors[i * 3 + 2] = tone;
    }
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    starGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(starColors, 3),
    );
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.78,
        sizeAttenuation: true,
      }),
    );
    scene.add(stars);

    const grid = new THREE.PolarGridHelper(52, 16, 8, 96, 0x2f5b79, 0x16334f);
    grid.material.transparent = true;
    grid.material.opacity = 0.14;
    grid.position.y = -0.06;
    scene.add(grid);

    const sunGroup = new THREE.Group();
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(3.25, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0xffa92d }),
    );
    sun.userData.key = "sun";
    sunGroup.add(sun);
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(3.75, 32, 24),
      new THREE.MeshBasicMaterial({
        color: 0xff7a18,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
      }),
    );
    sunGroup.add(glow);
    scene.add(sunGroup);

    const orbitLines: THREE.LineLoop[] = [];
    const gravityLines: THREE.Line[] = [];
    const planetMeshes = new Map<string, THREE.Mesh>();
    const planetGroups = new Map<string, THREE.Group>();
    const selectable: THREE.Object3D[] = [sun];

    PLANETS.forEach((planet, index) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 160; i += 1) {
        const a = (i / 160) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(a) * planet.distance,
            0,
            Math.sin(a) * planet.distance * 0.97,
          ),
        );
      }
      const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: index === 2 ? 0x70b7e6 : 0x4d7190,
          transparent: true,
          opacity: index === 2 ? 0.48 : 0.27,
        }),
      );
      orbitLines.push(orbit);
      scene.add(orbit);

      const group = new THREE.Group();
      const geometry = new THREE.SphereGeometry(planet.radius, 36, 24);
      const material = new THREE.MeshStandardMaterial({
        color: planet.color,
        roughness: 0.78,
        metalness: 0.02,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = THREE.MathUtils.degToRad(planet.tilt);
      mesh.userData.key = planet.key;
      mesh.castShadow = false;
      group.add(mesh);

      if (planet.key === "earth") {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(planet.radius * 1.025, 28, 18),
          new THREE.MeshStandardMaterial({
            color: 0xddefff,
            transparent: true,
            opacity: 0.13,
            roughness: 0.9,
          }),
        );
        group.add(clouds);
      }

      if (planet.key === "saturn") {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(planet.radius * 1.35, planet.radius * 2.18, 72),
          new THREE.MeshBasicMaterial({
            color: 0xcbb17a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.64,
          }),
        );
        ring.rotation.x = Math.PI / 2.25;
        group.add(ring);
      }

      const selectionRing = new THREE.Mesh(
        new THREE.RingGeometry(
          planet.radius * 1.42,
          planet.radius * 1.49,
          48,
        ),
        new THREE.MeshBasicMaterial({
          color: planet.accent,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
        }),
      );
      selectionRing.rotation.x = Math.PI / 2;
      selectionRing.userData.selectionRing = true;
      group.add(selectionRing);

      const forceGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]);
      const forceLine = new THREE.Line(
        forceGeometry,
        new THREE.LineBasicMaterial({
          color: index < 4 ? 0x71d3ff : 0x74a8ff,
          transparent: true,
          opacity: 0,
        }),
      );
      gravityLines.push(forceLine);
      scene.add(forceLine);
      planetMeshes.set(planet.key, mesh);
      planetGroups.set(planet.key, group);
      selectable.push(mesh);
      scene.add(group);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let pointerMoved = false;
    let startX = 0;
    let startY = 0;
    let startYaw = 0;
    let startPitch = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerMoved = false;
      startX = event.clientX;
      startY = event.clientY;
      startYaw = yaw;
      startPitch = pitch;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 5) pointerMoved = true;
      yaw = startYaw - dx * 0.005;
      pitch = THREE.MathUtils.clamp(startPitch + dy * 0.004, 0.25, 1.43);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (!pointerMoved) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(selectable, false)[0];
        const key = hit?.object.userData.key as string | undefined;
        if (key && key !== "sun") {
          setSelected(key);
          setPanelOpen(true);
        }
      }
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      targetDistance = THREE.MathUtils.clamp(
        targetDistance + event.deltaY * 0.028,
        22,
        92,
      );
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resize);
    resize();

    sceneApi.current = {
      reset: () => {
        yaw = -0.45;
        pitch = 0.93;
        targetDistance = 62;
        targetLook.set(0, 0, 0);
      },
      zoom: (delta: number) => {
        targetDistance = THREE.MathUtils.clamp(
          targetDistance + delta,
          22,
          92,
        );
      },
      focus: (key: string) => {
        const planet = PLANETS.find((item) => item.key === key);
        if (planet) targetDistance = Math.max(26, planet.distance + 17);
      },
    };

    const clock = new THREE.Clock();
    let elapsedDays = 0;
    let lastUiUpdate = 0;
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!pausedRef.current) elapsedDays += dt * 32 * speedRef.current;

      PLANETS.forEach((planet, index) => {
        const angle =
          (elapsedDays / planet.period) * Math.PI * 2 + index * 0.72 + 0.2;
        const x = Math.cos(angle) * planet.distance;
        const z = Math.sin(angle) * planet.distance * 0.97;
        const group = planetGroups.get(planet.key);
        const mesh = planetMeshes.get(planet.key);
        if (!group || !mesh) return;
        group.position.set(x, 0, z);
        mesh.rotation.y += dt * (0.35 + 0.7 / Math.max(planet.radius, 0.5));

        const selectionRing = group.children.find(
          (child) => child.userData.selectionRing,
        ) as THREE.Mesh | undefined;
        if (selectionRing) {
          const mat = selectionRing.material as THREE.MeshBasicMaterial;
          mat.opacity = selectedRef.current === planet.key ? 0.92 : 0;
          selectionRing.rotation.z += dt * 0.45;
        }

        const line = gravityLines[index];
        const positions = line.geometry.attributes.position as THREE.BufferAttribute;
        positions.setXYZ(0, 0, 0.08, 0);
        positions.setXYZ(1, x, 0.08, z);
        positions.needsUpdate = true;
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = gravityRef.current
          ? selectedRef.current === planet.key
            ? 0.82
            : 0.16
          : 0;
      });

      orbitLines.forEach((line, index) => {
        const mat = line.material as THREE.LineBasicMaterial;
        const key = PLANETS[index].key;
        mat.opacity = orbitRef.current
          ? selectedRef.current === key
            ? 0.78
            : 0.22
          : 0;
      });

      sun.rotation.y += dt * 0.12;
      glow.scale.setScalar(1 + Math.sin(elapsedDays * 0.02) * 0.018);
      stars.rotation.y += dt * 0.002;

      const focused = planetGroups.get(selectedRef.current);
      if (focused && targetDistance < 52) {
        targetLook.lerp(focused.position, 0.025);
      } else {
        targetLook.lerp(cameraTarget, 0.025);
      }
      cameraDistance = THREE.MathUtils.lerp(cameraDistance, targetDistance, 0.08);
      camera.position.set(
        targetLook.x + Math.cos(yaw) * Math.sin(pitch) * cameraDistance,
        targetLook.y + Math.cos(pitch) * cameraDistance,
        targetLook.z + Math.sin(yaw) * Math.sin(pitch) * cameraDistance,
      );
      camera.lookAt(targetLook);
      renderer.render(scene, camera);

      if (performance.now() - lastUiUpdate > 600) {
        setSimDays(Math.floor(elapsedDays));
        lastUiUpdate = performance.now();
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });
      sceneApi.current = null;
    };
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          type="button"
          onClick={() => sceneApi.current?.reset()}
          aria-label="กลับสู่ภาพรวมระบบสุริยะ"
        >
          <span className="brand-mark">
            <span className="brand-core" />
            <span className="brand-orbit one" />
            <span className="brand-orbit two" />
          </span>
          <span>
            <strong>ORBIT LAB</strong>
            <small>ห้องทดลองระบบสุริยะ</small>
          </span>
        </button>

        <nav className="mode-switch" aria-label="โหมดการเรียนรู้">
          <button
            className={mode === "explore" ? "active" : ""}
            onClick={() => chooseMode("explore")}
            type="button"
          >
            <Icon name="view" /> สำรวจ
          </button>
          <button
            className={mode === "orbit" ? "active" : ""}
            onClick={() => chooseMode("orbit")}
            type="button"
          >
            <Icon name="orbit" /> วงโคจร
          </button>
          <button
            className={mode === "gravity" ? "active" : ""}
            onClick={() => chooseMode("gravity")}
            type="button"
          >
            <Icon name="gravity" /> แรงโน้มถ่วง
          </button>
        </nav>

        <div className="header-actions">
          <span className="level-pill">ระดับประถม</span>
          <button
            type="button"
            className="round-button help"
            onClick={() => setTipOpen((value) => !value)}
            aria-label="วิธีใช้งาน"
          >
            ?
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className={`side-panel ${panelOpen ? "open" : ""}`}>
          <button
            className="mobile-close"
            type="button"
            onClick={() => setPanelOpen(false)}
            aria-label="ปิดแผงข้อมูล"
          >
            ×
          </button>
          <div className="panel-heading">
            <p className="eyebrow">CELESTIAL BODIES</p>
            <h1>เพื่อนบ้านของเรา</h1>
            <p>เลือกดาวเพื่อเริ่มออกสำรวจ</p>
          </div>

          <div className="planet-list">
            {PLANETS.map((planet, index) => (
              <button
                key={planet.key}
                type="button"
                className={`planet-item ${selected === planet.key ? "active" : ""}`}
                onClick={() => setSelected(planet.key)}
              >
                <span className="planet-index">{index + 1}</span>
                <MiniPlanet planet={planet} active={selected === planet.key} />
                <span className="planet-copy">
                  <strong>{planet.name}</strong>
                  <small>{planet.english}</small>
                </span>
                <span className="planet-chevron">›</span>
              </button>
            ))}
          </div>

          <div className="sun-note">
            <span className="sun-dot" />
            <span>
              <strong>ดวงอาทิตย์</strong>
              <small>หัวใจของระบบสุริยะ</small>
            </span>
            <span className="sun-stat">99.8%</span>
          </div>
          <p className="sun-caption">
            มวลเกือบทั้งหมดในระบบสุริยะอยู่ที่ดวงอาทิตย์
          </p>
        </aside>

        <div className="scene-stage">
          <canvas
            ref={canvasRef}
            className="space-canvas"
            aria-label="แบบจำลองระบบสุริยะสามมิติ ลากเพื่อหมุน เลื่อนเพื่อซูม และแตะดาวเพื่อดูข้อมูล"
          />

          <div className="scene-title">
            <p>THE SOLAR SYSTEM</p>
            <h2>ระบบสุริยะของเรา</h2>
            <span>ลากเพื่อหมุน • เลื่อนเพื่อซูม • แตะดาวเพื่อสำรวจ</span>
          </div>

          <div className="filter-bar" aria-label="ตัวกรองการแสดงผล">
            <button
              type="button"
              className={showOrbits ? "active" : ""}
              onClick={() => setShowOrbits((value) => !value)}
            >
              <span className="filter-symbol">◌</span>
              เส้นวงโคจร
            </button>
            <button
              type="button"
              className={showGravity ? "active gravity" : ""}
              onClick={() => {
                setShowGravity((value) => !value);
                if (!showGravity) setMode("gravity");
              }}
            >
              <span className="filter-symbol">↘</span>
              แรงโน้มถ่วง
            </button>
            <button
              type="button"
              className={labels ? "active" : ""}
              onClick={() => setLabels((value) => !value)}
            >
              <span className="filter-symbol">Aa</span>
              ชื่อดาว
            </button>
          </div>

          {labels && (
            <div className="selected-label">
              <span
                className="label-dot"
                style={{ background: activePlanet.accent }}
              />
              {activePlanet.name}
            </div>
          )}

          {showGravity && (
            <div className="gravity-legend">
              <strong>
                <span className="pulse-dot" /> แรงดึงดูดกำลังทำงาน
              </strong>
              <span>
                ดวงอาทิตย์ดึงดาวทุกดวงไว้ จึงเคลื่อนที่เป็นวงโคจร
              </span>
            </div>
          )}

          <div className="zoom-controls">
            <button
              type="button"
              onClick={() => sceneApi.current?.zoom(-8)}
              aria-label="ซูมเข้า"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => sceneApi.current?.zoom(8)}
              aria-label="ซูมออก"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => sceneApi.current?.reset()}
              aria-label="กลับสู่มุมมองเริ่มต้น"
            >
              ↺
            </button>
          </div>

          <article className="info-card" style={{ "--accent": activePlanet.accent } as React.CSSProperties}>
            <div className="card-topline">
              <div>
                <span className="planet-type">{activePlanet.kind}</span>
                <h3>{activePlanet.name}</h3>
                <p>{activePlanet.english}</p>
              </div>
              <span className="selected-planet-visual">
                <MiniPlanet planet={activePlanet} active />
              </span>
            </div>
            <p className="planet-fact">“{activePlanet.fact}”</p>
            <div className="stat-grid">
              <div>
                <span>ระยะจากดวงอาทิตย์</span>
                <strong>{activePlanet.realDistance}</strong>
              </div>
              <div>
                <span>เวลาโคจรรอบดวงอาทิตย์</span>
                <strong>{formatPeriod(activePlanet.period)}</strong>
              </div>
              <div>
                <span>หนึ่งวันยาวนาน</span>
                <strong>{activePlanet.day}</strong>
              </div>
              <div>
                <span>อุณหภูมิเฉลี่ย</span>
                <strong>{activePlanet.temp}</strong>
              </div>
            </div>
            <div className="card-footer">
              <span>ดวงจันทร์บริวาร</span>
              <strong>{activePlanet.moons} ดวง</strong>
              <span className="gravity-copy">
                แรงโน้มถ่วง {activePlanet.gravity}
              </span>
            </div>
          </article>

          <button
            className="mobile-planets"
            type="button"
            onClick={() => setPanelOpen(true)}
          >
            <MiniPlanet planet={activePlanet} active />
            เลือกดาว
          </button>

          {tipOpen && (
            <div className="learn-tip">
              <button
                type="button"
                onClick={() => setTipOpen(false)}
                aria-label="ปิดเกร็ดความรู้"
              >
                ×
              </button>
              <span className="bulb">✦</span>
              <div>
                <strong>
                  รู้หรือไม่? วงโคจรไม่ใช่วงกลมสมบูรณ์
                </strong>
                <p>
                  ดาวเคราะห์เดินทางเป็นวงรี และเคลื่อนที่เร็วขึ้นเมื่ออยู่ใกล้ดวงอาทิตย์
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="simulation-bar">
        <button
          type="button"
          className={`play-button ${paused ? "paused" : ""}`}
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "เล่นการจำลอง" : "หยุดการจำลอง"}
        >
          {paused ? "▶" : "Ⅱ"}
        </button>
        <div className="time-readout">
          <span>เวลาในการจำลอง</span>
          <strong>วันที่ {simDays.toLocaleString("th-TH")}</strong>
        </div>
        <div className="timeline">
          <span className="timeline-fill" style={{ width: `${(simDays % 365) / 3.65}%` }} />
          <span className="timeline-knob" style={{ left: `${(simDays % 365) / 3.65}%` }} />
        </div>
        <div className="speed-control">
          <span>ความเร็ว</span>
          {[0.5, 1, 5, 20].map((value) => (
            <button
              type="button"
              key={value}
              className={speed === value ? "active" : ""}
              onClick={() => setSpeed(value)}
            >
              {value}×
            </button>
          ))}
        </div>
        <div className="star-coordinates" aria-hidden="true">
          <span>{STAR_NAMES[simDays % STAR_NAMES.length]}</span>
          <strong>RA 18h 36m • DEC +38°</strong>
        </div>
      </footer>
    </main>
  );
}
