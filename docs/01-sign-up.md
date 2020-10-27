# Iteración # 1: Sign up

Lo primero que debemos hacer es permitir que nuestros usuarios se puedan registrar. La ruta que usaremos para registrarnos es `/signup`.

Cree un archivo de ruta en la carpeta /routes llamada `routes/auth.js`. Este archivo de ruta tendrá todas las rutas relacionadas con el registro y la autenticación de usuarios. En otras palabras, este archivo contendrá todas las rutas necesarias para registrarse e iniciar sesión.

Tenemos que asegurarnos de conectar `routes/auth.js` con `app.js`. Podemos hacer esto con _require_ en `app.js`:

```js
// ... inside of app.js

const indexRouter = require("./routes/index");
// --> requerimos auth (carpeta /routes ) <--

const app = express();
// ...
```

También necesitamos configurar nuestra variable en app para usar esas rutas en app.js:

```js
// ... inside of app.js

// --> configuramos uso de ruta requerida en paso anterior <---
```

Ahora que las rutas están en su lugar, podemos agregar el contenido en routes/auth.js:

```js
// routes/auth.js

// --> requerimos express y express.Router <--

// escribimos nuestra ruta GET de '/signup'...

router.get("/signup", (req, res, next) => {
  // utilizamos método render para mostrar la view 'signup'
  // declaramos una variable 'errorMessage' y la dejamos vacía por el momento
});

// --> exportamos nuestro router <--
```

La variable local `errorMessage` está allí para mostrar mensajes o feedback al usuario. Cuando visita la página por primera vez, el mensaje está en blanco (empty string).

La ruta GET /signup renderiza un formulario que el usuario completará para registrarse en la aplicación. En otras palabras, el formulario se enviará a una ruta que requerirá que guardemos la información del usuario en la base de datos.

Además de guardar cosas en la base de datos, el registro en nuestra aplicación requerirá que encriptemos la contraseña del usuario.

Instale el paquete bcryptjs en la terminal:

```
$ npm install --save bcryptjs
```

Ahora podemos finalizar nuestra nueva ruta:

```js
// routes/auth.js

// ...

// requerimos paquete bcrypt y definimos un valor para bcryptSalt

// requerimos al modelo que utilizaremos para crear al nuevo usuario

router.get("/signup", (req, res, next) => {
  // [...]
});

// definimos nuestra ruta POST de 'signup'
router.post("/signup", async (req, res, next) => {
  // 1ro - Traemos información que utilizaremos para nuestro nuevo usuario desde el body del request
  // 2do - Validamos qué sucederá si algunos de los datos no se hubiesen completado correctamente renderizando nuestra vista de 'signup' y con un mensaje de error
  // 3ro - Utilizamos algún método de mongoose para determinar si existe algún user con el mismo email ya registrado en BDD
  // 4to - Validamos qué sucede si existe, renderizando la vista de 'signup' y mostrando un mensaje al usuario.
  // 5to - En caso de que no exista, definimos un valor para salt y generamos un hash con el password mediante los métodos del paquete bcrypt
  // 6to - Generamos una nueva instancia de nuestro modelo User con la información recolectada y usamos el método 'save' para guardarlo en BDD
  // 7mo - Finalmente, si no hay ningún error, redirigimos a nuestra raíz '/', y definimos nuestro "catch" para recoger los posibles errores
});

// Exportamos nuestro router
module.exports = router;
```

Ahora que el código de registro está en su lugar, intente registrarse. Podemos verificar que el registro funcionó yendo a MongoDB Compass y consultando la base de datos:

Siguiente - Inicio de sesión.
