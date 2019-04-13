const error = async (req, res) => {
  req.error = req.error || { status: 500, error: 'Internal server error' };
  res.status(req.error.status).json(req.error);
};
module.exports = error;
