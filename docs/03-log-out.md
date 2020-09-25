# Iteración #3: Log Out

Ahora que hemos iniciado sesión, necesitamos poder cerrar sesión. Tenemos links a la ruta /logout en nuestra aplicación, solo tenemos que definir esa ruta.

Añadir el siguiente:

```js
// ... inside of routes/auth.js
const withAuth = require("../helpers/middleware");
...

router.get("/logout", withAuth, (req, res) => {
  // seteamos el token con un valor vacío y una fecha de expiración en el pasado (Jan 1st 1970 00:00:00 GMT)
  res.cookie("token", "", { expires: new Date(0) });
  res.redirect("/");
});

module.exports = router;
```

Destacar:

    Line 120: seteamos el token con un valor vacío y una fecha de expiración en el pasado para cerrar sesión.
    Line 121: redirecciona a la página de inicio cuando haya terminado.

Siguiente - Conviértete en un lavandero.