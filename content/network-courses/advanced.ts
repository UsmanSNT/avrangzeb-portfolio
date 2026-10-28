import { automationBasics } from "./advanced/automation-basics";
import { ccnaPrep } from "./advanced/ccna-prep";
import { documentation } from "./advanced/documentation";
import { enterpriseProject } from "./advanced/enterprise-project";
import { jobReady } from "./advanced/job-ready";
import { linuxForNetops } from "./advanced/linux-for-netops";
import { monitoring } from "./advanced/monitoring";
import { networkSecurity } from "./advanced/network-security";
import { troubleshootingMethod } from "./advanced/troubleshooting-method";
import { wanVpn } from "./advanced/wan-vpn";
import { wirelessBasics } from "./advanced/wireless-basics";
import type { CourseLevel } from "./types";

export const advancedLevel: CourseLevel = {
  id: "advanced",
  order: 3,
  title: "Real tajriba va ishga tayyorgarlik",
  description:
    "Haqiqiy ish muhitiga tayyorgarlik: Linux, professional nosozlik izlash, 2-qatlam xavfsizligi, Wi-Fi, VPN, monitoring, avtomatlashtirish, hujjatlashtirish, CCNA va intervyu.",
  outcome:
    "Ko'p filialli korxona tarmog'ini loyihalab, himoyalab, kuzatib, nosozlikni topib va hujjatlashtirib bera olasiz — junior tarmoq muhandisi lavozimiga tayyor bo'lasiz.",
  lessons: [
    linuxForNetops,
    troubleshootingMethod,
    networkSecurity,
    wirelessBasics,
    wanVpn,
    monitoring,
    automationBasics,
    documentation,
    enterpriseProject,
    ccnaPrep,
    jobReady,
  ],
};
