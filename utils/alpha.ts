export function getAlpha(): number {
  const envAlpha = parseFloat(process.env.ALPHA || "");
  if (isNaN(envAlpha) || envAlpha <= 0 || envAlpha >= 1) {
    console.warn("ALPHA non valido, uso fallback 0.8");
    return 0.8;
  }
    console.log("Alpha caricato da .env:", envAlpha); 

  return envAlpha;
}