const MAX_ANSWER_KEYS = 100;
const MAX_ANSWER_LENGTH = 10_000;

/** Apply client-side limits before sending answers to the database. */
function sanitizeAnswers(answers) {
  if (answers === null || answers === undefined || Array.isArray(answers)) {
    throw new Error("Answers must be an object keyed by field id.");
  }

  const cleaned = {};

  for (const [key, value] of Object.entries(answers)) {
    if (typeof key !== "string" || key.length > 64) continue;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed !== "") cleaned[key] = trimmed.slice(0, MAX_ANSWER_LENGTH);
    } else if (value !== null && value !== undefined) {
      cleaned[key] = String(value).slice(0, MAX_ANSWER_LENGTH);
    }
  }

  const keys = Object.keys(cleaned);
  if (keys.length === 0) throw new Error("No answers to submit.");
  if (keys.length > MAX_ANSWER_KEYS) {
    throw new Error("Too many answers in this response.");
  }

  return cleaned;
}

export { sanitizeAnswers, MAX_ANSWER_KEYS, MAX_ANSWER_LENGTH };
