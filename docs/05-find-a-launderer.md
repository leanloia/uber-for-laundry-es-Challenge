# Iteración #5: Encuentra un Launderer

En última instancia, queremos que nuestros usuarios obtengan la recogida de su ropa. Ese proceso comienza por encontrar un lavandero para su recolección. Hagamos una página que muestre una lista de usuarios que se han convertido en lavanderos.

Antes de comenzar, regístrese e inicie sesión como 5 usuarios diferentes. Conviértete en un lavandero con 3 de ellos.

Ahora tenemos algunos usuarios que son lavanderos y otros que no lo son.

Para mostrar la lista de lavanderos, haremos que los usuarios visiten la página /launderers. Eso significa que necesitamos agregar una ruta para /launderers.

Añada la nueva ruta GET /launderers después de las demás rutas en routes/laundry.js

```js
// ... inside of routes/laundry.js

router.get("/launderers", withAuth, async (req, res, next) => {
  try {
    const launderersList =
      /* buscamos User y filtramos por aquellos que son launderers*/

      // renderizamos nuestra vista 'launderers' con el resultado de nuestra búsqueda

  } catch (error) {
    next(err);
    return;
  }
});

module.exports = router;
```

Visite la página para ver la lista de lavanderos.

Siguiente - programar una recolección.
