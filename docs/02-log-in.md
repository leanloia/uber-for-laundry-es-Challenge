# Iteración #2: Log In

Ahora que nos hemos registrado, necesitamos poder iniciar sesión. La ruta para la página de inicio de sesión será /login. Como está relacionado con la autenticación, queremos incluirlo en nuestro archivo routes/auth.js. En las líneas 62-66 puede ver nuestra ruta de inicio de sesión:

```js
// ... inside of routes/auth.js
      res.redirect('/');
    });
  });
});


router.get('/login', (req, res, next) => {
  // utilizamos método render para mostrar la view 'login'
  // declaramos una variable 'errorMessage' y la dejamos vacía por el momento'
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

// ...
// --> requerimos paquete 'jsonwebtoken' <--

// ...
```

A continuación, crearemos nuestro propio middleware express personalizado que se ubicará entre una solicitud y una ruta protegida y verificaremos si la solicitud está autorizada.

Esta función de middleware buscará el token en las cookies de request y luego lo validará.

En la carpeta raíz, crearemos el archivo /helpers/middleware.js

```js
// /helpers/middleware.js

// requerimos paquete 'jsonwebtoken'
const jwt = require("jsonwebtoken");

// declaramos una variable con el valor de nuestro SECRET_SESSION en el fichero .env
const secret = process.env.SECRET_SESSION;

// tramos a nuestro modelo User
const User = require("../models/user");

// declaramos la función withAuth y la definimos asíncrona
const withAuth = async (req, res, next) => {
  try {
    // 1ro - btenemos el token de las cookies
    // si no hay token, seteamos el valor de la variable isUserLoggedIn en false y pasamos el control a la siguiente función de middleware
    if (!token) {
    // utilizamos el objeto res.locals para declarar una variable "isUserLoggedIn" que definiremos inicialmente como 'false'
      next();
    } else {
      // verificamos el token con el método verify de jwt

      // si el token valida, configuramos req.userID con el valor del decoded userID
      req.userID = decoded.userID;
      // ... y con él, hacemos una búsqueda del usuario por ID y lo metemos en la variable 'currentUserInfo'de nuestro objeto res.locals...
      
      //  ... y cambiamos el valor de 'isUserLoggedIn' a 'true' ya que ahora verificamos que el usuario está
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

router.post("/login", async (req, res) => { // <<<< ESTA RUTA
  // desestructuramos el email y el password de req.body

  // si alguna de estas variables no tiene un valor, renderizamos la vista de auth/signup con un mensaje de error
  if (/* condición */)) {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up.",
    });
    return;
  }

  try {
    // revisamos si el usuario existe en la BD
    const user = await User.findOne({ email });
    // si el usuario no existe, renderizamos la vista de auth/login con un mensaje de error
    if (/* condición */) {
      res.render("auth/login", {
        errorMessage: "The email doesn't exist.",
      });
      return;
    }
    // si el usuario existe, hace hash del password y lo compara con el de la BD (con el método de bcrypt de compareSync)
    else if (/* condición */)) {
      // Issue token
      // buscamos nuestro usuario por 'email' y tramos toda la información salvo por el password (método select) y lo metemos en una variable.
      const userWithoutPass = await User.findOne({ email }).select("-password");
      // definimos nuestro payload	
      const payload = { userID: userWithoutPass._id };
      //console.log('payload', payload);
      // si coincide, creamos el token usando el método sign, el string de secret session y el expiring time
      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h",
      });
      
        // enviamos en la respuesta una cookie con el token (recordar agregar el {httpOnly: true} en la respuesta) y luego redirigimos a la home
    
    } else {
      
        // en caso contrario, renderizamos la vista de auth/login con un mensaje de error
      
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
```

Así que hemos iniciado sesión, pero no lo sabría simplemente mirando la página de inicio. ¡Se ve igual que antes! Necesitamos personalizar la homepage para los usuarios registrados. Sin embargo, antes de hacer eso, hagamos que sea más fácil verificar el estado de inicio de sesión en la vista.

Aquí está nuestro archivo de plantilla views/index.hbs actualizado:

```html
<!-- views/index.hbs -->
<p> Welcome to {{ title }}. </p>

<!-- validamos que el usuario esté logueado para mostrar un mensaje personalizado -->
{{#if <!-- condición -->}}
  <p> Hello, {{ currentUserInfo.name }}. </p>
{{/if}}

<nav>
  <ul>
  <!-- validamos que el usuario esté logueado para mostrar diferentes opciones en la navbar-->
    {{#if <!-- condición -->}}
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


Siguiente - Log Out.	