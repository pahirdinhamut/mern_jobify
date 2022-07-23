#### node JS ile api olusturnak

- ilk olarak express kutuphanesi indiryoruz
  ```sh
  npm i express
  ```
- server.js dosyasi olustur

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome api ");
});
// dotenv dosyasindaki port 4000 eger oyle bir ayar olmazsa 3300 portunda calisacak
const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log(`Server is runing ${port}`);
});
```

#### bazi guvenlikler icin function yaziyoruz

- ilk fonction ise hata router ayiklama fonction
- middleware klasor kur
- not_founde.js dosyasyi kur

```js
const notFoundMiddleware = (req, res) =>
  res.status(404).send("Route doens not exist");

export default notFoundMiddleware;
```

- server.js doyasina git ve asadakileri ekle

```js
import notFoundMiddleware from "./middleware/node_found.js";
app.use(notFoundMiddleware);
```

- boyle hata girilen routlerin onunu kapatmis olacaz
