/**
 * Lenient Cisco IOS command matching for the CLI simulator.
 *
 * Rules, per token of the canonical command:
 * - lowercase keywords (`configure`, `running-config`) accept any prefix: `conf`, `run`;
 * - interface names (`gigabitEthernet0/0.10`) accept a prefix of the type plus the exact number,
 *   written together or apart: `g0/0.10`, `gi 0/0.10`;
 * - everything else (numbers, addresses, names, passwords) must match exactly, ignoring case.
 *
 * Real IOS rejects ambiguous prefixes; this matcher is deliberately more forgiving because it only
 * checks that the learner typed the intended command.
 */

const INTERFACE_TYPES = ["fastethernet", "gigabitethernet", "ethernet", "serial", "loopback", "vlan", "tunnel", "port-channel"];

const KEYWORD = /^[a-z][a-z-]*$/;
const INTERFACE = /^([a-z-]+)([0-9][0-9/.:]*)$/i;

function tokenize(command: string): string[] {
  return command.trim().split(/\s+/).filter(Boolean);
}

function isPrefix(typed: string, full: string): boolean {
  return typed.length > 0 && full.toLowerCase().startsWith(typed.toLowerCase());
}

function splitInterface(token: string): { type: string; number: string } | null {
  const match = INTERFACE.exec(token);
  if (!match || !INTERFACE_TYPES.includes(match[1].toLowerCase())) return null;
  return { type: match[1], number: match[2] };
}

function matchTokens(typed: readonly string[], i: number, canon: readonly string[], j: number): boolean {
  if (j === canon.length) return i === typed.length;
  if (i >= typed.length) return false;

  const expected = canon[j];
  const actual = typed[i];

  if (KEYWORD.test(expected)) {
    return isPrefix(actual, expected) && matchTokens(typed, i + 1, canon, j + 1);
  }

  const iface = splitInterface(expected);
  if (iface) {
    const joined = /^([a-z-]+)([0-9][0-9/.:]*)$/i.exec(actual);
    if (joined && isPrefix(joined[1], iface.type) && joined[2].toLowerCase() === iface.number.toLowerCase()) {
      if (matchTokens(typed, i + 1, canon, j + 1)) return true;
    }
    const next = typed[i + 1];
    if (/^[a-z-]+$/i.test(actual) && isPrefix(actual, iface.type) && next?.toLowerCase() === iface.number.toLowerCase()) {
      if (matchTokens(typed, i + 2, canon, j + 1)) return true;
    }
    return false;
  }

  return actual.toLowerCase() === expected.toLowerCase() && matchTokens(typed, i + 1, canon, j + 1);
}

export function matchesIosCommand(typed: string, canonical: string): boolean {
  return matchTokens(tokenize(typed), 0, tokenize(canonical), 0);
}

export function matchesAnyIosCommand(typed: string, accepted: readonly string[]): boolean {
  return accepted.some((canonical) => matchesIosCommand(typed, canonical));
}
