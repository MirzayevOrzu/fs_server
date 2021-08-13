const { grapExtention, isValidExtention, ExpressError } = require("./utils");

module.exports.validateFile = function (req, res, next) {
  const { filename, content } = req.body;

  if (filename === undefined) {
    next(new ExpressError("Please specify 'filename' parameter", 400));
  } else if (content === undefined) {
    next(new ExpressError("Please specify 'content' parameter", 400));
  } else {
    let extention = grapExtention(filename);
    if (!isValidExtention(extention)) {
      next(new ExpressError(`File extention ${extention} is not allowed`, 400));
    }
    next();
  }
};

module.exports.validateParams = function (req, res, next) {
  const { filename } = req.params;
  const extention = grapExtention(filename);

  if (!filename) {
    next(new ExpressError("Please specify 'filename' parameter", 400));
  } else if (isValidExtention(extention)) {
    next(new ExpressError(`File extention ${extention} is not allowed`, 400));
  } else {
    next();
  }
};
