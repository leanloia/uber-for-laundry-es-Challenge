# Iteración #4: Conviértete en un lavandero

Ahora que hemos completado toda nuestra autenticación, podemos comenzar con las características reales de la aplicación. Primero queremos tener un dashboard para los usuarios registrados. En este dashboard, los usuarios podrán convertirse en un lavandero.

Cree un archivo de ruta en la carpeta routes/ llamada routes/laundry.js. Este archivo de ruta tendrá todas las rutas relacionadas con la recogida de la ropa.

```
$ touch routes/laundry.js
```

Tenemos que asegurarnos de conectar routes/laundry.js con app.js.

\***\* hay que tener en cuenta el orden de los routers, _authRouter_ tiene que ir antes de _laundryRouter_ si queremos ver las rutas de laundry correctamente \*\***

```js
// ... inside of app.js

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

// requerimos nuestra nueva ruta 'laundry'

// ...

// También necesitamos configurar nuestra variable app para usar esas rutas en app.js:

// ... inside of app.js

app.use("/", indexRouter);
app.use("/", authRouter);

// --> configuramos nuestra variable app para poder usar nuestra nueva ruta <--

// ...
```

Ahora que las rutas están en su lugar, podemos agregar el contenido inicial a routes/laundry.js:

```js
// routes/laundry.js

// --> requerimos express <--

// --> requerimos el Router de express <--


router.get('/dashboard', (req, res, next) => {

    // renderizamos la vista 'dashboard' dentro de nuestra carpeta "laundry" de vistas});

	}

module.exports = router;
```

La ruta /dashboard renderiza la vista de views/laundry/dashboard.hbs. Esta plantilla contiene un formulario el cual el usuario enviará para convertirse en lavandero. En otras palabras, el formulario se enviará a una ruta que requerirá que actualicemos la información del usuario en la base de datos. Las actualizaciones deberían guardar su nuevo estado como _launderers_. Actualizaremos las propiedades _isLaunderer_ y _fee_ cuando se envíe este formulario.

Nuestra ruta POST es /launderers. Agreguemos eso ahora. Aquí están nuestras rutas routes/laundry.js:

```js
// routes/laundry.js

// ...

// requerimos nuestro middleware

// requerimos nuestro modelo User

router.get('/dashboard', (req, res, next) => {

 // ...

});

router.post("/launderers", withAuth, async (req, res, next) => {

    // declaramos userId trayendolo desde el request.userID

    // definimos una variable con el fee y el isLaunderer a partir del formulario

    const laundererInfo = {
    fee: /* valor traido desde el form */
    isLaunderer: true,
  };

  try {
      // hacemos una búsqueda de User por ID para modificarlo, y le pasamos la información que acabamos de definir, y lo guardamos en una variable...

      const theUser = /* busqueda y actualización de nuestro usuario */

	// ... y definimos a nuestro req.user como ese valor (es decir, nuestro usuario encontrado y actualizado)

      req.user = theUser;

    // redirigimos a nuestro '/dashboard' al finalizar

  } catch (error) {
    next(err);
    return;
  }
});

module.exports = router;
```

Ahora que el código está en su lugar, ¡intenta convertirte en un lavandero! Podemos verificar que funcionó yendo a MongoDB Compass y consultando la base de datos:

Confirme que el precio del usuario y las propiedades de isLaunderer hayan cambiado.

Sin embargo, los usuarios no podrán verificar MongoDB Compass. Incluso es molesto para nosotros! Deberíamos mostrar comentarios en el dashboard sobre el éxito de convertirse en un launderer.

Aquí está nuestra plantilla actualizada views/laundry/dashboard.hbs:

```html
<!-- views/laundry/dashboard.hbs -->

<h2>Your laundry Dashboard</h2>

<ul>
  <li><a href="/launderers"> Find a Launderer </a></li>
  <li><a href="/logout"> Log Out </a></li>
</ul>

<!-- incluimos una condición para ver si el usuario es launderer o no, y mostrar según ello un mensaje o el formulario -->

{{#if
<!-- condición -->
}}

<h3>You are a launderer</h3>

<p>Your laundering fee is <b>${{ currentUserInfo.fee }}.</b></p>

{{else}}

<h3>Want to become a launderer?</h3>

<form action="/launderers" method="post">
  <div>
    <label for="fee-input"> Set your fee </label>
    <input type="number" name="fee" id="fee-input" />
  </div>

  <button>Become a Launderer</button>
</form>
{{/if}}
```

Resultado final: si aún no eres un lavandero, verás el formulario y, si lo eres, verás un mensaje y el precio.

Finalmente, debemos agregar alguna autorización a nuestro dashboard. Tal como está, incluso si no estás logueado, y visitas la página /dashboard directamente podrá verla.

Agreguemos alguna autorización a todas las rutas de la lavandería. Lo haremos agregando el middleware withAuth a las rutas de routes/laundry.js.

En routes/laundry.js agregamos nuestro middleware withAuth:

```js
// routes/laundry.js

// ...

router.get("/dashboard", withAuth, async (req, res, next) => {

  // si existe req.user, quiere decir que el middleware withAuth ha devuelto el control a esta ruta y renderizamos la vista secret con los datos del user

  if (req.userID) {

    try {

      // actualizamos la variable res.locals.currentUserInfo con los datos actualizados del usuario

      const userUpdated = /* busqueda del User por Id */;

      // ... y actualizamos nuestro 'currentUserInfo' con el usuario actualizado

      res.locals.currentUserInfo = userUpdated;

      // renderizamos nuestra vista de 'dashboard'

    } catch (error) {
      next(error);
      return;
    }
  } else {

    // en caso contrario (si no hay token) redirigimos a la home
    // otra opción es definir la respuesta con status 401, y renderizamos nuestra vista 'home' con un errorMessage ('Unauthorized: No token provided')

  }
});

// ...
```

Este middleware se ejecuta antes que cualquiera de nuestras rutas.

Siguiente - Encuentra un Launderer.
