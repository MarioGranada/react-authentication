function isValidText(value, minLength = 1, maxLength = 2000) {
  return (
    typeof value === 'string' &&
    value.trim().length >= minLength &&
    value.length <= maxLength
  );
}

function isValidDate(value) {
  return typeof value === 'string' && value.length <= 30 && !Number.isNaN(new Date(value).getTime());
}

function isValidImageUrl(value) {
  return typeof value === 'string' && value.length <= 2000 && /^https?:\/\//.test(value);
}

function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+$/.test(value);
}

exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;
