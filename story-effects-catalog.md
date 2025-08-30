# Story Effects Catalog (authoring guide)

This catalog lists effect types you can use to build immersive, branching narratives. Effects are processed in order when a node is entered or a choice is selected. Shapes align with the current story JSON and near-term engine capabilities.

- Scope: current story session (chapter, node, variables)
- Order: top-to-bottom (later effects see earlier results)
- Guards: any effect may include `when: Condition[]`
- Persistence: variable changes are saved after the node/choice resolves
- Failure: non-fatal by default (logged and continue)
- Determinism: random effects should use a seeded RNG for reproducible replays

Condition shape: `{ var: string, op: 'eq'|'ne'|'lt'|'lte'|'gt'|'gte'|'in'|'notIn'|'includes'|'truthy'|'falsy', value?: any }`

Effect shape (generic): `{ op: string, var?: string, value?: any, target?: string, args?: object, when?: Condition[] }`

---

## 1) Narrative state (variables)

Core operations for number, boolean, string, enum, arrays, and objects.

- set: `{ op: 'set', var: 'visited_scene', value: 'office' }`
- inc / dec: `{ op: 'inc'|'dec', var: 'trust_partner', value: 1 }`
- toggle (boolean): `{ op: 'toggle', var: 'is_detective' }`
- clamp: `{ op: 'clamp', var: 'trust_partner', args: { min: -3, max: 3 } }`
- min / max: `{ op: 'min'|'max', var: 'hp', value: 10 }`
- multiply / divide: `{ op: 'mul'|'div', var: 'score', value: 2 }`
- reset to default: `{ op: 'reset', var: 'visited_scene' }`
- copy / swap:
  - `{ op: 'copy', args: { from: 'tmp.choice', to: 'last_choice' } }`
  - `{ op: 'swap', args: { a: 'aVar', b: 'bVar' } }`
- random:
  - number: `{ op: 'rand', var: 'luck', args: { min: 0, max: 1, step: 0.1 } }`
  - pick: `{ op: 'pick', var: 'target', args: { from: ['a','b','c'] } }`
- array/object helpers:
  - `{ op: 'push', var: 'seen_nodes', value: 'n6' }`
  - `{ op: 'remove', var: 'seen_nodes', value: 'n2' }`
  - `{ op: 'merge', var: 'flags', value: { stealth: true } }`
- flags:
  - `{ op: 'unlock', var: 'codex.noir101' }`
  - `{ op: 'lock', var: 'codex.noir101' }`

## 2) Flow control (navigation)

Control how the story advances.

- goto node (alias of "jump"): `{ op: 'goto', target: 'n6' }`
- goto chapter: `{ op: 'gotoChapter', target: 'ch2', args: { nodeId: 'n1' } }`
- conditional branch: `{ op: 'branch', args: { when: [{ var:'trust_partner', op:'lt', value:0 }], goto:'n2', else:'n3' } }`
- call / return (subroutine): `{ op: 'call', target: 'scene_id' }`, `{ op: 'return' }`
- checkpoint/bookmark: `{ op: 'bookmark', args: { label: 'after_intro' } }`
- end chapter / story: `{ op: 'endChapter' }`, `{ op: 'endStory' }`
- timed advance: `{ op: 'wait', args: { ms: 1200, then: { op:'goto', target:'nNext' } } }`

## 3) Choice presentation

Augment choice UX to increase immersion.

- timed choice: `{ op: 'choiceTimed', args: { seconds: 6, default: 'c2' } }`
- randomize choice order: `{ op: 'choiceShuffle' }`
- reveal hidden choice: `{ op: 'choiceReveal', args: { id: 'c3' } }`
- disable choice with hint: `{ op: 'choiceDisable', args: { id: 'c4', hint: 'Need lockpick' } }`
- multi-select: `{ op: 'choiceMulti', args: { max: 2 } }`

## 4) Inventory and economy (optional)

- add/remove item: `{ op: 'addItem'|'removeItem', args: { id: 'lockpick', qty: 1 } }`
- has item gate (via conditions): `{ var:'inv.lockpick', op:'gte', value:1 }`
- currency: `{ op: 'currency', args: { name: 'credits', delta: -10 } }`

## 5) Relationships & reputation

- adjust relationship: `{ op: 'rel', args: { who: 'partner', delta: +1 } }`
- set faction rep: `{ op: 'rep', args: { faction: 'LAPD', value: 10 } }`
- reveal codex entry: `{ op: 'unlock', var: 'codex.partner_backstory' }`

## 6) Skills & progression

- gain XP / level: `{ op: 'xp', args: { delta: 20 } }`, `{ op: 'levelUp' }`
- unlock perk: `{ op: 'perk', args: { id: 'keen_eyes' } }`
- skill check with outcomes:

```
{
  "op": "skillCheck",
  "args": {
    "skill": "perception",
    "dc": 12,
    "success": { "op": "goto", "target": "n_success" },
    "failure": { "op": "goto", "target": "n_fail" }
  }
}
```

## 7) Presentation & immersion (AV, haptics, transitions)

- images/backgrounds:
  - `{ op: 'bg', args: { image: 'assets/scenes/office.jpg', transition: 'fade', ms: 400 } }`
- text effects:
  - `{ op: 'textEffect', args: { type: 'typewriter', speed: 24 } }`
- transitions:
  - `{ op: 'transition', args: { type: 'fade'|'slide'|'zoom', ms: 300 } }`
- camera/screen:
  - `{ op: 'shake', args: { intensity: 0.5, ms: 400 } }`
  - `{ op: 'flash', args: { color: '#fff', ms: 120 } }`
- audio (expo-av):
  - play/stop music: `{ op: 'music', args: { src: 'assets/audio/loop.mp3', loop: true, action: 'play'|'stop' } }`
  - crossfade: `{ op: 'musicFade', args: { to: 0.3, ms: 800 } }`
  - sfx: `{ op: 'sfx', args: { src: 'assets/audio/door.wav', volume: 0.8 } }`
- haptics (expo-haptics):
  - `{ op: 'haptic', args: { type: 'impactMedium'|'notificationSuccess'|'selection' } }`
- device:
  - keep awake (expo-keep-awake): `{ op: 'keepAwake', args: { on: true } }`
  - orientation (expo-screen-orientation): `{ op: 'orientation', args: { lock: 'PORTRAIT' } }`
  - brightness (expo-brightness): `{ op: 'brightness', args: { value: 0.8 } }`

## 8) Accessibility & localization

- TTS (expo-speech): `{ op: 'tts', args: { text: '{{currentLine}}', voice: 'en-US' } }`
- high contrast: `{ op: 'a11yContrast', args: { on: true } }`
- text scale: `{ op: 'a11yTextScale', args: { factor: 1.2 } }`
- language switch: `{ op: 'lang', args: { code: 'es' } }`

## 9) Monetization & unlocks (if enabled)

- unlock premium: `{ op: 'unlockPremium', args: { chapter: 'ch2' } }`
- consume ticket: `{ op: 'ticket', args: { delta: -1 } }`
- rewarded step: `{ op: 'reward', args: { id: 'ad_viewed' } }`

## 10) Meta, analytics, and debug

- analytics event: `{ op: 'track', args: { name: 'choice_selected', props: { choiceId: 'c1' } } }`
- achievement: `{ op: 'achievement', args: { id: 'first_choice' } }`
- debug log: `{ op: 'log', args: { level: 'info', message: 'Entered alley scene' } }`

---

## Guards (conditions)

Any effect can include `when` to guard execution:

```
{
  "op": "set",
  "var": "visited_scene",
  "value": "office",
  "when": [{ "var": "trust_partner", "op": "gte", "value": 0 }]
}
```

## Authoring guidance

- Namespace variables (e.g., `rel.partner`, `inv.lockpick`).
- Clamp numeric stats to avoid runaway values.
- Batch presentational effects near the end for readability.
- Use seeded randomness for replayable tests.
- Place a `bookmark` before long sequences for smooth resumes.

## Engine compatibility

- Already in sample: `set`, `inc`, `dec`, and `goto`-style via `target` (alias of `jump`).
- Near-term: `toggle`, `clamp`, array/object helpers, timed choices, transitions, audio, haptics.
- Optional modules: inventory/economy, skills, monetization (feature-flagged).

## Example (expanded choice)

```
{
  "id": "c1",
  "text": "Interview the business partner",
  "effects": [
    { "op": "set", "var": "visited_scene", "value": "office" },
    { "op": "inc", "var": "trust_partner", "value": 1 },
    { "op": "haptic", "args": { "type": "selection" } },
    { "op": "transition", "args": { "type": "fade", "ms": 300 } },
    { "op": "goto", "target": "n4" }
  ]
}
```

---

## Advanced effects and long-term extensions

To maximize immersion, retention, and flexibility, consider these additional categories. They’re designed to be additive and backward-compatible with existing stories.

### A) Session, pacing, and retention

- streaks: `{ op: 'streak', args: { delta: +1, award: [{ op:'reward', args:{ id:'streak_day_7' }}] } }`
- sessionStart/sessionEnd hooks: `{ op: 'session', args: { on: 'start'|'end' } }`
- recap: `{ op: 'recap', args: { lines: 3, style: 'summary' } }`
- cliffhanger push: `{ op: 'notifyLater', args: { minutes: 30, title: 'New lead unlocked', body: 'Pick up from the alley…' } }`
- cooldowns: `{ op: 'cooldown', args: { key: 'retry_choice_c2', seconds: 120 } }`

### B) Live ops and remote config

- remoteFlag gate: `{ op: 'feature', args: { key: 'halloween_event', default: false, then: { op:'goto', target:'n_spooky' } } }`
- liveEvent window: `{ op: 'eventWindow', args: { start: '2025-10-28T00:00:00Z', end: '2025-11-02T00:00:00Z', fallback: { op:'goto', target:'n_regular' } } }`
- rollout variants (A/B): `{ op: 'experiment', args: { key: 'choice_copy_test', variants: ['A','B'], assign: 'sticky' } }`

### C) Social and sharing (asynchronous)

- share progress: `{ op: 'share', args: { text: 'I chose the alley…', url: 'https://story.pa/th/...' } }`
- friend assist token: `{ op: 'assist', args: { grant: 1, message: 'Help me unlock Chapter 2' } }`
- community poll (read-only): `{ op: 'poll', args: { id: 'branch_vote', resultsVar: 'poll.branch_vote' } }`

### D) Economy and meta progression (advanced)

- multi-currency: `{ op: 'wallet', args: { currency: 'tickets', delta: -1 } }`
- energy/stamina: `{ op: 'energy', args: { delta: -1, min: 0, recoverPerMinute: 1 } }`
- loot table: `{ op: 'loot', args: { table: 'noir_common', count: 1 } }`
- pity counter: `{ op: 'pity', args: { table: 'noir_rare', threshold: 20 } }`

### E) Personalization and accessibility (advanced)

- theme: `{ op: 'theme', args: { mode: 'noir'|'classic'|'highContrast' } }`
- font & speed: `{ op: 'reader', args: { font: 'serif', textSpeed: 1.1 } }`
- dyslexic-friendly font: `{ op: 'a11yFont', args: { family: 'OpenDyslexic' } }`
- color-blind filter: `{ op: 'colorFilter', args: { type: 'deuteranopia' } }`
- captions/subtitles: `{ op: 'captions', args: { on: true } }`

### F) Device sensors and ambient context

- motion trigger (expo-sensors): `{ op: 'motion', args: { type: 'shake', then: { op:'goto', target:'n_shaken' } } }`
- tilt choice: `{ op: 'tiltChoice', args: { axis: 'x', threshold: 0.3, left: 'c1', right: 'c2' } }`
- microphone input (gate): `{ op: 'mic', args: { listen: true, timeoutMs: 3000 } }`
- location gate: `{ op: 'geo', args: { countryIn: ['US','GB'], else: { op:'goto', target:'n_global' } } }`
- time-of-day: `{ op: 'timeofday', args: { in: ['night'], then: { op:'bg', args:{ image:'assets/night.jpg' } } } }`

### G) Notifications and re-engagement

- schedule: `{ op: 'notify', args: { at: '+2h', title: 'Case update', body: 'New lead available.' } }`
- cancel: `{ op: 'notifyCancel', args: { id: 'case_update' } }`
- permissions: `{ op: 'notifyPerms', args: { request: true } }`

### H) Analytics, experiments, and safety

- funnel step: `{ op: 'funnel', args: { name: 'ch1_choice', step: 2 } }`
- set user property: `{ op: 'analyticsUser', args: { key: 'cohort', value: 'noir' } }`
- experiment override: `{ op: 'experimentSet', args: { key: 'choice_copy_test', variant: 'B' } }`
- privacy opt-out: `{ op: 'privacy', args: { analytics: false } }`
- age gate: `{ op: 'ageGate', args: { min: 13, else: { op:'endStory' } } }`

### I) Performance, assets, and caching

- prefetch assets: `{ op: 'prefetch', args: { images: ['assets/scenes/office.jpg'] } }`
- release assets: `{ op: 'release', args: { images: ['assets/scenes/office.jpg'] } }`
- cache bust: `{ op: 'cache', args: { action: 'clear' } }`
- network prefetch: `{ op: 'prefetchNet', args: { urls: ['https://.../next.json'] } }`

### J) State, cloud save, and sync

- save checkpoint to server: `{ op: 'save', args: { label: 'after_ch1' } }`
- load checkpoint: `{ op: 'load', args: { label: 'after_ch1', ifMissing: 'ignore' } }`
- conflict policy: `{ op: 'syncPolicy', args: { prefer: 'server'|'device'|'newer' } }`

### K) Testing and QA

- seed RNG: `{ op: 'seed', args: { value: 1337 } }`
- trace on/off: `{ op: 'trace', args: { on: true } }`
- no-op for scaffolding: `{ op: 'noop' }`
- screenshot mode: `{ op: 'screenshotMode', args: { on: true } }`

---

## Schema extensions (authoring)

To support the above, extend effect validation with:

- `op` enum registry and per-op `args` schemas.
- `when` as an array of conditions with AND semantics; support nested OR via `{ any: [ ... ] }`.
- Namespaced variables (`rel.partner`, `inv.lockpick`), and typed defaults (number, boolean, string, enum, object, array).
- Timers & cooldowns: ephemeral session store (`tmp.*`) and persistent store (`vars.*`).

Example effect with guard and nested OR:

```
{
  "op": "branch",
  "when": [ { "any": [ { "var": "visited_scene", "op": "eq", "value": "office" }, { "var": "trust_partner", "op": "gte", "value": 1 } ] } ],
  "args": { "goto": "n4", "else": "n5" }
}
```

---

## Phased roadmap

- MVP (immediate): toggle, clamp, push/remove/merge, choiceTimed, transition, haptic, prefetch, notify (basic), seed/trace.
- Phase 2: experiments/feature flags, bookmarks, energy, wallet, recap, live event windows, audio crossfade.
- Phase 3: sensors (shake/tilt), geo/time-of-day, cloud save with conflict policy, advanced a11y (dyslexic font, color filters), social share/assist.
- Phase 4+: loot/pity, polls, multi-select choices with costs, advanced analytics funnels, remote layout/presentation tuning.

All new ops should degrade gracefully when a capability/module isn’t available (e.g., no haptics on some devices), emitting a warning rather than failing the story.
