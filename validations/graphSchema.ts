// Schema JSON per la validazione del grafo
const graphSchema = {
  type: "object",
  patternProperties: {
    "^[A-Za-z]+$": {
      type: "object",
      patternProperties: {
        "^[A-Za-z]+$": {
          type: "number",
          minimum: 0
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};

export default graphSchema;
