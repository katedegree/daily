export const today = () =>
  new Date().toISOString().slice(0, 10).replace(/-/g, "");
