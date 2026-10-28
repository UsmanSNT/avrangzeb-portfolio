import { beginnerExam } from "./beginner/beginner-exam";
import { dnsDhcpPorts } from "./beginner/dns-dhcp-ports";
import { ethernetIpv4Headers } from "./beginner/ethernet-ipv4-headers";
import { ipv4Binary } from "./beginner/ipv4-binary";
import { macArp } from "./beginner/mac-arp";
import { netBasics } from "./beginner/net-basics";
import { osiTcpip } from "./beginner/osi-tcpip";
import { physicalLayer } from "./beginner/physical-layer";
import { routingBasics } from "./beginner/routing-basics";
import { subnetCidr } from "./beginner/subnet-cidr";
import { switching } from "./beginner/switching";
import { tcpUdpDeep } from "./beginner/tcp-udp-deep";
import { troubleshooting } from "./beginner/troubleshooting";
import { vlsm } from "./beginner/vlsm";
import type { CourseLevel } from "./types";

export const beginnerLevel: CourseLevel = {
  id: "beginner",
  order: 1,
  title: "Boshlang'ich bosqich",
  description:
    "Tarmoq qanday ishlashini noldan va chuqur o'rganasiz: kabellar, qatlamlar, paket sarlavhalari, subnetting va VLSM, switch, router, TCP/UDP, DNS/DHCP va diagnostika. Cheksiz trenajyorlar va yakuniy imtihon bilan.",
  outcome:
    "Subnetting'ni tez va xatosiz yechasiz, Wireshark'da paketni o'qiysiz va uy yoki kichik ofis tarmog'idagi muammoning sababini ketma-ket tekshirib topasiz. Imtihondan 80% bilan o'tish — keyingi bosqichga tayyorlik belgisi.",
  lessons: [
    netBasics,
    physicalLayer,
    osiTcpip,
    ethernetIpv4Headers,
    ipv4Binary,
    subnetCidr,
    vlsm,
    macArp,
    switching,
    routingBasics,
    dnsDhcpPorts,
    tcpUdpDeep,
    troubleshooting,
    beginnerExam,
  ],
};
