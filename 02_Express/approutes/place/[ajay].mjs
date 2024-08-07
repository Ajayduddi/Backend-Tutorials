export const defaultFunc =  (req, res) => {
  const { ajay } = req.params;
  res.send(`Hello from ${ajay}`);
};