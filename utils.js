module.exports.catchError = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

module.exports.ExpressError = class extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message || "Server error";
    this.statusCode = statusCode || 500;
  }
};

module.exports.isValidExtention = (extention) => {
  const allowedExtentions = ["log", "txt", "json", "yaml", "xml", "js"];
  return allowedExtentions.includes(extention);
};

module.exports.grapExtention = (filename) =>
  filename.slice(filename.lastIndexOf(".") + 1);
