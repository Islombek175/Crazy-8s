import type { Session, Stroke } from '../types';

// Simple stroke helpers for sample sketches
function createBoxStroke(startX: number, startY: number, w: number, h: number): Stroke {
  return {
    tool: 'pen',
    color: '#171717',
    size: 2.5,
    points: [
      { x: startX, y: startY },
      { x: startX + w, y: startY },
      { x: startX + w, y: startY + h },
      { x: startX, y: startY + h },
      { x: startX, y: startY },
    ],
  };
}

function createCircleStroke(cx: number, cy: number, r: number): Stroke {
  const points = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    points.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * (r * 1.3),
    });
  }
  return {
    tool: 'pencil',
    color: '#333333',
    size: 2,
    points,
  };
}

export function generateSampleSession(): Session {
  const now = new Date();
  const pastDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2); // 2 days ago

  return {
    id: 'sample_session_journaling_01',
    challenge: 'How might we design a personal journaling tool that feels tactile?',
    context: 'Analog-first, distraction-free, encouraging daily habit without screen fatigue.',
    durationSeconds: 480,
    remainingSeconds: 0,
    elapsedSeconds: 480,
    status: 'completed',
    startTime: pastDate.getTime(),
    lastActiveTimestamp: pastDate.getTime() + 480000,
    createdAt: pastDate.toISOString(),
    updatedAt: pastDate.toISOString(),
    preferences: {
      defaultMode: 'draw',
      autoProgress: true,
      showPrompts: true,
      soundEnabled: false,
    },
    reflections: {
      surprise:
        'Idea 04 (the micro-embossing wax stamp) surprised me because it brings the sensory satisfaction of paper craft into quick daily logging.',
      potential:
        'Idea 08 (the single-sheet accordion pocket book) has the greatest commercial potential because it costs pennies to produce yet feels luxurious.',
      nextStep:
        'Fold physical card prototypes and test with three journaling enthusiasts over a 3-day weekend.',
    },
    ideas: [
      {
        id: 1,
        title: 'Single-Line Daily Ribbon',
        description:
          'A spool of narrow cotton paper ribbon with pre-printed numbered dates. You pull out 3 inches every evening and write just one sentence with an archival pen.',
        bulletPoints: [
          'Zero intimidation — physically limited to one line',
          'Brass desktop dispenser with serrated tear edge',
          'Roll lasts exactly 365 days',
        ],
        canvasData: null,
        strokes: [
          createBoxStroke(0.2, 0.35, 0.6, 0.25),
          {
            tool: 'pen',
            color: '#171717',
            size: 2,
            points: [
              { x: 0.25, y: 0.47 },
              { x: 0.75, y: 0.47 },
            ],
          },
        ],
        isFavorite: true,
        notes: 'Combine with brass desktop stand concept.',
        mode: 'draw',
      },
      {
        id: 2,
        title: 'Tactile Texture Grid',
        description:
          'Pages embossed with blind geometric debossings (linen, stone, wood grain) that guide your fingers to different parts of the day: morning reflection, noon observation, night closure.',
        bulletPoints: [
          'Pure sensory feedback without visual ink grid lines',
          'Encourages writing in dim bedside lighting',
          'Heavy 200gsm cotton rag paper',
        ],
        canvasData: null,
        strokes: [
          createBoxStroke(0.15, 0.2, 0.7, 0.6),
          createBoxStroke(0.25, 0.3, 0.5, 0.15),
          createBoxStroke(0.25, 0.55, 0.5, 0.15),
        ],
        isFavorite: false,
        notes: 'Test embossing depth on letterpress.',
        mode: 'draw',
      },
      {
        id: 3,
        title: 'Thermal Paper Matchbook',
        description:
          'A pocket-sized matchbook holding 14 tear-out leaves made of heat-reactive paper. You write with a warm brass stylus without any ink cartridge.',
        bulletPoints: [
          'No ink stains or leaking in pockets',
          'Stylus warms up slightly in palm',
          'Leaves can be filed into an archival library box',
        ],
        canvasData: null,
        strokes: [createBoxStroke(0.3, 0.2, 0.4, 0.55), createCircleStroke(0.5, 0.7, 0.1)],
        isFavorite: false,
        notes: '',
        mode: 'draw',
      },
      {
        id: 4,
        title: 'Embossing Stamp & Wax Seal Log',
        description:
          'A pocket journal with pre-carved symbol stamps (mood, weather, focus level) and cold-press embossing dies to summarize feelings through tactile relief.',
        bulletPoints: [
          'Immediate physical satisfaction of stamping',
          'Creates a rich 3D texture across the edge of the closed journal',
          'Requires zero language when emotionally exhausted',
        ],
        canvasData: null,
        strokes: [
          createCircleStroke(0.4, 0.45, 0.18),
          createCircleStroke(0.65, 0.45, 0.12),
          {
            tool: 'pen',
            color: '#171717',
            size: 3,
            points: [
              { x: 0.4, y: 0.35 },
              { x: 0.4, y: 0.55 },
              { x: 0.3, y: 0.45 },
              { x: 0.5, y: 0.45 },
            ],
          },
        ],
        isFavorite: true,
        notes: 'Very poetic and tactile. High delight factor.',
        mode: 'draw',
      },
      {
        id: 5,
        title: 'The Unfolding Accordion Map',
        description:
          'A single long folded strip that expands into a continuous panorama of your month. Each week connects seamlessly into the next rather than turning isolated pages.',
        bulletPoints: [
          'See the natural rhythm and arc of the month at a glance',
          'Folds back into a rigid hardcover case',
          'Can stand up on a desk like an architectural sculpture',
        ],
        canvasData: null,
        strokes: [
          {
            tool: 'pen',
            color: '#171717',
            size: 2.5,
            points: [
              { x: 0.1, y: 0.6 },
              { x: 0.3, y: 0.3 },
              { x: 0.5, y: 0.6 },
              { x: 0.7, y: 0.3 },
              { x: 0.9, y: 0.6 },
            ],
          },
        ],
        isFavorite: false,
        notes: '',
        mode: 'draw',
      },
      {
        id: 6,
        title: 'Audio-to-Ink Mechanical Scribe',
        description:
          'A small desktop mechanical device where you speak for 60 seconds into a horn, and an analog arm scores a wavy acoustic vibration line directly into soft cardstock.',
        bulletPoints: [
          'Zero Bluetooth, zero digital cloud storage',
          'Physical record of your voice frequency',
          'Feels like a 19th-century phonograph experiment',
        ],
        canvasData: null,
        strokes: [createCircleStroke(0.35, 0.5, 0.15), createBoxStroke(0.55, 0.35, 0.3, 0.3)],
        isFavorite: false,
        notes: 'A bit complex mechanically, but fascinating.',
        mode: 'draw',
      },
      {
        id: 7,
        title: 'Paper Slip Library Box',
        description:
          'Instead of a bound book, a solid walnut box with index dividers (Ideas, Doubts, Gratitudes, Quotations). You write on thick loose cards and file them immediately.',
        bulletPoints: [
          'No fear of ruining a pristine notebook',
          'Can shuffle, reorganize, and group cards by theme',
          'Tactile tabbed dividers made of unbleached chipboard',
        ],
        canvasData: null,
        strokes: [createBoxStroke(0.2, 0.3, 0.6, 0.4), createBoxStroke(0.25, 0.22, 0.2, 0.15)],
        isFavorite: false,
        notes: 'Classic Luhmann Zettelkasten feel.',
        mode: 'draw',
      },
      {
        id: 8,
        title: 'The Crazy 8 Daily Worksheet',
        description:
          'An architectural worksheet with eight die-cut window panels. Each morning, you fill out eight quick micro-intentions: 1 person to thank, 1 friction to remove, 1 thing to build, etc.',
        bulletPoints: [
          'Direct translation of Crazy 8s into personal productivity',
          'Folds down to passport size',
          'Perforated panels can be passed to colleagues or kept in wallet',
        ],
        canvasData: null,
        strokes: [
          createBoxStroke(0.15, 0.2, 0.7, 0.6),
          {
            tool: 'pen',
            color: '#171717',
            size: 1.5,
            points: [
              { x: 0.5, y: 0.2 },
              { x: 0.5, y: 0.8 },
            ],
          },
          {
            tool: 'pen',
            color: '#171717',
            size: 1.5,
            points: [
              { x: 0.15, y: 0.5 },
              { x: 0.85, y: 0.5 },
            ],
          },
        ],
        isFavorite: true,
        notes: 'Selected as top recommendation. Prototype ready.',
        mode: 'draw',
      },
    ],
  };
}
