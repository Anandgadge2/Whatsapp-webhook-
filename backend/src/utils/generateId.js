exports.generateId = (prefix, count) => {
  return `${prefix}${String(count + 1).padStart(6, "0")}`;
};

exports.fallbackId = (prefix) => {
  return `${prefix}${Date.now().toString().slice(-6)}`;
};
