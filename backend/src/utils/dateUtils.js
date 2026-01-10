exports.formatDate = (date = new Date()) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

exports.isPastDate = (date) => {
  return new Date(date) < new Date();
};

exports.addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
