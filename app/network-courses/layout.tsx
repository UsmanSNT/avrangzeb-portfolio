import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tarmoq darslari | Avrangzeb Abdujalilov",
  description:
    "Tarmoq mutaxassisi bo'lishning amaliy yo'li: boshlang'ichdan ishga tayyorgarlikkacha bosqichma-bosqich darslar, terminal mashqlari va Packet Tracer laboratoriyalari.",
};

export default function NetworkCoursesLayout({ children }: { children: ReactNode }) {
  return children;
}
