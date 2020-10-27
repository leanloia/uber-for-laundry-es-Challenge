# Iteración #3: Log Out

Ahora que hemos iniciado sesión, necesitamos poder cerrar sesión. Tenemos links a la ruta /logout en nuestra aplicación, solo tenemos que definir esa ruta.

Añadir el siguiente:

```js
// ... inside of routes/auth.js

router.get("/logout", withAuth, (req, res) => {
  
    // 1ro - Seteamos el token con un valor vacío y una fecha de expiración en el pasado (Jan 1st 1970 00:00:00 GMT) - Esto es una forma práctica de 'anular' el token, y por ende desloguearnos.
    
    // 2do - Redirigimos a nuestra ruta '/'
});

module.exports = router;
```



Siguiente - Conviértete en un lavandero.