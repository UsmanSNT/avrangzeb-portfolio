/**
 * Random practice question generators for the trainer step.
 * Pure functions (no React) so they can be unit-tested and reused.
 */

export type TrainerKind = "binary" | "subnet" | "wildcard";

export type SubnetAsk = "network" | "broadcast" | "first" | "last" | "hosts" | "mask";

export type TrainerParams =
  | { kind: "binary"; direction: "to-binary" | "to-decimal"; value: number }
  | { kind: "subnet"; ask: SubnetAsk; ip: number; prefix: number }
  | { kind: "wildcard"; direction: "to-wildcard" | "to-prefix"; prefix: number };

export type TrainerQuestion = {
  params: TrainerParams;
  /** Main thing to work on, shown large and monospaced (an address, a number). */
  subject: string;
  /** What to compute. */
  ask: string;
  placeholder: string;
  /** Step-by-step solution shown after answering. */
  solution: readonly string[];
};

type Random = () => number;

const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1] as const;

const pick = <T,>(items: readonly T[], random: Random): T => items[Math.floor(random() * items.length)];
const randomInt = (min: number, max: number, random: Random) => min + Math.floor(random() * (max - min + 1));

export function toDotted(value: number): string {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

export function prefixToMask(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

function toBinary8(value: number): string {
  return value.toString(2).padStart(8, "0");
}

function weightBreakdown(value: number): string {
  const parts = WEIGHTS.filter((weight, index) => toBinary8(value)[index] === "1");
  return parts.length ? parts.join(" + ") : "0";
}

/** Normalizes a learner's answer for comparison. */
export function normalizeTrainerAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "").replace(/^\//, "");
}

export function answerFor(params: TrainerParams): string {
  switch (params.kind) {
    case "binary":
      return params.direction === "to-binary" ? toBinary8(params.value) : String(params.value);
    case "wildcard":
      return params.direction === "to-wildcard" ? toDotted(~prefixToMask(params.prefix) >>> 0) : String(params.prefix);
    case "subnet": {
      const mask = prefixToMask(params.prefix);
      const network = (params.ip & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;
      switch (params.ask) {
        case "network":
          return toDotted(network);
        case "broadcast":
          return toDotted(broadcast);
        case "first":
          return toDotted(network + 1);
        case "last":
          return toDotted(broadcast - 1);
        case "hosts":
          return String(2 ** (32 - params.prefix) - 2);
        case "mask":
          return toDotted(mask);
      }
    }
  }
}

export function isTrainerAnswerCorrect(params: TrainerParams, typed: string): boolean {
  return normalizeTrainerAnswer(typed) === normalizeTrainerAnswer(answerFor(params));
}

const SUBNET_ASK_TEXT: Record<SubnetAsk, string> = {
  network: "Tarmoq manzili qanday?",
  broadcast: "Broadcast manzili qanday?",
  first: "Birinchi host manzili qanday?",
  last: "Oxirgi host manzili qanday?",
  hosts: "Nechta host manzili bor?",
  mask: "Subnet maskasi (o'nlik ko'rinishda) qanday?",
};

function subnetSolution(ip: number, prefix: number): string[] {
  const mask = prefixToMask(prefix);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const lines = [`Maska: /${prefix} = ${toDotted(mask)}`];
  if (prefix % 8 !== 0) {
    const octetIndex = Math.floor(prefix / 8);
    const maskOctet = (mask >>> (24 - octetIndex * 8)) & 255;
    const ipOctet = (ip >>> (24 - octetIndex * 8)) & 255;
    const step = 256 - maskOctet;
    const start = Math.floor(ipOctet / step) * step;
    lines.push(
      `Qiziq oktet — ${octetIndex + 1}-oktet: qadam = 256 − ${maskOctet} = ${step}`,
      `${ipOctet} soni ${start}–${start + step - 1} blokiga tushadi`,
    );
  }
  lines.push(
    `Tarmoq: ${toDotted(network)} · Broadcast: ${toDotted(broadcast)}`,
    `Hostlar: ${toDotted(network + 1)} – ${toDotted(broadcast - 1)} (2^${32 - prefix} − 2 = ${2 ** (32 - prefix) - 2} ta)`,
  );
  return lines;
}

function randomPrivateIp(random: Random): number {
  const range = randomInt(0, 2, random);
  const octets =
    range === 0
      ? [10, randomInt(0, 255, random), randomInt(0, 255, random), randomInt(0, 255, random)]
      : range === 1
        ? [172, randomInt(16, 31, random), randomInt(0, 255, random), randomInt(0, 255, random)]
        : [192, 168, randomInt(0, 255, random), randomInt(0, 255, random)];
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

// Prefixes inside the last octet come up most often at work, so they are weighted higher.
const SUBNET_PREFIXES = [16, 18, 19, 20, 21, 22, 23, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30] as const;
const SUBNET_ASKS: readonly SubnetAsk[] = ["network", "network", "broadcast", "broadcast", "first", "last", "hosts", "mask"];

export function generateQuestion(kind: TrainerKind, random: Random = Math.random): TrainerQuestion {
  if (kind === "binary") {
    const value = randomInt(1, 255, random);
    const direction = random() < 0.5 ? "to-binary" : "to-decimal";
    const params: TrainerParams = { kind, direction, value };
    return direction === "to-binary"
      ? {
          params,
          subject: String(value),
          ask: "8 bitli ikkilik ko'rinishga o'tkazing.",
          placeholder: "Masalan: 10101000",
          solution: [`${value} = ${weightBreakdown(value)}`, `128 64 32 16 8 4 2 1 → ${toBinary8(value)}`],
        }
      : {
          params,
          subject: toBinary8(value),
          ask: "O'nlik songa o'tkazing.",
          placeholder: "Masalan: 168",
          solution: [`1 turgan og'irliklar: ${weightBreakdown(value)}`, `Yig'indi: ${value}`],
        };
  }

  if (kind === "wildcard") {
    const prefix = randomInt(8, 30, random);
    const direction = random() < 0.6 ? "to-wildcard" : "to-prefix";
    const params: TrainerParams = { kind, direction, prefix };
    const mask = toDotted(prefixToMask(prefix));
    const wildcard = toDotted(~prefixToMask(prefix) >>> 0);
    return direction === "to-wildcard"
      ? {
          params,
          subject: `${mask} (/${prefix})`,
          ask: "Wildcard maskasi qanday?",
          placeholder: "Masalan: 0.0.0.255",
          solution: [`Har oktetni 255 dan ayiring: 255.255.255.255 − ${mask}`, `= ${wildcard}`],
        }
      : {
          params,
          subject: wildcard,
          ask: "Bu wildcard qaysi prefiksga (/n) to'g'ri keladi?",
          placeholder: "Masalan: /24",
          solution: [`Maska = 255.255.255.255 − ${wildcard} = ${mask}`, `Maskadagi 1 lar soni: /${prefix}`],
        };
  }

  const prefix = pick(SUBNET_PREFIXES, random);
  const ask = pick(SUBNET_ASKS, random);
  const ip = randomPrivateIp(random);
  return {
    params: { kind, ask, ip, prefix },
    subject: `${toDotted(ip)}/${prefix}`,
    ask: SUBNET_ASK_TEXT[ask],
    placeholder: ask === "hosts" ? "Son" : "Masalan: 192.168.1.0",
    solution: subnetSolution(ip, prefix),
  };
}
