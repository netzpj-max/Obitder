import type { Metadata } from "next";
import SolarSystem from "./SolarSystem";

export const metadata: Metadata = {
  title: "Orbitder Lab (ออบิดเด้อ แลป) — ห้องทดลองระบบสุริยะ",
  description:
    "สำรวจดาวเคราะห์ทั้ง 8 ดาวเคราะห์แคระ 5 ดวง แถบดาวเคราะห์น้อย เมฆออร์ต วงโคจร และแรงโน้มถ่วงในแบบจำลอง 3 มิติ",
};

export default function Home() {
  return <SolarSystem />;
}
