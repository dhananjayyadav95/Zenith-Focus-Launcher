
const MANTRAS = [
  "Stay intentional.",
  "Focus is a superpower.",
  "Do one thing at a time.",
  "Quiet the noise, find the signal.",
  "Less but better.",
  "Be present in this moment.",
  "Action is the antidote to anxiety.",
  "Simplify everything.",
  "Your attention is your life.",
  "Minimize the trivial, maximize the vital."
];

/**
 * Provides a random, minimalist focus mantra from a static list.
 */
export const getDailyMantra = (): string => {
  const index = new Date().getDate() % MANTRAS.length;
  return MANTRAS[index];
};
