export function generateRegistrationId(eventSlug) {
  const slug = eventSlug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `CSI-${slug}-${stamp}${rand}`;
}
