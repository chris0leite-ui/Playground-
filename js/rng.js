// Seedable RNG (mulberry32). Used so quests/loot rolls can be reproducible.
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Default instance keyed off boot time. Replace via seedRng(n) if needed.
let rng = makeRng((Math.random() * 1e9) | 0);
function seedRng(n) { rng = makeRng(n); }
function rrange(lo, hi) { return lo + rng() * (hi - lo); }
function rpick(arr) { return arr[Math.floor(rng() * arr.length)]; }
