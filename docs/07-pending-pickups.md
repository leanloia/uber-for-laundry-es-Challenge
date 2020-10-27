# Iteración #7: recogidas pendientes

Finalmente, necesitamos mostrar las recogidas pendientes de un usuario. El lugar obvio para ver esta lista es la página dashboard. Agreguemos una consulta adicional a esa ruta.

Puede ver nuestra revisada ruta /dashboard en las líneas 32-51 de routes/laundry.js:

```js
// ... inside of routes/laundry.js

router.get("/dashboard", withAuth, async (req, res, next) => {
  // si existe req.userID, quiere decir que el middleware withAuth ha devuelto el control a esta ruta
  if (req.userID) {
    try {
        // actualizamos la variable res.locals.currentUserInfo con los datos actualizados del usuario

      const userUpdated = /* busqueda del User por Id */;

      // ... y actualizamos nuestro 'currentUserInfo' con el usuario actualizado

      res.locals.currentUserInfo = userUpdated;
	
      // definimos una variable 'query'...
      let query;

      // ... y la definimos según si el usuario es, o no, launderer
      if (res.locals.currentUserInfo.isLaunderer) {
        query = { launderer: res.locals.currentUserInfo._id };
      } else {
        query = { user: res.locals.currentUserInfo._id };
      }
      
      // realizamos una búsqueda de LaundryPickup a partir de 'query' y populamos el resultado para traer el valor 'name' de las keys 'user' y 'launderer' 
      // (Esta variable mostrará una instancia de LaundryPickup, el cual posee referencias del launderer que realiza el pickup y del user que lo solicita. Ver modelo en caso de confusión.)
      const pickupDocs = await LaundryPickup.find(query)
        .populate(/*referencia, key*/)
        .populate(/*referencia, key*/)
        .sort("pickupDate")
        .exec()

      // con el resultado, renderizamos nuestro 'dashboard' con la información que acabamos de definir en la variable 'pickupDocs'
      
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

Ahora que estamos consultando información adicional en la ruta, necesitamos mostrarla en la vista.

En views/laundry/dashboard.hbs:

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

