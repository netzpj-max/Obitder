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

type MoonOrbit = {
  name: string;
  semiMajorKm: number;
  periodDays: number;
  eccentricity: number;
  inclinationDeg: number;
  nodeDeg: number;
  periapsisDeg: number;
  phaseDeg: number;
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
  isDwarf?: boolean;
  eccentricity?: number;
  orbitInclination?: number;
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

const DWARF_PLANETS: Planet[] = [
  {
    key: "ceres",
    name: "ซีรีส",
    english: "CERES",
    color: "#827f78",
    accent: "#d5d0c5",
    distance: 22.2,
    radius: 0.28,
    period: 1682,
    day: "9 ชั่วโมง",
    temp: "ประมาณ −105°C",
    moons: 0,
    fact: "ดาวเคราะห์แคระดวงเดียวในระบบสุริยะชั้นใน และเป็นวัตถุใหญ่ที่สุดในแถบดาวเคราะห์น้อย",
    kind: "ดาวเคราะห์แคระ • แถบดาวเคราะห์น้อย",
    realDistance: "413 ล้าน กม.",
    gravity: "≈0.03 เท่าของโลก",
    tilt: 4,
    realAu: 2.77,
    majorMoons: [],
    isDwarf: true,
    eccentricity: 0.076,
    orbitInclination: 10.6,
  },
  {
    key: "pluto",
    name: "พลูโต",
    english: "PLUTO",
    color: "#b9a48e",
    accent: "#f0d0ad",
    distance: 54,
    radius: 0.34,
    period: 90560,
    day: "153 ชั่วโมง",
    temp: "ประมาณ −232°C",
    moons: 5,
    fact: "โลกน้ำแข็งรูปหัวใจในแถบไคเปอร์ มีวงโคจรทั้งรีและเอียงกว่าดาวเคราะห์หลัก",
    kind: "ดาวเคราะห์แคระ • แถบไคเปอร์",
    realDistance: "5.9 พันล้าน กม.",
    gravity: "≈0.06 เท่าของโลก",
    tilt: 57,
    realAu: 39.48,
    majorMoons: ["คารอน", "นิกซ์", "ไฮดรา", "เคอร์เบอรอส", "สติกซ์"],
    isDwarf: true,
    eccentricity: 0.249,
    orbitInclination: 17.2,
  },
  {
    key: "haumea",
    name: "เฮาเมอา",
    english: "HAUMEA",
    color: "#d8d7d0",
    accent: "#f7f5e9",
    distance: 59,
    radius: 0.3,
    period: 104096,
    day: "4 ชั่วโมง",
    temp: "ต่ำกว่า −200°C",
    moons: 2,
    fact: "หมุนเร็วมากจนรูปร่างยืดคล้ายลูกรักบี้ และเป็นดาวเคราะห์แคระที่มีวงแหวน",
    kind: "ดาวเคราะห์แคระ • แถบไคเปอร์",
    realDistance: "6.5 พันล้าน กม.",
    gravity: "≈0.04 เท่าของโลก",
    tilt: 28,
    realAu: 43,
    majorMoons: ["ฮิอิอากา", "นามากา"],
    isDwarf: true,
    eccentricity: 0.195,
    orbitInclination: 28.2,
  },
  {
    key: "makemake",
    name: "มาคีมาคี",
    english: "MAKEMAKE",
    color: "#a96c4f",
    accent: "#f2ae7d",
    distance: 64,
    radius: 0.31,
    period: 111401,
    day: "22.5 ชั่วโมง",
    temp: "ประมาณ −240°C",
    moons: 1,
    fact: "โลกน้ำแข็งสีแดงน้ำตาลที่อยู่ไกลออกไป และมีดวงจันทร์ขนาดเล็กชื่อเล่นว่า MK 2",
    kind: "ดาวเคราะห์แคระ • แถบไคเปอร์",
    realDistance: "6.85 พันล้าน กม.",
    gravity: "≈0.05 เท่าของโลก",
    tilt: 29,
    realAu: 45.8,
    majorMoons: ["MK 2"],
    isDwarf: true,
    eccentricity: 0.159,
    orbitInclination: 29,
  },
  {
    key: "eris",
    name: "อีริส",
    english: "ERIS",
    color: "#d4d8dd",
    accent: "#eef5ff",
    distance: 70,
    radius: 0.32,
    period: 203444,
    day: "25.9 ชั่วโมง",
    temp: "−217 ถึง −243°C",
    moons: 1,
    fact: "หนึ่งในดาวเคราะห์แคระที่ใหญ่ที่สุด อยู่ไกลจนแสงอาทิตย์ใช้เวลาเดินทางมากกว่า 9 ชั่วโมง",
    kind: "ดาวเคราะห์แคระ • กระจายตัวชั้นนอก",
    realDistance: "10 พันล้าน กม.",
    gravity: "≈0.08 เท่าของโลก",
    tilt: 44,
    realAu: 68,
    majorMoons: ["ดิสโนเมีย"],
    isDwarf: true,
    eccentricity: 0.44,
    orbitInclination: 44,
  },
];

const ALL_WORLDS = [...PLANETS, ...DWARF_PLANETS];

const STAR_NAMES = ["ORION", "SIRIUS", "POLARIS", "BETELGEUSE"];

const TIME_SCALES = [
  { days: 1, label: "1 วัน/f", description: "1 วันต่อเฟรมเวลา" },
  { days: 7, label: "1 สัปดาห์/f", description: "1 สัปดาห์ต่อเฟรมเวลา" },
  { days: 365, label: "1 ปี/f", description: "1 ปีต่อเฟรมเวลา" },
  { days: 3650, label: "10 ปี/f", description: "10 ปีต่อเฟรมเวลา" },
  { days: 36500, label: "100 ปี/f", description: "100 ปีต่อเฟรมเวลา" },
  {
    days: 365000,
    label: "1,000 ปี/f",
    description: "1,000 ปีต่อเฟรมเวลา",
  },
] as const;

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
  pluto: [
    {
      name: "คารอน",
      english: "CHARON",
      diameter: "1,212 กม.",
      orbit: "6.4 วัน",
      tag: "คู่หูดวงใหญ่ของพลูโต",
      fact: "คารอนมีขนาดประมาณครึ่งหนึ่งของพลูโต ทั้งคู่หันด้านเดิมเข้าหากันเสมอจนมักถูกเรียกว่าระบบดาวคู่",
      color: "#b9b7b1",
    },
  ],
  haumea: [
    {
      name: "ฮิอิอากา",
      english: "HIʻIAKA",
      diameter: "ประมาณ 310 กม.",
      orbit: "ประมาณ 49 วัน",
      tag: "ดวงจันทร์ชั้นนอก",
      fact: "เป็นดวงจันทร์ดวงใหญ่และอยู่ไกลกว่านามากา เชื่อว่าเกิดจากการชนครั้งใหญ่ในอดีต",
      color: "#d9d7cf",
    },
    {
      name: "นามากา",
      english: "NAMAKA",
      diameter: "ประมาณ 170 กม.",
      orbit: "ประมาณ 18 วัน",
      tag: "ดวงจันทร์ชั้นใน",
      fact: "วงโคจรของนามากาถูกรบกวนโดยแรงดึงจากฮิอิอากา ทำให้ระบบนี้ซับซ้อนและน่าสนใจ",
      color: "#aaa9a4",
    },
  ],
  makemake: [
    {
      name: "MK 2",
      english: "S/2015 (136472) 1",
      diameter: "ประมาณ 160 กม.",
      orbit: "มากกว่า 12 วัน",
      tag: "ดวงจันทร์มืดมาก",
      fact: "ดวงจันทร์ชั่วคราวชื่อ MK 2 จางกว่ามาคีมาคีมากกว่า 1,300 เท่า จึงค้นพบได้ยาก",
      color: "#5f554e",
    },
  ],
  eris: [
    {
      name: "ดิสโนเมีย",
      english: "DYSNOMIA",
      diameter: "ประมาณ 700 กม.",
      orbit: "ประมาณ 16 วัน",
      tag: "ช่วยชั่งมวลของอีริส",
      fact: "นักดาราศาสตร์ใช้การโคจรของดิสโนเมียคำนวณมวลของอีริสและเปรียบเทียบกับพลูโต",
      color: "#bdc4cc",
    },
  ],
};

// Mean orbital elements from JPL SSD. The remaining small moons are generated
// deterministically in visually representative regular/irregular moon families.
const REAL_MOON_ORBITS: Record<string, MoonOrbit[]> = {
  earth: [
    {
      name: "Moon",
      semiMajorKm: 384400,
      periodDays: 27.322,
      eccentricity: 0.0554,
      inclinationDeg: 5.16,
      nodeDeg: 125.08,
      periapsisDeg: 318.15,
      phaseDeg: 135.27,
    },
  ],
  mars: [
    {
      name: "Phobos",
      semiMajorKm: 9375,
      periodDays: 0.3187,
      eccentricity: 0.015,
      inclinationDeg: 1.1,
      nodeDeg: 169.2,
      periapsisDeg: 216.3,
      phaseDeg: 189.7,
    },
    {
      name: "Deimos",
      semiMajorKm: 23457,
      periodDays: 1.2625,
      eccentricity: 0,
      inclinationDeg: 1.8,
      nodeDeg: 54.3,
      periapsisDeg: 0,
      phaseDeg: 205,
    },
  ],
  jupiter: [
    {
      name: "Io",
      semiMajorKm: 421800,
      periodDays: 1.762732,
      eccentricity: 0.004,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 49.1,
      phaseDeg: 330.9,
    },
    {
      name: "Europa",
      semiMajorKm: 671100,
      periodDays: 3.525463,
      eccentricity: 0.009,
      inclinationDeg: 0.5,
      nodeDeg: 184,
      periapsisDeg: 45,
      phaseDeg: 345.4,
    },
    {
      name: "Ganymede",
      semiMajorKm: 1070400,
      periodDays: 7.155588,
      eccentricity: 0.001,
      inclinationDeg: 0.2,
      nodeDeg: 58.5,
      periapsisDeg: 198.3,
      phaseDeg: 324.8,
    },
    {
      name: "Callisto",
      semiMajorKm: 1882700,
      periodDays: 16.69044,
      eccentricity: 0.007,
      inclinationDeg: 0.3,
      nodeDeg: 309.1,
      periapsisDeg: 43.8,
      phaseDeg: 87.4,
    },
    {
      name: "Metis",
      semiMajorKm: 128000,
      periodDays: 0.294779,
      eccentricity: 0,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 0,
      phaseDeg: 166,
    },
    {
      name: "Adrastea",
      semiMajorKm: 129000,
      periodDays: 0.29826,
      eccentricity: 0,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 0,
      phaseDeg: 214.5,
    },
    {
      name: "Amalthea",
      semiMajorKm: 181400,
      periodDays: 0.499918,
      eccentricity: 0.003,
      inclinationDeg: 0.4,
      nodeDeg: 282.9,
      periapsisDeg: 180.1,
      phaseDeg: 310.6,
    },
    {
      name: "Thebe",
      semiMajorKm: 221900,
      periodDays: 0.676105,
      eccentricity: 0.018,
      inclinationDeg: 1.1,
      nodeDeg: 340.4,
      periapsisDeg: 26.6,
      phaseDeg: 182.1,
    },
    {
      name: "Himalia",
      semiMajorKm: 11439000,
      periodDays: 249.909,
      eccentricity: 0.16,
      inclinationDeg: 28.4,
      nodeDeg: 64.2,
      periapsisDeg: 321.1,
      phaseDeg: 78.3,
    },
    {
      name: "Elara",
      semiMajorKm: 11710700,
      periodDays: 258.8861,
      eccentricity: 0.212,
      inclinationDeg: 27.8,
      nodeDeg: 112.8,
      periapsisDeg: 129.9,
      phaseDeg: 346.9,
    },
    {
      name: "Pasiphae",
      semiMajorKm: 23463200,
      periodDays: 734.4215,
      eccentricity: 0.412,
      inclinationDeg: 148.3,
      nodeDeg: 315.7,
      periapsisDeg: 172.8,
      phaseDeg: 279.3,
    },
    {
      name: "Carme",
      semiMajorKm: 23139200,
      periodDays: 719.2806,
      eccentricity: 0.261,
      inclinationDeg: 164.6,
      nodeDeg: 115.5,
      periapsisDeg: 6.5,
      phaseDeg: 259.5,
    },
  ],
  saturn: [
    {
      name: "Titan",
      semiMajorKm: 1221900,
      periodDays: 15.945448,
      eccentricity: 0.029,
      inclinationDeg: 0.3,
      nodeDeg: 78.6,
      periapsisDeg: 78.3,
      phaseDeg: 11.7,
    },
    {
      name: "Enceladus",
      semiMajorKm: 238400,
      periodDays: 1.370218,
      eccentricity: 0.005,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 119.5,
      phaseDeg: 57,
    },
    {
      name: "Rhea",
      semiMajorKm: 527200,
      periodDays: 4.517503,
      eccentricity: 0.001,
      inclinationDeg: 0.3,
      nodeDeg: 133.7,
      periapsisDeg: 44.3,
      phaseDeg: 31.5,
    },
    {
      name: "Iapetus",
      semiMajorKm: 3561700,
      periodDays: 79.331002,
      eccentricity: 0.028,
      inclinationDeg: 7.6,
      nodeDeg: 86.5,
      periapsisDeg: 254.5,
      phaseDeg: 74.8,
    },
    {
      name: "Pan",
      semiMajorKm: 133600,
      periodDays: 0.575051,
      eccentricity: 0,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 0,
      phaseDeg: 146.6,
    },
    {
      name: "Daphnis",
      semiMajorKm: 136500,
      periodDays: 0.59408,
      eccentricity: 0,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 0,
      phaseDeg: 153.6,
    },
    {
      name: "Atlas",
      semiMajorKm: 137700,
      periodDays: 0.604602,
      eccentricity: 0.001,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 82.3,
      phaseDeg: 289.1,
    },
    {
      name: "Prometheus",
      semiMajorKm: 139400,
      periodDays: 0.615878,
      eccentricity: 0.002,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 341.9,
      phaseDeg: 135.4,
    },
    {
      name: "Pandora",
      semiMajorKm: 141700,
      periodDays: 0.631369,
      eccentricity: 0.004,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 217.9,
      phaseDeg: 123.9,
    },
    {
      name: "Janus",
      semiMajorKm: 151500,
      periodDays: 0.697353,
      eccentricity: 0.007,
      inclinationDeg: 0.2,
      nodeDeg: 159.9,
      periapsisDeg: 11.1,
      phaseDeg: 111.7,
    },
    {
      name: "Epimetheus",
      semiMajorKm: 151400,
      periodDays: 0.697012,
      eccentricity: 0.02,
      inclinationDeg: 0.3,
      nodeDeg: 189.8,
      periapsisDeg: 96.3,
      phaseDeg: 197.2,
    },
    {
      name: "Mimas",
      semiMajorKm: 186000,
      periodDays: 0.942422,
      eccentricity: 0.02,
      inclinationDeg: 1.6,
      nodeDeg: 66.2,
      periapsisDeg: 160.4,
      phaseDeg: 275.3,
    },
    {
      name: "Tethys",
      semiMajorKm: 295000,
      periodDays: 1.887802,
      eccentricity: 0.001,
      inclinationDeg: 1.1,
      nodeDeg: 273,
      periapsisDeg: 335.3,
      phaseDeg: 0,
    },
    {
      name: "Dione",
      semiMajorKm: 377700,
      periodDays: 2.736916,
      eccentricity: 0.002,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 116,
      phaseDeg: 212,
    },
    {
      name: "Hyperion",
      semiMajorKm: 1481500,
      periodDays: 21.276658,
      eccentricity: 0.105,
      inclinationDeg: 0.6,
      nodeDeg: 87.1,
      periapsisDeg: 214,
      phaseDeg: 122.9,
    },
    {
      name: "Phoebe",
      semiMajorKm: 12929400,
      periodDays: 550.30391,
      eccentricity: 0.164,
      inclinationDeg: 175.2,
      nodeDeg: 192.7,
      periapsisDeg: 240.3,
      phaseDeg: 308,
    },
  ],
  uranus: [
    {
      name: "Miranda",
      semiMajorKm: 129846,
      periodDays: 1.413479,
      eccentricity: 0.001,
      inclinationDeg: 4.4,
      nodeDeg: 100.9,
      periapsisDeg: 154.8,
      phaseDeg: 73,
    },
    {
      name: "Ariel",
      semiMajorKm: 190929,
      periodDays: 2.520379,
      eccentricity: 0.001,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 9.6,
      phaseDeg: 193.5,
    },
    {
      name: "Umbriel",
      semiMajorKm: 265986,
      periodDays: 4.144177,
      eccentricity: 0.004,
      inclinationDeg: 0.1,
      nodeDeg: 174.8,
      periapsisDeg: 183.4,
      phaseDeg: 253,
    },
    {
      name: "Titania",
      semiMajorKm: 436298,
      periodDays: 8.705869,
      eccentricity: 0.002,
      inclinationDeg: 0.1,
      nodeDeg: 29.5,
      periapsisDeg: 184,
      phaseDeg: 68.1,
    },
    {
      name: "Oberon",
      semiMajorKm: 583511,
      periodDays: 13.463237,
      eccentricity: 0.002,
      inclinationDeg: 0.1,
      nodeDeg: 76.8,
      periapsisDeg: 132.2,
      phaseDeg: 143.6,
    },
    {
      name: "Cordelia",
      semiMajorKm: 49755,
      periodDays: 0.3347,
      eccentricity: 0,
      inclinationDeg: 0.2,
      nodeDeg: 1.1,
      periapsisDeg: 0,
      phaseDeg: 287.4,
    },
    {
      name: "Ophelia",
      semiMajorKm: 53765,
      periodDays: 0.3764,
      eccentricity: 0.011,
      inclinationDeg: 0.2,
      nodeDeg: 151.6,
      periapsisDeg: 19.3,
      phaseDeg: 213.4,
    },
    {
      name: "Bianca",
      semiMajorKm: 59170,
      periodDays: 0.4347,
      eccentricity: 0.006,
      inclinationDeg: 2.3,
      nodeDeg: 272.5,
      periapsisDeg: 328,
      phaseDeg: 109.1,
    },
    {
      name: "Cressida",
      semiMajorKm: 61770,
      periodDays: 0.4639,
      eccentricity: 0.004,
      inclinationDeg: 1.8,
      nodeDeg: 308.2,
      periapsisDeg: 87.9,
      phaseDeg: 0.5,
    },
    {
      name: "Desdemona",
      semiMajorKm: 62663,
      periodDays: 0.4736,
      eccentricity: 0.007,
      inclinationDeg: 3.1,
      nodeDeg: 283.9,
      periapsisDeg: 137,
      phaseDeg: 230,
    },
    {
      name: "Juliet",
      semiMajorKm: 64362,
      periodDays: 0.4931,
      eccentricity: 0.006,
      inclinationDeg: 3,
      nodeDeg: 141,
      periapsisDeg: 274.9,
      phaseDeg: 319.8,
    },
    {
      name: "Portia",
      semiMajorKm: 66101,
      periodDays: 0.5132,
      eccentricity: 0.004,
      inclinationDeg: 2.7,
      nodeDeg: 146.7,
      periapsisDeg: 31.6,
      phaseDeg: 310.1,
    },
    {
      name: "Rosalind",
      semiMajorKm: 69930,
      periodDays: 0.5583,
      eccentricity: 0.003,
      inclinationDeg: 1.7,
      nodeDeg: 330,
      periapsisDeg: 231.8,
      phaseDeg: 287.7,
    },
    {
      name: "Belinda",
      semiMajorKm: 75258,
      periodDays: 0.6236,
      eccentricity: 0.002,
      inclinationDeg: 1.4,
      nodeDeg: 96.2,
      periapsisDeg: 58.6,
      phaseDeg: 226.4,
    },
    {
      name: "Puck",
      semiMajorKm: 86007,
      periodDays: 0.7618,
      eccentricity: 0.009,
      inclinationDeg: 1.1,
      nodeDeg: 111.2,
      periapsisDeg: 337,
      phaseDeg: 264.1,
    },
  ],
  neptune: [
    {
      name: "Triton",
      semiMajorKm: 354800,
      periodDays: 5.876994,
      eccentricity: 0,
      inclinationDeg: 157.3,
      nodeDeg: 178.1,
      periapsisDeg: 0,
      phaseDeg: 63,
    },
    {
      name: "Nereid",
      semiMajorKm: 5513900,
      periodDays: 360.133039,
      eccentricity: 0.751,
      inclinationDeg: 5.1,
      nodeDeg: 319.5,
      periapsisDeg: 296.8,
      phaseDeg: 318.5,
    },
    {
      name: "Proteus",
      semiMajorKm: 117600,
      periodDays: 1.122315,
      eccentricity: 0,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 0,
      phaseDeg: 276.8,
    },
    {
      name: "Naiad",
      semiMajorKm: 48200,
      periodDays: 0.29398,
      eccentricity: 0,
      inclinationDeg: 4.7,
      nodeDeg: 41.4,
      periapsisDeg: 0,
      phaseDeg: 89.7,
    },
    {
      name: "Thalassa",
      semiMajorKm: 50100,
      periodDays: 0.311078,
      eccentricity: 0,
      inclinationDeg: 0.2,
      nodeDeg: 130.6,
      periapsisDeg: 0,
      phaseDeg: 165.7,
    },
    {
      name: "Despina",
      semiMajorKm: 52500,
      periodDays: 0.334656,
      eccentricity: 0,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 0,
      phaseDeg: 125.1,
    },
    {
      name: "Galatea",
      semiMajorKm: 62000,
      periodDays: 0.428744,
      eccentricity: 0,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 0,
      phaseDeg: 86.7,
    },
    {
      name: "Larissa",
      semiMajorKm: 73500,
      periodDays: 0.554989,
      eccentricity: 0.001,
      inclinationDeg: 0.2,
      nodeDeg: 312,
      periapsisDeg: 247.3,
      phaseDeg: 165.5,
    },
    {
      name: "Hippocamp",
      semiMajorKm: 105300,
      periodDays: 0.95039,
      eccentricity: 0.001,
      inclinationDeg: 0.3,
      nodeDeg: 0.5,
      periapsisDeg: 346.4,
      phaseDeg: 286.5,
    },
  ],
  pluto: [
    {
      name: "Charon",
      semiMajorKm: 19600,
      periodDays: 6.387222,
      eccentricity: 0,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 0,
      phaseDeg: 304.1,
    },
    {
      name: "Nix",
      semiMajorKm: 49300,
      periodDays: 24.85,
      eccentricity: 0.015,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 31.4,
      phaseDeg: 338.2,
    },
    {
      name: "Hydra",
      semiMajorKm: 65200,
      periodDays: 38.2,
      eccentricity: 0.009,
      inclinationDeg: 0.3,
      nodeDeg: 114.3,
      periapsisDeg: 139.3,
      phaseDeg: 335,
    },
    {
      name: "Kerberos",
      semiMajorKm: 58300,
      periodDays: 32.17,
      eccentricity: 0.01,
      inclinationDeg: 0.4,
      nodeDeg: 314.3,
      periapsisDeg: 32.1,
      phaseDeg: 276.1,
    },
    {
      name: "Styx",
      semiMajorKm: 43200,
      periodDays: 20.16,
      eccentricity: 0.025,
      inclinationDeg: 0,
      nodeDeg: 0,
      periapsisDeg: 322.5,
      phaseDeg: 358.1,
    },
  ],
};

function solveEccentricAnomaly(meanAnomaly: number, eccentricity: number) {
  let eccentricAnomaly = meanAnomaly;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    eccentricAnomaly -=
      (eccentricAnomaly -
        eccentricity * Math.sin(eccentricAnomaly) -
        meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
  }
  return eccentricAnomaly;
}

function setMoonOrbitPosition(
  target: THREE.Vector3,
  semiMajor: number,
  eccentricity: number,
  inclination: number,
  node: number,
  periapsis: number,
  meanAnomaly: number,
) {
  const eccentricAnomaly = solveEccentricAnomaly(
    meanAnomaly,
    eccentricity,
  );
  const orbitalX =
    semiMajor * (Math.cos(eccentricAnomaly) - eccentricity);
  const orbitalZ =
    semiMajor *
    Math.sqrt(1 - eccentricity * eccentricity) *
    Math.sin(eccentricAnomaly);
  const periapsisCos = Math.cos(periapsis);
  const periapsisSin = Math.sin(periapsis);
  const planeX = orbitalX * periapsisCos - orbitalZ * periapsisSin;
  const planeZ = orbitalX * periapsisSin + orbitalZ * periapsisCos;
  const nodeCos = Math.cos(node);
  const nodeSin = Math.sin(node);
  const inclinationCos = Math.cos(inclination);
  const inclinationSin = Math.sin(inclination);
  const tiltedZ = planeZ * inclinationCos;
  target.set(
    planeX * nodeCos + tiltedZ * nodeSin,
    planeZ * inclinationSin,
    -planeX * nodeSin + tiltedZ * nodeCos,
  );
}

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
  const daysPerFrameRef = useRef(1);
  const gravityRef = useRef(false);
  const orbitRef = useRef(true);
  const distanceModeRef = useRef<DistanceMode>("compact");
  const moonsRef = useRef(true);
  const shadowsRef = useRef(true);
  const dwarfsRef = useRef(true);
  const asteroidsRef = useRef(true);
  const oortRef = useRef(true);

  const [selected, setSelected] = useState("earth");
  const [mode, setMode] = useState<ViewMode>("explore");
  const [paused, setPaused] = useState(false);
  const [daysPerFrame, setDaysPerFrame] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showGravity, setShowGravity] = useState(false);
  const [labels, setLabels] = useState(true);
  const [showMoons, setShowMoons] = useState(true);
  const [distanceMode, setDistanceMode] =
    useState<DistanceMode>("compact");
  const [showShadows, setShowShadows] = useState(true);
  const [showDwarfs, setShowDwarfs] = useState(true);
  const [showAsteroids, setShowAsteroids] = useState(true);
  const [showOort, setShowOort] = useState(true);
  const [moonFactIndex, setMoonFactIndex] = useState(0);
  const [moonDetailsOpen, setMoonDetailsOpen] = useState(true);
  const [infoCardOpen, setInfoCardOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [tipOpen, setTipOpen] = useState(true);
  const [simDays, setSimDays] = useState(0);

  const activePlanet = useMemo(
    () => ALL_WORLDS.find((p) => p.key === selected) ?? PLANETS[2],
    [selected],
  );
  const activeMoonFacts = FEATURED_MOONS[selected] ?? [];
  const activeRealMoonCount = REAL_MOON_ORBITS[selected]?.length ?? 0;
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
    daysPerFrameRef.current = daysPerFrame;
  }, [daysPerFrame]);

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
    dwarfsRef.current = showDwarfs;
  }, [showDwarfs]);

  useEffect(() => {
    asteroidsRef.current = showAsteroids;
  }, [showAsteroids]);

  useEffect(() => {
    oortRef.current = showOort;
  }, [showOort]);

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
        periods: Float32Array;
        eccentricities: Float32Array;
        inclinations: Float32Array;
        nodes: Float32Array;
        periapses: Float32Array;
        sizes: Float32Array;
        guideGroup: THREE.Group;
        guideMaterial: THREE.LineBasicMaterial;
      }
    >();
    const selectable: THREE.Object3D[] = [sun];

    ALL_WORLDS.forEach((planet, index) => {
      const points: THREE.Vector3[] = [];
      const orbitalEccentricity = planet.eccentricity ?? 0;
      const orbitalInclination = THREE.MathUtils.degToRad(
        planet.orbitInclination ?? 0,
      );
      for (let i = 0; i < 160; i += 1) {
        const a = (i / 160) * Math.PI * 2;
        const orbitalRadius =
          (1 - orbitalEccentricity * orbitalEccentricity) /
          (1 + orbitalEccentricity * Math.cos(a));
        points.push(
          new THREE.Vector3(
            Math.cos(a) * orbitalRadius,
            Math.sin(a) * orbitalRadius * Math.sin(orbitalInclination),
            Math.sin(a) *
              orbitalRadius *
              Math.cos(orbitalInclination) *
              (planet.isDwarf ? 1 : 0.97),
          ),
        );
      }
      const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: planet.isDwarf
            ? 0x8f7bab
            : index === 2
              ? 0x70b7e6
              : 0x4d7190,
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

      if (planet.key === "haumea") {
        mesh.scale.set(1.35, 0.78, 0.82);
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(
            planet.radius * 1.48,
            planet.radius * 1.72,
            56,
          ),
          new THREE.MeshBasicMaterial({
            color: 0xdde4eb,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.42,
          }),
        );
        ring.rotation.x = Math.PI / 2.15;
        group.add(ring);
      }

      if (planet.moons > 0) {
        const realOrbits = REAL_MOON_ORBITS[planet.key] ?? [];
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
        const periods = new Float32Array(planet.moons);
        const eccentricities = new Float32Array(planet.moons);
        const inclinations = new Float32Array(planet.moons);
        const nodes = new Float32Array(planet.moons);
        const periapses = new Float32Array(planet.moons);
        const sizes = new Float32Array(planet.moons);
        const color = new THREE.Color();
        const visualInner = planet.radius * 1.65 + 0.62;
        const visualSpan =
          planet.key === "saturn"
            ? 6.4
            : planet.moons <= 2
              ? 2.5
              : 5.2;
        const realDistances = realOrbits.map((moon) => moon.semiMajorKm);
        const minRealDistance =
          realDistances.length > 0 ? Math.min(...realDistances) : 1;
        const maxRealDistance =
          realDistances.length > 0 ? Math.max(...realDistances) : 1;
        const logRealRange =
          Math.log(maxRealDistance) - Math.log(minRealDistance);
        const maxProceduralPeriod =
          planet.key === "jupiter"
            ? 900
            : planet.key === "saturn"
              ? 1450
              : planet.key === "uranus"
                ? 3000
                : planet.key === "neptune"
                  ? 9500
                  : 120;

        for (let moonIndex = 0; moonIndex < planet.moons; moonIndex += 1) {
          const realOrbit = realOrbits[moonIndex];
          if (realOrbit) {
            const distanceMix =
              logRealRange > 0
                ? (Math.log(realOrbit.semiMajorKm) -
                    Math.log(minRealDistance)) /
                  logRealRange
                : 0.5;
            radii[moonIndex] =
              visualInner + 0.25 + distanceMix * visualSpan;
            periods[moonIndex] = realOrbit.periodDays;
            eccentricities[moonIndex] = realOrbit.eccentricity;
            inclinations[moonIndex] = THREE.MathUtils.degToRad(
              realOrbit.inclinationDeg,
            );
            nodes[moonIndex] = THREE.MathUtils.degToRad(realOrbit.nodeDeg);
            periapses[moonIndex] = THREE.MathUtils.degToRad(
              realOrbit.periapsisDeg,
            );
            phases[moonIndex] = THREE.MathUtils.degToRad(
              realOrbit.phaseDeg,
            );
          } else {
            const generatedIndex = moonIndex - realOrbits.length;
            const generatedCount = Math.max(
              1,
              planet.moons - realOrbits.length,
            );
            const familyMix =
              (generatedIndex + 0.5) / Math.max(generatedCount, 1);
            const laneOffset = (generatedIndex % 9) * 0.035;
            phases[moonIndex] =
              (generatedIndex * 2.399963) % (Math.PI * 2);
            radii[moonIndex] =
              visualInner +
              0.42 +
              Math.pow(familyMix, 0.72) * (visualSpan + 1.55) +
              laneOffset;
            periods[moonIndex] =
              0.34 +
              Math.pow(familyMix, 1.65) * maxProceduralPeriod;
            if (familyMix < 0.42) {
              eccentricities[moonIndex] =
                0.004 + (generatedIndex % 5) * 0.005;
              inclinations[moonIndex] = THREE.MathUtils.degToRad(
                0.4 + (generatedIndex % 8) * 0.7,
              );
            } else if (familyMix < 0.7) {
              eccentricities[moonIndex] =
                0.05 + (generatedIndex % 9) * 0.022;
              inclinations[moonIndex] = THREE.MathUtils.degToRad(
                18 + (generatedIndex % 11) * 3.1,
              );
            } else {
              eccentricities[moonIndex] =
                0.14 + (generatedIndex % 10) * 0.036;
              inclinations[moonIndex] = THREE.MathUtils.degToRad(
                142 + (generatedIndex % 12) * 2.7,
              );
            }
            nodes[moonIndex] =
              (generatedIndex * 1.618034) % (Math.PI * 2);
            periapses[moonIndex] =
              (generatedIndex * 0.9137) % (Math.PI * 2);
          }
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

        const guideGroup = new THREE.Group();
        const guideMaterial = new THREE.LineBasicMaterial({
          color: planet.accent,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        });
        realOrbits.forEach((realOrbit, moonIndex) => {
          const guidePoints: THREE.Vector3[] = [];
          for (let pointIndex = 0; pointIndex < 96; pointIndex += 1) {
            const point = new THREE.Vector3();
            setMoonOrbitPosition(
              point,
              radii[moonIndex],
              eccentricities[moonIndex],
              inclinations[moonIndex],
              nodes[moonIndex],
              periapses[moonIndex],
              (pointIndex / 96) * Math.PI * 2,
            );
            guidePoints.push(point);
          }
          const guide = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(guidePoints),
            guideMaterial,
          );
          guide.renderOrder = 3;
          guideGroup.add(guide);
        });
        moonMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        if (moonMesh.instanceColor) moonMesh.instanceColor.needsUpdate = true;
        moonMesh.frustumCulled = false;
        moonMesh.renderOrder = 4;
        moonSystems.set(planet.key, {
          mesh: moonMesh,
          phases,
          radii,
          periods,
          eccentricities,
          inclinations,
          nodes,
          periapses,
          sizes,
          guideGroup,
          guideMaterial,
        });
        group.add(guideGroup, moonMesh);
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

    let seededState = 0x51f15e;
    const seededRandom = () => {
      seededState = (seededState * 1664525 + 1013904223) >>> 0;
      return seededState / 4294967296;
    };

    const asteroidCount = 1800;
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    const asteroidAUs = new Float32Array(asteroidCount);
    const asteroidPhases = new Float32Array(asteroidCount);
    const asteroidInclinations = new Float32Array(asteroidCount);
    for (let asteroidIndex = 0; asteroidIndex < asteroidCount; asteroidIndex += 1) {
      const laneBias = (asteroidIndex % 7) * 0.018;
      asteroidAUs[asteroidIndex] =
        2.2 + seededRandom() * 1.0 + laneBias;
      asteroidPhases[asteroidIndex] = seededRandom() * Math.PI * 2;
      asteroidInclinations[asteroidIndex] =
        THREE.MathUtils.degToRad((seededRandom() - 0.5) * 18);
    }
    const asteroidGeometry = new THREE.BufferGeometry();
    asteroidGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(asteroidPositions, 3),
    );
    const asteroidMaterial = new THREE.PointsMaterial({
      color: 0xc5a783,
      size: 0.075,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const asteroidBelt = new THREE.Points(
      asteroidGeometry,
      asteroidMaterial,
    );
    asteroidBelt.frustumCulled = false;
    asteroidBelt.renderOrder = 2;
    scene.add(asteroidBelt);

    const oortCount = 3600;
    const oortPositions = new Float32Array(oortCount * 3);
    for (let oortIndex = 0; oortIndex < oortCount; oortIndex += 1) {
      const radius = 72 + Math.pow(seededRandom(), 0.58) * 55;
      const vertical = seededRandom() * 2 - 1;
      const azimuth = seededRandom() * Math.PI * 2;
      const horizontal = Math.sqrt(1 - vertical * vertical);
      oortPositions[oortIndex * 3] =
        radius * horizontal * Math.cos(azimuth);
      oortPositions[oortIndex * 3 + 1] = radius * vertical;
      oortPositions[oortIndex * 3 + 2] =
        radius * horizontal * Math.sin(azimuth);
    }
    const oortGeometry = new THREE.BufferGeometry();
    oortGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(oortPositions, 3),
    );
    const oortMaterial = new THREE.PointsMaterial({
      color: 0x8fc5d8,
      size: 0.18,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const oortCloud = new THREE.Points(oortGeometry, oortMaterial);
    oortCloud.frustumCulled = false;
    oortCloud.renderOrder = 0;
    scene.add(oortCloud);

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
        distanceModeRef.current === "real" ? 1400 : 180,
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
        targetDistance = distanceModeRef.current === "real" ? 1000 : 62;
        focusPlanet = false;
        targetLook.set(0, 0, 0);
      },
      zoom: (delta: number) => {
        const zoomStep = distanceModeRef.current === "real" ? delta * 5 : delta;
        targetDistance = THREE.MathUtils.clamp(
          targetDistance + zoomStep,
          22,
          distanceModeRef.current === "real" ? 1400 : 180,
        );
      },
      focus: (key: string) => {
        const planet = ALL_WORLDS.find((item) => item.key === key);
        if (!planet) return;
        if (distanceModeRef.current === "real") {
          focusPlanet = true;
          targetDistance = Math.max(24, planet.radius * 7 + 18);
        } else if (planet.isDwarf) {
          focusPlanet = true;
          targetDistance = 22;
        } else {
          targetDistance = Math.max(26, planet.distance + 17);
          focusPlanet = targetDistance < 52;
        }
      },
      setDistanceMode: (nextMode: DistanceMode) => {
        focusPlanet = false;
        targetLook.set(0, 0, 0);
        targetDistance = nextMode === "real" ? 1000 : 62;
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
      // A "time frame" advances once per real second, independent of display Hz.
      if (!pausedRef.current) elapsedDays += dt * daysPerFrameRef.current;
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
      stars.scale.setScalar(1 + distanceMix * 8);
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

      asteroidBelt.visible = asteroidsRef.current;
      if (asteroidsRef.current) {
        const asteroidPositionAttribute = asteroidGeometry.attributes
          .position as THREE.BufferAttribute;
        for (
          let asteroidIndex = 0;
          asteroidIndex < asteroidCount;
          asteroidIndex += 1
        ) {
          const au = asteroidAUs[asteroidIndex];
          const compactRadius = 20.2 + (au - 2.2) * 3.8;
          const displayRadius = THREE.MathUtils.lerp(
            compactRadius,
            au * 13.5,
            distanceMix,
          );
          const periodDays = 365.25 * Math.pow(au, 1.5);
          const angle =
            asteroidPhases[asteroidIndex] +
            (elapsedDays / periodDays) * Math.PI * 2;
          const inclination = asteroidInclinations[asteroidIndex];
          asteroidPositionAttribute.setXYZ(
            asteroidIndex,
            Math.cos(angle) * displayRadius,
            Math.sin(angle) * displayRadius * Math.sin(inclination),
            Math.sin(angle) * displayRadius,
          );
        }
        asteroidPositionAttribute.needsUpdate = true;
        asteroidMaterial.size = THREE.MathUtils.lerp(
          0.075,
          0.48,
          distanceMix,
        );
      }

      oortCloud.visible = oortRef.current;
      oortCloud.scale.setScalar(THREE.MathUtils.lerp(1, 14, distanceMix));
      oortCloud.rotation.y += dt * 0.00005;
      oortMaterial.opacity = oortRef.current
        ? THREE.MathUtils.lerp(0.22, 0.34, distanceMix)
        : 0;

      ALL_WORLDS.forEach((planet, index) => {
        const displayDistance = THREE.MathUtils.lerp(
          planet.distance,
          planet.realAu * 13.5,
          distanceMix,
        );
        const angle =
          (elapsedDays / planet.period) * Math.PI * 2 + index * 0.72 + 0.2;
        const orbitalEccentricity = planet.eccentricity ?? 0;
        const orbitalRadius =
          (displayDistance *
            (1 - orbitalEccentricity * orbitalEccentricity)) /
          (1 + orbitalEccentricity * Math.cos(angle));
        const orbitalInclination = THREE.MathUtils.degToRad(
          planet.orbitInclination ?? 0,
        );
        const x = Math.cos(angle) * orbitalRadius;
        const orbitalY =
          Math.sin(angle) * orbitalRadius * Math.sin(orbitalInclination);
        const z =
          Math.sin(angle) *
          orbitalRadius *
          Math.cos(orbitalInclination) *
          (planet.isDwarf ? 1 : 0.97);
        const group = planetGroups.get(planet.key);
        const mesh = planetMeshes.get(planet.key);
        if (!group || !mesh) return;
        const bodyVisible = !planet.isDwarf || dwarfsRef.current;
        group.visible = bodyVisible;
        const sheetY =
          (spacetimeHeight(displayDistance / sheetScale) +
            planet.radius * 0.48) *
          gravityMix;
        group.position.set(x, sheetY + orbitalY, z);
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
        positions.setXYZ(1, x, sheetY + orbitalY + 0.08, z);
        positions.needsUpdate = true;
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = gravityRef.current && bodyVisible
          ? selectedRef.current === planet.key
            ? 0.38
            : 0.055
          : 0;

        const moonSystem = moonSystems.get(planet.key);
        if (moonSystem) {
          moonSystem.mesh.visible = moonsRef.current && bodyVisible;
          moonSystem.guideGroup.visible = moonsRef.current && bodyVisible;
          moonSystem.guideMaterial.opacity = moonsRef.current && bodyVisible
            ? selectedRef.current === planet.key
              ? 0.42
              : 0.075
            : 0;
          if (moonsRef.current && bodyVisible) {
            for (
              let moonIndex = 0;
              moonIndex < moonSystem.phases.length;
              moonIndex += 1
            ) {
              const meanAnomaly =
                moonSystem.phases[moonIndex] +
                (elapsedDays / moonSystem.periods[moonIndex]) *
                  Math.PI *
                  2;
              setMoonOrbitPosition(
                moonTransform.position,
                moonSystem.radii[moonIndex],
                moonSystem.eccentricities[moonIndex],
                moonSystem.inclinations[moonIndex],
                moonSystem.nodes[moonIndex],
                moonSystem.periapses[moonIndex],
                meanAnomaly,
              );
              moonTransform.rotation.set(0, meanAnomaly, 0);
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
        const body = ALL_WORLDS[index];
        const key = body.key;
        const bodyVisible = !body.isDwarf || dwarfsRef.current;
        mat.opacity = orbitRef.current && bodyVisible
          ? selectedRef.current === key
            ? 0.78
            : 0.22
          : 0;
        const displayDistance = THREE.MathUtils.lerp(
          ALL_WORLDS[index].distance,
          ALL_WORLDS[index].realAu * 13.5,
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
            <strong>ORBITDER LAB</strong>
            <small>ออบิดเด้อ แลป • ห้องทดลองระบบสุริยะ</small>
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

          <section className="dwarf-section" aria-label="ดาวเคราะห์แคระ">
            <div className="dwarf-section-heading">
              <span>DWARF PLANETS</span>
              <strong>ดาวเคราะห์แคระ 5 ดวง</strong>
            </div>
            <div className="dwarf-grid">
              {DWARF_PLANETS.map((planet) => (
                <button
                  key={planet.key}
                  type="button"
                  className={`dwarf-item ${
                    selected === planet.key ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowDwarfs(true);
                    setSelected(planet.key);
                  }}
                >
                  <MiniPlanet
                    planet={planet}
                    active={selected === planet.key}
                  />
                  <span>
                    <strong>{planet.name}</strong>
                    <small>{planet.english}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="moon-total">
            <span className="moon-cluster" aria-hidden="true">● · •</span>
            <span>
              <strong>ดาวบริวารในฉาก 431 ดวง</strong>
              <small>ดาวเคราะห์ 422 • ดาวแคระ 9</small>
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
            aria-label="แบบจำลองระบบสุริยะสามมิติ มีดาวเคราะห์ ดาวเคราะห์แคระ แถบดาวเคราะห์น้อย และเมฆออร์ต ลากเพื่อหมุน เลื่อนเพื่อซูม และแตะดาวเพื่อดูข้อมูล"
          />

          <div className="scene-title">
            <p>THE SOLAR SYSTEM</p>
            <h2>ระบบสุริยะของเรา</h2>
            <span>8 ดาวเคราะห์ • 5 ดาวแคระ • แถบหิน • เมฆออร์ต</span>
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
              className={showDwarfs ? "active dwarf-filter" : ""}
              onClick={() => setShowDwarfs((value) => !value)}
              aria-pressed={showDwarfs}
            >
              <span className="filter-symbol">◇</span>
              ดาวแคระ
            </button>
            <button
              type="button"
              className={showAsteroids ? "active asteroid-filter" : ""}
              onClick={() => setShowAsteroids((value) => !value)}
              aria-pressed={showAsteroids}
            >
              <span className="filter-symbol">···</span>
              แถบดาวเคราะห์น้อย
            </button>
            <button
              type="button"
              className={showOort ? "active oort-filter" : ""}
              onClick={() => setShowOort((value) => !value)}
              aria-pressed={showOort}
            >
              <span className="filter-symbol">✦</span>
              เมฆออร์ต
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

          {(showAsteroids || showOort) && (
            <div className="deep-space-legend">
              {showAsteroids && (
                <span className="asteroid-key">
                  <i aria-hidden="true">•••</i>
                  แถบดาวเคราะห์น้อย 2.2–3.2 AU
                </span>
              )}
              {showOort && (
                <span className="oort-key">
                  <i aria-hidden="true">✦</i>
                  เมฆออร์ต 2,000–100,000 AU • บีบสเกล
                </span>
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

          <article
            className={`info-card ${infoCardOpen ? "expanded" : "collapsed"}`}
            style={{ "--accent": activePlanet.accent } as React.CSSProperties}
          >
            <button
              type="button"
              className="info-card-toggle"
              onClick={() => setInfoCardOpen((value) => !value)}
              aria-expanded={infoCardOpen}
              aria-label={`${infoCardOpen ? "ย่อ" : "ขยาย"}ข้อมูล${activePlanet.name}`}
            >
              <span className="selected-planet-visual">
                <MiniPlanet planet={activePlanet} active />
              </span>
              <span className="info-card-heading">
                <span className="planet-type">{activePlanet.kind}</span>
                <strong>{activePlanet.name}</strong>
                <span className="card-english">{activePlanet.english}</span>
              </span>
              <span className="info-card-toggle-icon" aria-hidden="true">
                {infoCardOpen ? "−" : "+"}
              </span>
            </button>

            {infoCardOpen && (
              <div className="info-card-details">
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
                {activePlanet.moons > 0 && (
                  <p className="moon-orbit-note">
                    <span aria-hidden="true" />
                    เส้นวงโคจรจริง {activeRealMoonCount} ดวง •
                    ดวงที่เหลือจำลองเป็นกลุ่มวงโคจร
                  </p>
                )}
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
                              className={
                                moonFactIndex === index ? "active" : ""
                              }
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
              </div>
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
          <span>เฟรมเวลา</span>
          {TIME_SCALES.map((scale) => (
            <button
              type="button"
              key={scale.days}
              className={daysPerFrame === scale.days ? "active" : ""}
              onClick={() => setDaysPerFrame(scale.days)}
              aria-label={scale.description}
              title={scale.description}
            >
              {scale.label}
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
