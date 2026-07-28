import type { Metadata } from "next";
import SolarSystem from "./SolarSystem";

export const metadata: Metadata = {
  title: "Orbitder Lab (ออบิดเด้อ แลป) — ห้องทดลองระบบสุริยะ",
  description:
    "สำรวจวงโคจร แรงโน้มถ่วง และเรื่องน่ารู้ของดาวเคราะห์ทั้ง 8 ดวงในแบบจำลอง 3 มิติ",
};

export default function Home() {
  return <SolarSystem />;
}
