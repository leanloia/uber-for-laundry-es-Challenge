// requerimos paquete 'jsonwebtoken'
const jwt = require("jsonwebtoken");

// declaramos una variable con el valor de nuestro SECRET_SESSION en el fichero .env
const secret = process.env.SECRET_SESSION;

// traemos a nuestro modelo User
const User = require("../models/user");

// declaramos la función withAuth y la definimos asíncrona
const withAuth = async (req, res, next) => {
    try {
        // obtenemos el token de las cookies
        const token = req.cookies.token

        // si no hay token, seteamos el valor de la variable isUserLoggedIn en false y pasamos el control a la siguiente función de middleware
        if (!token){
            res.locals.isUserLoggedIn = false;
            next()
        } else {
            // verificamos el token con el método verify de jwt
            const decoded = await jwt.verify(token, secret)

            // si el token valida, configuramos req.user con el valor del usuario decodificado
            req.userID = decoded.userID;
            // ... y con él, hacemos una búsqueda del usuario por ID y lo metemos en la variable 'currentUserInfo'de nuestro objeto res.locals...
      
            //  ... y cambiamos el valor de 'isUserLoggedIn' a 'true' ya que ahora verificamos que el usuario está            res.locals.currentUserInfo = req.user
            res.locals.currentUserInfo = await User.findById(req.userID)
            res.locals.isUserLoggedIn = true
            next()
        }
    } catch (error) {
        // si hay un error, configuramos el valor de la variable isUserLoggedIn en false y pasamos el control a la siguiente ruta
        console.log(error)
        res.locals.isUserLoggedIn = false
        next(error)
    }
}

module.exports = withAuth;

