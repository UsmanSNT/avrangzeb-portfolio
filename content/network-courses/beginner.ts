import { dnsDhcpPorts } from "./beginner/dns-dhcp-ports";
import { ipv4Binary } from "./beginner/ipv4-binary";
import { macArp } from "./beginner/mac-arp";
import { netBasics } from "./beginner/net-basics";
import { osiTcpip } from "./beginner/osi-tcpip";
import { routingBasics } from "./beginner/routing-basics";
import { subnetCidr } from "./beginner/subnet-cidr";
import { switching } from "./beginner/switching";
import { troubleshooting } from "./beginner/troubleshooting";
import type { CourseLevel } from "./types";

export const beginnerLevel: CourseLevel = {
  id: "beginner",
  order: 1,
  title: "Boshlang'ich bosqich",
  description:
    "Tarmoq qanday ishlashini noldan tushunasiz: manzillar, qatlamlar, switch, router va asosiy protokollar. Har dars qisqa qadamlardan iborat va kompyuterda bajariladigan mashq bilan tugaydi.",
  outcome:
    "Bosqich oxirida siz uy yoki kichik ofis tarmog'ida «internet ishlamayapti» muammosini ketma-ket tekshirib, sababni topa olasiz.",
  lessons: [netBasics, osiTcpip, ipv4Binary, subnetCidr, macArp, switching, routingBasics, dnsDhcpPorts, troubleshooting],
};
