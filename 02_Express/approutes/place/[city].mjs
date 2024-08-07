export const get = async (req, res) => {
  const { city } = req.params;
  res.send(`Hello from ${city}`);
};