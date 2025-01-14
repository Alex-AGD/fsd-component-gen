export function validateComponentName(name) {
    return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}
export function validateLayer(layer, allowedLayers) {
    return allowedLayers.includes(layer);
}
