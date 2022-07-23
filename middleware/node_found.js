// hatali routerlar icin girisi engeliyouruz
const notFoundMiddleware = (req, res) =>
  res.status(404).send("Route doens not exist");

export default notFoundMiddleware;
