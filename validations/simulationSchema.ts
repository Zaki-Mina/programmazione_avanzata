const simulationSchema = {
  type: "object",
  required: ["id", "from", "to", "wStart", "wEnd", "step"],
  properties: {
    id: { type: "number", minimum: 1 },
    from: { type: "string", pattern: "^[A-Za-z]+$" },
    to: { type: "string", pattern: "^[A-Za-z]+$" },
    wStart: { type: "number", minimum: 0 },
    wEnd: { type: "number", minimum: 0 },
    step: { type: "number", minimum: 0.001 }
  },
  additionalProperties: false
};

export default simulationSchema;
