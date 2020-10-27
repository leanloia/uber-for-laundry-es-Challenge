# Iteración #6: programar una recolección

Ahora que podemos ver la lista de lavanderos, seleccionemos un lavandero y programemos una recolección. En la lista de lavanderos, cada lavandero tiene un link para programar una recogida. Se supone que ese link lo llevará a una página de perfil del lavandero donde puede programar su recolección. ¡Hagamos una ruta para esa página!

La ruta en cuestión es /launderers/:id. Lo agregaremos después de las demás rutas en routes/laundry.js:

```js
// ... inside of routes/laundry.js

router.get("/launderers/:id", async (req, res, next) => {
    
    const laundererId = /* traemos nuestro id desde la ruta */;

  try {
    const theUser = /* realizamos una búsqueda de User a partir de ese id*/ 
	
    //... y renderizamos nuestra vista 'launderer-profile' con el resultado de dicha búsqueda
    res.render("laundry/launderer-profile", {
      theLaunderer: theUser,
    });
  } catch (error) {
    next(err);
    return;
  }
});

module.exports = router;
```

Visite la página /launderers/:id (link de Schedule a Pickup) y verá un formulario para programar una recolección con ese usuario. Cuando se envíe ese formulario, debemos guardar la recolección de ropa en la base de datos. Ya tenemos el código para el modelo LaundryPickup en models/laundry-pickup.js. Solo necesitamos requerirlo y usarlo en nuestra ruta POST.

Agregamos esta línea en routes/laundry.js:

```js
// routes/laundry.js
const User = require('../models/user');
// requerimos el modelo de 'laundry-pickup'

// ...
```

Ahora agreguemos nuestra ruta /laundry-pickups, en nuestras líneas 74-91 en routes/laundry.js:

```js
// ... inside of routes/laundry.js



router.post("/laundry-pickups", withAuth, (req, res, next) => {
  const pickupInfo = {
    pickupDate: /* valor traido del form */,
    launderer: /* valor traido del form */,
    user: req.userID,
  };

  const thePickup = /* thePickup debería ser una nueva instancia de nuestro modelo 'laundry-pickup' con la información de pinkupInfo */;

  // utilizamos el método 'save' para guardar la información en BDD
  thePickup.save((err) => {
    if (err) {
      next(err);
      return;
    }
	// redirigimos a '/dashboard' una vez terminado
  });
});


module.exports = router;
```


¡Ahora podemos programar una recogida! Podemos verificar que funcionó yendo a MongoDB Compass y consultando la base de datos.

Siguiente - recogidas pendientes.
