export const executeSchema = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    start: { type: "string", minLength: 1 },
    goal: { type: "string", minLength: 1 }
  },
  required: ["id", "start", "goal"],
  additionalProperties: false
};
