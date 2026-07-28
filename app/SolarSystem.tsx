"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type ViewMode = "explore" | "orbit" | "gravity";
type DistanceMode = "compact" | "real";

type MoonFact = {
  name: string;
  english: string;
  diameter: string;
  orbit: string;
  tag: string;
  fact: string;
  color: string;
};

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
  realAu: number;
  majorMoons: string[];
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
    realAu: 0.387,
    majorMoons: [],
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
    realAu: 0.723,
    majorMoons: [],
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
    realAu: 1,
    majorMoons: ["ดวงจันทร์"],
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
    realAu: 1.524,
    majorMoons: ["โฟบอส", "ดีมอส"],
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
    moons: 101,
    fact: "ดาวเคราะห์ที่ใหญ่ที่สุด มีพายุจุดแดงยักษ์ใหญ่กว่าโลก",
    kind: "ดาวแก๊สยักษ์",
    realDistance: "778.5 ล้าน กม.",
    gravity: "2.53 เท่าของโลก",
    tilt: 3.1,
    realAu: 5.203,
    majorMoons: ["ไอโอ", "ยูโรปา", "แกนีมีด", "คัลลิสโต"],
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
    moons: 274,
    fact: "วงแหวนเกิดจากก้อนน้ำแข็งและหินนับล้านชิ้น",
    kind: "ดาวแก๊สยักษ์",
    realDistance: "1,434 ล้าน กม.",
    gravity: "1.07 เท่าของโลก",
    tilt: 26.7,
    realAu: 9.537,
    majorMoons: ["ไททัน", "เอนเซลาดัส", "รีอา", "ไอแอพิตัส"],
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
    realAu: 19.191,
    majorMoons: ["มิแรนดา", "แอเรียล", "อัมเบรียล", "ไททาเนีย", "โอเบอรอน"],
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
    realAu: 30.07,
    majorMoons: ["ไทรทัน", "เนรีด", "โพรทีอุส"],
  },
];

const STAR_NAMES = ["ORION", "SIRIUS", "POLARIS", "BETELGEUSE"];

const FEATURED_MOONS: Record<string, MoonFact[]> = {
  earth: [
    {
      name: "ดวงจันทร์",
      english: "THE MOON",
      diameter: "3,475 กม.",
      orbit: "27.3 วัน",
      tag: "เพื่อนคู่โลก",
      fact: "ช่วยให้แกนหมุนของโลกมั่นคง และเป็นโลกอื่นเพียงแห่งเดียวที่มนุษย์เคยเดินทางไปถึง",
      color: "#c9d1d4",
    },
  ],
  mars: [
    {
      name: "โฟบอส",
      english: "PHOBOS",
      diameter: "ประมาณ 22 กม.",
      orbit: "7 ชม. 39 นาที",
      tag: "กำลังเข้าใกล้ดาวอังคาร",
      fact: "โคจรใกล้ดาวอังคารมากและค่อย ๆ ลดระดับลง ในอนาคตอาจแตกเป็นวงแหวน",
      color: "#a8947d",
    },
    {
      name: "ดีมอส",
      english: "DEIMOS",
      diameter: "ประมาณ 12 กม.",
      orbit: "30.3 ชั่วโมง",
      tag: "เล็กและอยู่ไกลกว่า",
      fact: "มีรูปร่างไม่กลม ผิวดูเรียบกว่าโฟบอสเพราะฝุ่นปกคลุมหลุมอุกกาบาต",
      color: "#b3a18e",
    },
  ],
  jupiter: [
    {
      name: "ไอโอ",
      english: "IO",
      diameter: "3,643 กม.",
      orbit: "1.8 วัน",
      tag: "ภูเขาไฟมากที่สุด",
      fact: "แรงดึงจากดาวพฤหัสบดีและดวงจันทร์ข้างเคียงบีบไอโอจนเกิดภูเขาไฟหลายร้อยแห่ง",
      color: "#e4b84f",
    },
    {
      name: "ยูโรปา",
      english: "EUROPA",
      diameter: "3,100 กม.",
      orbit: "3.5 วัน",
      tag: "มหาสมุทรใต้เปลือกน้ำแข็ง",
      fact: "ใต้ผิวน้ำแข็งอาจมีน้ำมากกว่ามหาสมุทรทั้งหมดบนโลก และอาจมีส่วนประกอบที่เหมาะต่อชีวิต",
      color: "#d9cbb2",
    },
    {
      name: "แกนีมีด",
      english: "GANYMEDE",
      diameter: "5,260 กม.",
      orbit: "7.2 วัน",
      tag: "ดวงจันทร์ใหญ่ที่สุด",
      fact: "ใหญ่กว่าดาวพุธ และเป็นดวงจันทร์เพียงดวงที่รู้ว่ามีสนามแม่เหล็กของตนเอง",
      color: "#a99b86",
    },
    {
      name: "คัลลิสโต",
      english: "CALLISTO",
      diameter: "4,821 กม.",
      orbit: "16.7 วัน",
      tag: "โลกแห่งหลุมอุกกาบาต",
      fact: "พื้นผิวมีหลุมอุกกาบาตหนาแน่นมาก และอาจซ่อนมหาสมุทรเค็มไว้ใต้พื้นผิว",
      color: "#75685d",
    },
  ],
  saturn: [
    {
      name: "ไททัน",
      english: "TITAN",
      diameter: "5,150 กม.",
      orbit: "15.9 วัน",
      tag: "มีทะเลสาบและบรรยากาศ",
      fact: "เป็นดวงจันทร์เดียวที่มีบรรยากาศหนาแน่น และมีแม่น้ำกับทะเลสาบมีเทนบนพื้นผิว",
      color: "#d9a851",
    },
    {
      name: "เอนเซลาดัส",
      english: "ENCELADUS",
      diameter: "504 กม.",
      orbit: "1.37 วัน",
      tag: "พ่นน้ำแข็งสู่อวกาศ",
      fact: "มีมหาสมุทรทั่วทั้งดวงอยู่ใต้เปลือกน้ำแข็ง และพ่นไอน้ำกับสารอินทรีย์ออกจากขั้วใต้",
      color: "#e8f2f5",
    },
    {
      name: "ไมมัส",
      english: "MIMAS",
      diameter: "396 กม.",
      orbit: "22.6 ชั่วโมง",
      tag: "หลุมเฮอร์เชลยักษ์",
      fact: "หลุมอุกกาบาตขนาดใหญ่ทำให้ไมมัสดูคล้ายสถานีอวกาศในภาพยนตร์",
      color: "#bfc4c5",
    },
  ],
  uranus: [
    {
      name: "มิแรนดา",
      english: "MIRANDA",
      diameter: "ประมาณ 500 กม.",
      orbit: "1.41 วัน",
      tag: "หน้าผาสูงและพื้นผิวแปลก",
      fact: "มีภูมิประเทศปะติดปะต่อและหน้าผาขนาดมหึมา ราวกับดวงจันทร์เคยแตกแล้วประกอบใหม่",
      color: "#b8c4c5",
    },
    {
      name: "ไททาเนีย",
      english: "TITANIA",
      diameter: "1,578 กม.",
      orbit: "8.7 วัน",
      tag: "ดวงใหญ่ที่สุดของยูเรนัส",
      fact: "มีหุบเขาและรอยเลื่อนยาว บอกว่าภายในอาจเคยขยายตัวและดันเปลือกน้ำแข็งให้แตก",
      color: "#a7b5b8",
    },
  ],
  neptune: [
    {
      name: "ไทรทัน",
      english: "TRITON",
      diameter: "2,700 กม.",
      orbit: "5.9 วัน",
      tag: "โคจรย้อนทาง",
      fact: "เป็นดวงจันทร์ขนาดใหญ่เพียงดวงที่โคจรสวนทางการหมุนของดาวแม่ และมีน้ำพุไนโตรเจนเย็นจัด",
      color: "#c9b7aa",
    },
  ],
};

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
    setDistanceMode: (mode: DistanceMode) => void;
  } | null>(null);
  const selectedRef = useRef("earth");
  const pausedRef = useRef(false);
  const speedRef = useRef(1);
  const gravityRef = useRef(false);
  const orbitRef = useRef(true);
  const distanceModeRef = useRef<DistanceMode>("compact");
  const moonsRef = useRef(true);
  const shadowsRef = useRef(true);

  const [selected, setSelected] = useState("earth");
  const [mode, setMode] = useState<ViewMode>("explore");
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showGravity, setShowGravity] = useState(false);
  const [labels, setLabels] = useState(true);
  const [showMoons, setShowMoons] = useState(true);
  const [distanceMode, setDistanceMode] =
    useState<DistanceMode>("compact");
  const [showShadows, setShowShadows] = useState(true);
  const [moonFactIndex, setMoonFactIndex] = useState(0);
  const [moonDetailsOpen, setMoonDetailsOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [tipOpen, setTipOpen] = useState(true);
  const [simDays, setSimDays] = useState(0);

  const activePlanet = useMemo(
    () => PLANETS.find((p) => p.key === selected) ?? PLANETS[2],
    [selected],
  );
  const activeMoonFacts = FEATURED_MOONS[selected] ?? [];
  const activeMoonFact =
    activeMoonFacts[Math.min(moonFactIndex, activeMoonFacts.length - 1)];

  useEffect(() => {
    selectedRef.current = selected;
    setMoonFactIndex(0);
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

  useEffect(() => {
    moonsRef.current = showMoons;
  }, [showMoons]);

  useEffect(() => {
    shadowsRef.current = showShadows;
  }, [showShadows]);

  useEffect(() => {
    distanceModeRef.current = distanceMode;
    sceneApi.current?.setDistanceMode(distanceMode);
  }, [distanceMode]);

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
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1400);

    let yaw = -0.45;
    let pitch = 0.93;
    let cameraDistance = 62;
    let targetDistance = 62;
    let focusPlanet = false;
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    const targetLook = new THREE.Vector3(0, 0, 0);

    const ambient = new THREE.AmbientLight(0x4c6090, 0.52);
    scene.add(ambient);
    const learningLight = new THREE.HemisphereLight(
      0xd9efff,
      0x26344d,
      0,
    );
    scene.add(learningLight);
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

    // This "rubber sheet" is an intentionally exaggerated 2D slice of curved
    // spacetime. It gives young learners a visual bridge to the 3D phenomenon.
    const spacetimeHeight = (radius: number) =>
      -8.4 / Math.pow(1 + Math.pow(radius / 7.2, 2), 0.72);
    const spacetimeGeometry = new THREE.PlaneGeometry(104, 104, 52, 52);
    const spacetimePositions = spacetimeGeometry.attributes
      .position as THREE.BufferAttribute;
    for (let i = 0; i < spacetimePositions.count; i += 1) {
      const x = spacetimePositions.getX(i);
      const z = spacetimePositions.getY(i);
      spacetimePositions.setZ(i, spacetimeHeight(Math.hypot(x, z)));
    }
    spacetimePositions.needsUpdate = true;
    spacetimeGeometry.computeVertexNormals();

    const spacetimeSurfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b5f8c,
      emissive: 0x062943,
      emissiveIntensity: 0.8,
      roughness: 0.84,
      metalness: 0,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const spacetimeWireMaterial = new THREE.MeshBasicMaterial({
      color: 0x48c7ff,
      transparent: true,
      opacity: 0,
      wireframe: true,
      depthWrite: false,
    });
    const spacetimeSurface = new THREE.Mesh(
      spacetimeGeometry,
      spacetimeSurfaceMaterial,
    );
    const spacetimeWire = new THREE.Mesh(
      spacetimeGeometry,
      spacetimeWireMaterial,
    );
    spacetimeSurface.rotation.x = -Math.PI / 2;
    spacetimeWire.rotation.x = -Math.PI / 2;
    spacetimeWire.position.y = 0.035;
    spacetimeSurface.renderOrder = 1;
    spacetimeWire.renderOrder = 2;
    scene.add(spacetimeSurface, spacetimeWire);

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
    const moonSystems = new Map<
      string,
      {
        mesh: THREE.InstancedMesh;
        phases: Float32Array;
        radii: Float32Array;
        speeds: Float32Array;
        tilts: Float32Array;
        sizes: Float32Array;
      }
    >();
    const selectable: THREE.Object3D[] = [sun];

    PLANETS.forEach((planet, index) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 160; i += 1) {
        const a = (i / 160) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(a),
            0,
            Math.sin(a) * 0.97,
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
      orbit.scale.setScalar(planet.distance);
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

      if (planet.moons > 0) {
        const moonGeometry = new THREE.SphereGeometry(0.075, 7, 5);
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: 0xb8c5cf,
          roughness: 0.92,
          metalness: 0,
        });
        const moonMesh = new THREE.InstancedMesh(
          moonGeometry,
          moonMaterial,
          planet.moons,
        );
        const phases = new Float32Array(planet.moons);
        const radii = new Float32Array(planet.moons);
        const speeds = new Float32Array(planet.moons);
        const tilts = new Float32Array(planet.moons);
        const sizes = new Float32Array(planet.moons);
        const color = new THREE.Color();

        for (let moonIndex = 0; moonIndex < planet.moons; moonIndex += 1) {
          const lane = moonIndex % 11;
          const family = Math.floor(moonIndex / 11);
          phases[moonIndex] =
            (moonIndex / Math.max(planet.moons, 1)) * Math.PI * 2 +
            lane * 0.31;
          radii[moonIndex] =
            planet.radius * 1.55 + 0.72 + lane * 0.2 + family * 0.026;
          speeds[moonIndex] = 0.006 + (moonIndex % 13) * 0.00075;
          tilts[moonIndex] =
            ((moonIndex % 7) - 3) * 0.055 +
            (family % 2 === 0 ? 0.035 : -0.035);
          sizes[moonIndex] =
            moonIndex < planet.majorMoons.length
              ? planet.key === "earth"
                ? 3.1
                : 1.65 + (moonIndex % 3) * 0.22
              : 0.55 + (moonIndex % 5) * 0.1;
          moonMesh.setColorAt(
            moonIndex,
            color.set(
              moonIndex < planet.majorMoons.length ? 0xe7d4b7 : 0x849aa9,
            ),
          );
        }
        moonMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        if (moonMesh.instanceColor) moonMesh.instanceColor.needsUpdate = true;
        moonMesh.frustumCulled = false;
        moonMesh.renderOrder = 4;
        moonSystems.set(planet.key, {
          mesh: moonMesh,
          phases,
          radii,
          speeds,
          tilts,
          sizes,
        });
        group.add(moonMesh);
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
        targetDistance = distanceModeRef.current === "real" ? 470 : 62;
        focusPlanet = false;
        targetLook.set(0, 0, 0);
      },
      zoom: (delta: number) => {
        const zoomStep = distanceModeRef.current === "real" ? delta * 5 : delta;
        targetDistance = THREE.MathUtils.clamp(
          targetDistance + zoomStep,
          22,
          distanceModeRef.current === "real" ? 680 : 92,
        );
      },
      focus: (key: string) => {
        const planet = PLANETS.find((item) => item.key === key);
        if (!planet) return;
        if (distanceModeRef.current === "real") {
          focusPlanet = true;
          targetDistance = Math.max(24, planet.radius * 7 + 18);
        } else {
          targetDistance = Math.max(26, planet.distance + 17);
          focusPlanet = targetDistance < 52;
        }
      },
      setDistanceMode: (nextMode: DistanceMode) => {
        focusPlanet = false;
        targetLook.set(0, 0, 0);
        targetDistance = nextMode === "real" ? 470 : 62;
      },
    };

    const clock = new THREE.Clock();
    let elapsedDays = 0;
    let lastUiUpdate = 0;
    let gravityMix = 0;
    let distanceMix = 0;
    const moonTransform = new THREE.Object3D();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!pausedRef.current) elapsedDays += dt * 32 * speedRef.current;
      gravityMix = THREE.MathUtils.lerp(
        gravityMix,
        gravityRef.current ? 1 : 0,
        0.065,
      );
      distanceMix = THREE.MathUtils.lerp(
        distanceMix,
        distanceModeRef.current === "real" ? 1 : 0,
        0.045,
      );
      const sheetScale = 1 + distanceMix * 7;
      spacetimeSurfaceMaterial.opacity = gravityMix * 0.1;
      spacetimeWireMaterial.opacity = gravityMix * 0.34;
      spacetimeSurface.scale.set(sheetScale, sheetScale, 1);
      spacetimeWire.scale.set(sheetScale, sheetScale, 1);
      grid.scale.set(sheetScale, 1, sheetScale);
      stars.scale.setScalar(1 + distanceMix * 3.4);
      (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp(
        0.0065,
        0.00075,
        distanceMix,
      );
      ambient.intensity = THREE.MathUtils.lerp(
        ambient.intensity,
        shadowsRef.current ? 0.52 : 1.35,
        0.08,
      );
      learningLight.intensity = THREE.MathUtils.lerp(
        learningLight.intensity,
        shadowsRef.current ? 0 : 1.75,
        0.08,
      );
      (grid.material as THREE.LineBasicMaterial).opacity =
        0.14 * (1 - gravityMix * 0.92);
      const sunY = -4.95 * gravityMix;
      sunGroup.position.y = sunY;
      sunLight.position.y = sunY;

      PLANETS.forEach((planet, index) => {
        const displayDistance = THREE.MathUtils.lerp(
          planet.distance,
          planet.realAu * 13.5,
          distanceMix,
        );
        const angle =
          (elapsedDays / planet.period) * Math.PI * 2 + index * 0.72 + 0.2;
        const x = Math.cos(angle) * displayDistance;
        const z = Math.sin(angle) * displayDistance * 0.97;
        const group = planetGroups.get(planet.key);
        const mesh = planetMeshes.get(planet.key);
        if (!group || !mesh) return;
        const sheetY =
          (spacetimeHeight(displayDistance / sheetScale) +
            planet.radius * 0.48) *
          gravityMix;
        group.position.set(x, sheetY, z);
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
        positions.setXYZ(0, 0, sunY + 0.08, 0);
        positions.setXYZ(1, x, sheetY + 0.08, z);
        positions.needsUpdate = true;
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = gravityRef.current
          ? selectedRef.current === planet.key
            ? 0.38
            : 0.055
          : 0;

        const moonSystem = moonSystems.get(planet.key);
        if (moonSystem) {
          moonSystem.mesh.visible = moonsRef.current;
          if (moonsRef.current) {
            for (
              let moonIndex = 0;
              moonIndex < moonSystem.phases.length;
              moonIndex += 1
            ) {
              const moonAngle =
                moonSystem.phases[moonIndex] +
                elapsedDays * moonSystem.speeds[moonIndex];
              const moonRadius = moonSystem.radii[moonIndex];
              moonTransform.position.set(
                Math.cos(moonAngle) * moonRadius,
                Math.sin(moonAngle * 0.73) *
                  moonRadius *
                  moonSystem.tilts[moonIndex],
                Math.sin(moonAngle) * moonRadius,
              );
              moonTransform.rotation.set(0, moonAngle, 0);
              moonTransform.scale.setScalar(moonSystem.sizes[moonIndex]);
              moonTransform.updateMatrix();
              moonSystem.mesh.setMatrixAt(moonIndex, moonTransform.matrix);
            }
            moonSystem.mesh.instanceMatrix.needsUpdate = true;
          }
        }
      });

      orbitLines.forEach((line, index) => {
        const mat = line.material as THREE.LineBasicMaterial;
        const key = PLANETS[index].key;
        mat.opacity = orbitRef.current
          ? selectedRef.current === key
            ? 0.78
            : 0.22
          : 0;
        const displayDistance = THREE.MathUtils.lerp(
          PLANETS[index].distance,
          PLANETS[index].realAu * 13.5,
          distanceMix,
        );
        line.scale.setScalar(displayDistance);
        line.position.y =
          (spacetimeHeight(displayDistance / sheetScale) + 0.09) *
          gravityMix;
      });

      sun.rotation.y += dt * 0.12;
      glow.scale.setScalar(1 + Math.sin(elapsedDays * 0.02) * 0.018);
      stars.rotation.y += dt * 0.002;

      const focused = planetGroups.get(selectedRef.current);
      if (focused && focusPlanet) {
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

          <div className="moon-total">
            <span className="moon-cluster" aria-hidden="true">● · •</span>
            <span>
              <strong>ดวงจันทร์ทั้งหมด 422 ดวง</strong>
              <small>จำนวนที่ยืนยันโดย NASA / IAU</small>
            </span>
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
              <span className="filter-symbol">⌄</span>
              ปริภูมิ–เวลา
            </button>
            <button
              type="button"
              className={showMoons ? "active moon-filter" : ""}
              onClick={() => setShowMoons((value) => !value)}
              aria-pressed={showMoons}
            >
              <span className="filter-symbol">●</span>
              ดวงจันทร์
            </button>
            <button
              type="button"
              className={distanceMode === "real" ? "active scale-filter" : ""}
              onClick={() =>
                setDistanceMode((value) =>
                  value === "compact" ? "real" : "compact",
                )
              }
              aria-pressed={distanceMode === "real"}
            >
              <span className="filter-symbol">↔</span>
              {distanceMode === "real" ? "ระยะจริง" : "ระยะดูง่าย"}
            </button>
            <button
              type="button"
              className={showShadows ? "active shadow-filter" : "light-filter"}
              onClick={() => setShowShadows((value) => !value)}
              aria-pressed={showShadows}
              aria-label={
                showShadows
                  ? "ปิดเงาและเพิ่มแสงให้ดาวไกล"
                  : "เปิดเงาตามทิศทางแสง"
              }
            >
              <span className="filter-symbol">◐</span>
              {showShadows ? "เปิดเงา" : "เพิ่มแสง"}
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

          {(showGravity || distanceMode === "real") && (
            <div className="scene-status">
              {distanceMode === "real" && (
                <div className="scale-legend">
                  <strong>↔ สเกลระยะทางจริง</strong>
                  <span>
                    1 AU = ระยะโลกถึงดวงอาทิตย์ • ขนาดดาวขยายเพื่อให้มองเห็น
                  </span>
                  {!showShadows && (
                    <small>เปิดแสงช่วยมองเห็นดาวชั้นนอกแล้ว</small>
                  )}
                </div>
              )}
              {showGravity && (
                <div className="gravity-legend">
                  <strong>
                    <span className="pulse-dot" /> ผืนปริภูมิ–เวลาโค้งลง
                  </strong>
                  <span>
                    มวลของดวงอาทิตย์ทำให้ดาวเคลื่อนตามทางโค้ง
                  </span>
                </div>
              )}
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
            <p className="moon-summary">
              {activePlanet.moons === 0
                ? "ดาวดวงนี้ไม่มีดวงจันทร์บริวาร"
                : `ดวงเด่น: ${activePlanet.majorMoons.join(" • ")}`}
            </p>
            {activeMoonFacts.length > 0 && activeMoonFact && (
              <section
                className={`moon-explorer ${
                  moonDetailsOpen ? "open" : ""
                }`}
                aria-label={`ข้อมูลดวงจันทร์ของ${activePlanet.name}`}
              >
                <button
                  type="button"
                  className="moon-explorer-toggle"
                  onClick={() => setMoonDetailsOpen((value) => !value)}
                  aria-expanded={moonDetailsOpen}
                >
                  <span>ดวงจันทร์น่าสนใจ</span>
                  <strong>
                    {activeMoonFacts.length} ดวง{" "}
                    {moonDetailsOpen ? "⌃" : "⌄"}
                  </strong>
                </button>
                {moonDetailsOpen && (
                  <div className="moon-explorer-body">
                    <div className="moon-tabs" role="tablist">
                      {activeMoonFacts.map((moon, index) => (
                        <button
                          key={moon.english}
                          type="button"
                          role="tab"
                          aria-selected={moonFactIndex === index}
                          className={moonFactIndex === index ? "active" : ""}
                          onClick={() => setMoonFactIndex(index)}
                        >
                          <span
                            className="moon-tab-dot"
                            style={{ background: moon.color }}
                          />
                          {moon.name}
                        </button>
                      ))}
                    </div>
                    <div className="moon-fact-card" role="tabpanel">
                      <div
                        className="moon-fact-orb"
                        style={{
                          background: `radial-gradient(circle at 34% 28%, #f4f8fa, ${activeMoonFact.color} 48%, #35404b 120%)`,
                        }}
                      />
                      <div className="moon-fact-main">
                        <span>{activeMoonFact.english}</span>
                        <strong>{activeMoonFact.name}</strong>
                        <small>{activeMoonFact.tag}</small>
                      </div>
                      <div className="moon-fact-stats">
                        <span>
                          เส้นผ่านศูนย์กลาง
                          <strong>{activeMoonFact.diameter}</strong>
                        </span>
                        <span>
                          เวลาโคจร
                          <strong>{activeMoonFact.orbit}</strong>
                        </span>
                      </div>
                      <p>{activeMoonFact.fact}</p>
                    </div>
                  </div>
                )}
              </section>
            )}
          </article>

          <button
            className="mobile-planets"
            type="button"
            onClick={() => setPanelOpen(true)}
          >
            <MiniPlanet planet={activePlanet} active />
            เลือกดาว
          </button>

          {showGravity && (
            <div
              className={`spacetime-explainer ${
                distanceMode === "real" ? "with-scale" : ""
              }`}
            >
              <span className="funnel-symbol" aria-hidden="true">
                <span />
              </span>
              <div>
                <strong>ลองนึกถึงลูกบอลหนักบนผ้ายาง</strong>
                <p>
                  ดวงอาทิตย์ทำให้ปริภูมิ–เวลาโค้ง ดาวเคราะห์จึงวิ่งตามร่องโค้งรอบดวงอาทิตย์
                </p>
                <small>
                  ภาพกรวยนี้ขยายความโค้งให้เห็นง่าย ในอวกาศจริงไม่มีผืนผ้า
                </small>
              </div>
            </div>
          )}

          {tipOpen && !showGravity && (
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
