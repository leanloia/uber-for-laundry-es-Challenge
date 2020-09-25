# Iteración #2: Log In

Ahora que nos hemos registrado, necesitamos poder iniciar sesión. La ruta para la página de inicio de sesión será /login. Como está relacionado con la autenticación, queremos incluirlo en nuestro archivo routes/auth.js. En las líneas 62-66 puede ver nuestra ruta de inicio de sesión:

```js
// ... inside of routes/auth.js
      res.redirect('/');
    });
  });
});


router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});


module.exports = router;
```

La ruta /login renderiza la vista de views/auth/login.hbs. Observe nuevamente que tenemos una variable local errorMessage. La usaremos para dar feedback al usuario después de que envíe el formulario. Cuando visitamos por primera vez la página de inicio de sesión, errorMessage estará vacía.

La ruta GET /login renderiza un formulario que el usuario enviará para autenticarse con la aplicación. En otras palabras, el formulario se enviará a una ruta POST que requerirá crear token para ese usuario. 

El primer paso, necesitamos una cadena secreta para usar al firmar los tokens.

Usaremos la constante SECRET_SESSION definida en el archivo .env
Si todavía no has creado el archivo .env, puedes hacerlo ahora y agregar, por ejemplo, este string:

```
SECRET_SESSION=ironhack
```

A continuación, debemos verificar que esté instalada la biblioteca jsonwebtoken que nos permitirá emitir y verificar tokens web JSON:

```
$ npm install jsonwebtoken
```

Ahora necesitaremos requerir el paquete en routes/auth.js:

```js
// ... inside of app.js
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

const jwt = require("jsonwebtoken"); // <<<< ESTA LINEA

// ...
```

A continuación, crearemos nuestro propio middleware express personalizado que se ubicará entre una solicitud y una ruta protegida y verificaremos si la solicitud está autorizada.

Esta función de middleware buscará el token en las cookies de request y luego lo validará.

En la carpeta raíz, crearemos el archivo /helpers/middleware.js

```js
// /helpers/middleware.js

const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_SESSION;

const User = require("../models/user");

const withAuth = async (req, res, next) => {
  try {
    // obtenemos el token de las cookies
    const token = req.cookies.token;
    // si no hay token, seteamos el valor de la variable isUserLoggedIn en false y pasamos el control a la siguiente función de middleware
    if (!token) {
      res.locals.isUserLoggedIn = false;
      next();
    } else {
      // verificamos el token
      const decoded = await jwt.verify(token, secret);

      // si el token valida, configuramos req.userID con el valor del decoded userID
      req.userID = decoded.userID;
      res.locals.currentUserInfo = await User.findById(req.userID);
      res.locals.isUserLoggedIn = true;
      next();
    }
  } catch (err) {
    // si hay un error, configuramos el valor de la variable isUserLoggedIn en false y pasamos el control a la siguiente ruta
    console.error(err);
    res.locals.isUserLoggedIn = false;
    next(err);
  }
};

module.exports = withAuth;
```
Antes de que sucedan las rutas, este middleware verifica si hay un token. Si hay, setea algunos *locals* en la respuesta para que la vista acceda. Tenemos dos locals:

    isUserLoggedIn: un booleano que indica si hay un usuario conectado o no.
    currentUserInfo: la información del usuario de la sesión (solo disponible si ha iniciado sesión).

Ese middleware facilita la personalización de la homepage para los usuarios logueados.

Debemos agregar este middleware en nuestra ruta de index:

```js
const withAuth = require("../helpers/middleware");

/* GET home page. */
router.get('/', withAuth, (req, res, next) => {
  res.render('index', { title: 'Uber for Laundry' });
});
```

Ahora podemos finalizar nuestra ruta POST la cual recibirá el envío del formulario del log in. 
Esta solicitud autenticará al usuario si el nombre de usuario y la contraseña son correctos. Si la contraseña es correcta, emitiremos un token firmado al cliente.
Verifique las actualizaciones de nuestro archivo routes/auth.js:

```js
// ... inside of routes/auth.js
router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});

router.post("/login", async (req, res) => { // <<<< ESTA RUTA
  // desestructuramos el email y el password de req.body
  const { email, password } = req.body;

  // si alguna de estas variables no tiene un valor, renderizamos la vista de auth/signup con un mensaje de error
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up.",
    });
    return;
  }

  try {
    // revisamos si el usuario existe en la BD
    const user = await User.findOne({ email });
    // si el usuario no existe, renderizamos la vista de auth/login con un mensaje de error
    if (!user) {
      res.render("auth/login", {
        errorMessage: "The email doesn't exist.",
      });
      return;
    }
    // si el usuario existe, hace hash del password y lo compara con el de la BD
    else if (bcrypt.compareSync(password, user.password)) {
      // Issue token
      const userWithoutPass = await User.findOne({ email }).select("-password");
      const payload = { userID: userWithoutPass._id };
      //console.log('payload', payload);
      // si coincide, creamos el token usando el método sign, el string de secret session y el expiring time
      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h",
      });
      // enviamos en la respuesta una cookie con el token y luego redirigimos a la home
      res.cookie("token", token, { httpOnly: true });
      res.status(200).redirect("/");
    } else {
      // en caso contrario, renderizamos la vista de auth/login con un mensaje de error
      res.render("auth/login", {
        errorMessage: "Incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
```

Aspectos destacados de esta ruta POST:

    Línea 84: encuentra al usuario por su email.
    
    Línea 93: utiliza el método compareSync() para verificar la contraseña.
    
    Línea 103: si todo funciona, envia en la respuesta una cookie con el token.

Así que hemos iniciado sesión, pero no lo sabría simplemente mirando la página de inicio. ¡Se ve igual que antes! Necesitamos personalizar la homepage para los usuarios registrados. Sin embargo, antes de hacer eso, hagamos que sea más fácil verificar el estado de inicio de sesión en la vista.

Aquí está nuestro archivo de plantilla views/index.hbs actualizado:

```html
<!-- views/index.hbs -->
<p> Welcome to {{ title }}. </p>

{{#if isUserLoggedIn}}
  <p> Hello, {{ currentUserInfo.name }}. </p>
{{/if}}

<nav>
  <ul>
    {{#if isUserLoggedIn}}
     <li> <a href="/launderers"> Find a Launderer </a> </li>
      <li> <a href="/dashboard"> See Dashboard </a> </li>
      <li> <a href="/logout"> Log Out </a> </li>
    {{else}}
      <li> <a href="/signup"> Sign Up </a> </li>
      <li> <a href="/login"> Log In </a> </li>
    {{/if}}
  </ul>
</nav>
```
Destacar:

    Lines 4-6: una declaración if muestra un mensaje especial para los usuarios registrados.
    Lines 10-17: una declaración if..else muestra algunos de los enlaces a usuarios registrados y otros a usuarios anónimos.

Siguiente - Log Out.