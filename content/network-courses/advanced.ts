import { advancedExam } from "./advanced/advanced-exam";
import { automationBasics } from "./advanced/automation-basics";
import { ccnaPrep } from "./advanced/ccna-prep";
import { cloudNetworking } from "./advanced/cloud-networking";
import { documentation } from "./advanced/documentation";
import { enterpriseProject } from "./advanced/enterprise-project";
import { firewallBasics } from "./advanced/firewall-basics";
import { highAvailability } from "./advanced/high-availability";
import { incidentSimulation } from "./advanced/incident-simulation";
import { jobReady } from "./advanced/job-ready";
import { linuxForNetops } from "./advanced/linux-for-netops";
import { monitoring } from "./advanced/monitoring";
import { networkSecurity } from "./advanced/network-security";
import { packetAnalysis } from "./advanced/packet-analysis";
import { troubleshootingMethod } from "./advanced/troubleshooting-method";
import { wanVpn } from "./advanced/wan-vpn";
import { wirelessBasics } from "./advanced/wireless-basics";
import type { CourseLevel } from "./types";

export const advancedLevel: CourseLevel = {
  id: "advanced",
  order: 3,
  title: "Real tajriba va ishga tayyorgarlik",
  description:
    "Haqiqiy ish muhitiga tayyorgarlik: Linux va paket tahlili, professional nosozlik izlash, uzluksizlik (EtherChannel, HSRP), xavfsizlik va firewall, Wi-Fi, VPN, bulut tarmoqlari, monitoring, avtomatlashtirish, navbatchilik simulyatsiyasi, CCNA va intervyu.",
  outcome:
    "Ko'p filialli korxona tarmog'ini loyihalab, himoyalab, zaxiralab, kuzatib, nosozlikni dalil bilan topib va hujjatlashtirib bera olasiz — junior tarmoq muhandisi yoki NOC lavozimiga tayyor bo'lasiz.",
  lessons: [
    linuxForNetops,
    packetAnalysis,
    troubleshootingMethod,
    highAvailability,
    networkSecurity,
    firewallBasics,
    wirelessBasics,
    wanVpn,
    cloudNetworking,
    monitoring,
    automationBasics,
    documentation,
    incidentSimulation,
    enterpriseProject,
    ccnaPrep,
    advancedExam,
    jobReady,
  ],
};
