export const graphSchema = {
  type: "object",
  required: ["nome", "struttura"],
  properties: {
    nome: { type: "string", minLength: 1 },
    struttura: {
      type: "object",
      minProperties: 1,
      additionalProperties: {
        type: "object",
        additionalProperties: { type: "number", minimum: 0 }
      }
    }
  },
  additionalProperties: false
};
