# Iteración #8: Fix

Podemos agregar una pequeña solución para no vernos nosotros mismos como lavanderos disponibles.  
Cambie el filtro de búsqueda en la ruta '/launderers' para que podamos ver todos los lavanderos excepto nosotros mismos.

```js
router.get("/launderers", withAuth, async (req, res, next) => {
  try {
    const launderersList = await User.find({
      $and: [
        { isLaunderer: true },
        { _id: { $ne: req.userID } },
      ],
    });
    res.render("laundry/launderers", {
      launderers: launderersList,
    });
  } catch (error) {
    next(err);
    return;
  }
});
```