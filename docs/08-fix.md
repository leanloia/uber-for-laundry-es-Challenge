# Iteración #8: Fix

Podemos agregar una pequeña solución para no vernos nosotros mismos como lavanderos disponibles.  
Cambie el filtro de búsqueda en la ruta '/launderers' para que podamos ver todos los lavanderos excepto nosotros mismos.

```js
router.get("/launderers", withAuth, async (req, res, next) => {
  try {
    const launderersList = await User.find({
        // realizamos la búsqueda y filtramos entre los User que...
      $and: [
          // ... sean launderers,
        { /* condición */ },
          // ... y no sean 'yo' mismo
        { /* condición */ },
      ],
    });

      // renderizo 'launderers' con la información que acabo de filtrar en launderersList

    });
  } catch (error) {
    next(err);
    return;
  }
});

module.exports = router;
```
