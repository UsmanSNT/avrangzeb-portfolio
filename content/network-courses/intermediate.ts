import { acl } from "./intermediate/acl";
import { dhcpServer } from "./intermediate/dhcp-server";
import { interVlan } from "./intermediate/inter-vlan";
import { iosCli } from "./intermediate/ios-cli";
import { ipv6Basics } from "./intermediate/ipv6-basics";
import { natPat } from "./intermediate/nat-pat";
import { officeProject } from "./intermediate/office-project";
import { ospf } from "./intermediate/ospf";
import { staticRouting } from "./intermediate/static-routing";
import { stp } from "./intermediate/stp";
import { trunking } from "./intermediate/trunking";
import { vlanBasics } from "./intermediate/vlan-basics";
import type { CourseLevel } from "./types";

export const intermediateLevel: CourseLevel = {
  id: "intermediate",
  order: 2,
  title: "O'rta daraja",
  description:
    "Cisco qurilmalarini buyruqlar qatori orqali sozlaysiz: VLAN, trunk, STP, statik va OSPF marshrutlash, DHCP, ACL, NAT va IPv6. Har dars terminal simulyatori va Packet Tracer laboratoriyasi bilan.",
  outcome:
    "Kichik ofis tarmog'ini talablardan boshlab rejalashtirib, Packet Tracer'da noldan qurib, himoyalab va tekshirib bera olasiz.",
  lessons: [iosCli, vlanBasics, trunking, interVlan, stp, staticRouting, ospf, dhcpServer, acl, natPat, ipv6Basics, officeProject],
};
