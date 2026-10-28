import { acl } from "./intermediate/acl";
import { dhcpServer } from "./intermediate/dhcp-server";
import { interVlan } from "./intermediate/inter-vlan";
import { intermediateExam } from "./intermediate/intermediate-exam";
import { iosCli } from "./intermediate/ios-cli";
import { ipv6Basics } from "./intermediate/ipv6-basics";
import { natPat } from "./intermediate/nat-pat";
import { officeProject } from "./intermediate/office-project";
import { ospf } from "./intermediate/ospf";
import { ospfDeep } from "./intermediate/ospf-deep";
import { qosBasics } from "./intermediate/qos-basics";
import { routingTroubleshooting } from "./intermediate/routing-troubleshooting";
import { staticRouting } from "./intermediate/static-routing";
import { stp } from "./intermediate/stp";
import { switchingTroubleshooting } from "./intermediate/switching-troubleshooting";
import { trunking } from "./intermediate/trunking";
import { vlanBasics } from "./intermediate/vlan-basics";
import type { CourseLevel } from "./types";

export const intermediateLevel: CourseLevel = {
  id: "intermediate",
  order: 2,
  title: "O'rta daraja",
  description:
    "Cisco qurilmalarini buyruqlar qatori orqali chuqur sozlaysiz: VLAN, trunk, STP, statik va OSPF marshrutlash, DHCP, ACL, NAT, QoS va IPv6. Terminal simulyatori, nosozlik tuzatish ssenariylari, trenajyorlar va yakuniy imtihon bilan.",
  outcome:
    "Kichik ofis tarmog'ini talablardan boshlab rejalashtirib, Packet Tracer'da noldan qurib, himoyalab, nosozliklarini show buyruqlari bilan topib bera olasiz. Imtihondan 80% bilan o'tish — 3-bosqichga tayyorlik belgisi.",
  lessons: [
    iosCli,
    vlanBasics,
    trunking,
    interVlan,
    stp,
    switchingTroubleshooting,
    staticRouting,
    ospf,
    ospfDeep,
    dhcpServer,
    acl,
    natPat,
    qosBasics,
    ipv6Basics,
    routingTroubleshooting,
    officeProject,
    intermediateExam,
  ],
};
