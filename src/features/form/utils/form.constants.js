/** @format */

// Shared field-type constants for the public form surface.
// Stored in the DB as plain strings; keep in sync with the CHECK constraint
// in supabase/migrations/0001_initial_schema.sql.
export const FORM_FIELD_TYPES = {
  SHORT_TEXT: "short_text",
  LONG_TEXT: "long_text",
  MULTIPLE_CHOICE: "multiple_choice",
};
