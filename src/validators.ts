export function validateComponentName(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}

export function validateLayer(layer: string, allowedLayers: string[]): boolean {
  return allowedLayers.includes(layer);
}
