export const INSPIRATION_PROMPTS: string[] = [
  "What if the current solution were twice as simple?",
  "How could this work without its main feature?",
  "What would a beginner prefer?",
  "What would this look like on paper?",
  "How could two existing ideas be combined?",
  "What would make this experience more accessible?",
  "What if you had to explain this in three words?",
  "What if this was built for someone 80 years old? Or 8 years old?",
  "How would nature or biology solve this challenge?",
  "What is the most extreme or absurd version of this idea?",
  "What if there were zero screens or technology involved?",
  "What would happen if you reversed the entire process?",
  "How could this be done in 10 seconds instead of 10 minutes?",
  "What if you removed the most expensive or complex element?",
  "How could this feel magical, tactile, or poetic?",
  "What would a minimalist architect or printmaker design here?",
];

export function getRandomPrompt(currentPrompt?: string): string {
  const available = INSPIRATION_PROMPTS.filter((p) => p !== currentPrompt);
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] || INSPIRATION_PROMPTS[0];
}
