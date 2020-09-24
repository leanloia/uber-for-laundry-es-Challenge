# Iteración #7: recogidas pendientes

Finalmente, necesitamos mostrar las recogidas pendientes de un usuario. El lugar obvio para ver esta lista es la página dashboard. Agreguemos una consulta adicional a esa ruta.

Puede ver nuestra revisada ruta /dashboard en las líneas 32-51 de routes/laundry.js:

```js
// ... inside of routes/laundry.js

router.get("/dashboard", withAuth, async (req, res, next) => {
  // si existe req.userID, quiere decir que el middleware withAuth ha devuelto el control a esta ruta
  if (req.userID) {
    try {
        // obtenemos los datos actualizados del user y lo seteamos en res.locals.currentUserInfo
      const userUpdated = await User.findById({ _id: req.userID });
      res.locals.currentUserInfo = userUpdated;

      let query;

      if (res.locals.currentUserInfo.isLaunderer) {
        query = { launderer: res.locals.currentUserInfo._id };
      } else {
        query = { user: res.locals.currentUserInfo._id };
      }

      const pickupDocs = await LaundryPickup.find(query)
        .populate("user", "name")
        .populate("launderer", "name")
        .sort("pickupDate")
        .exec()

      res.render("laundry/dashboard", {
        pickups: pickupDocs,
      });
    } catch (error) {
      next(err);
      return;
    }
  } else {
    // en caso contrario (si no hay token) redirigimos a la home
    res.redirect("/");
  }
});

router.post('/launderers', (req, res, next) => {
// ...
```

Aspectos destacados de la nueva ruta /dashboard:

    Líneas 20-24: cambia la consulta en función de si eres o no un lavandero. Si el usuario es un lavador de ropa, busca recoger ropa para lavar. De lo contrario, muestra las recogidas de ropa que pidió.
    Líneas 26-30: llama a varios métodos Mongoose para crear una consulta más complicada, y finaliza con una llamada al método exec().
    Líneas 27-28: dado que las propiedades del usuario y del lavandero son referencias a otros documentos, estamos solicitando que esas referencias se rellenen previamente con la propiedad de nombre del modelo User.
    Línea 29: ordena por fecha de recogida en orden ascendente (las fechas más lejanas son las últimas).
    Líneas 32-34: renderiza la plantilla views/laundry/dashboard.hbs.
    Línea 33: pasa los resultados de la consulta (pickupDocs) como la variable local pickups.

Ahora que estamos consultando información adicional en la ruta, necesitamos mostrarla en la vista.

En nuestras líneas 26-38 en views/laundry/dashboard.hbs:

```html
<!-- ... inside of views/laundry/dashboard.hbs -->
<h3> Pending Pickups </h3>
<ul>
{{#each pickups}}
    <li>
      <h4> {{ this.pickupDate }} </h4>

      <ul>
        <li> <b>User</b>: {{ this.user.name }} </li>
        <li> <b>Launderer</b>: {{ this.launderer.name }} </li>
      </ul>
    </li>
{{/each}}
</ul>
```

Ahora visite el dashboard y vea sus recogidas pendientes.

