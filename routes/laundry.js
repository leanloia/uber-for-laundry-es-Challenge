const express = require('express')
const router = express.Router()
const withAuth = require('../helpers/middleware')
const User = require('../models/user')
const Pickup = require('../models/laundry-pickup')

router.get("/dashboard", withAuth, async (req, res, next) => {

    // si existe req.user, quiere decir que el middleware withAuth ha devuelto el control a esta ruta y renderizamos la vista secret con los datos del user
  
    if (req.userID) {
  
      try {
  
        // actualizamos la variable res.locals.currentUserInfo con los datos actualizados del usuario
  
        const userUpdated = await User.findById(req.userID)/* busqueda del User por Id */;
  
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
        const pickupDocs = await Pickup.find(query)
            .populate('user', 'name')
            .populate('launderer', 'name')
            .sort("pickupDate")
            .exec()
        // renderizamos nuestra vista de 'dashboard'
        res.render('laundry/dashboard', {pickups: pickupDocs})
      } catch (error) {
        next(error);
        return;
      }
    } else {
        res.redirect('/')
      // en caso contrario (si no hay token) redirigimos a la home
      // otra opción es definir la respuesta con status 401, y renderizamos nuestra vista 'home' con un errorMessage ('Unauthorized: No token provided')
  
    }
  });

router.post("/launderers", withAuth, async (req, res, next) => {

    // declaramos userId trayendolo desde el request.userID
    const userId = req.userID
    // definimos una variable con el fee y el isLaunderer a partir del formulario
    const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true,
  };

  try {
      // hacemos una búsqueda de User por ID para modificarlo, y le pasamos la información que acabamos de definir, y lo guardamos en una variable...

      const theUser = await User.findByIdAndUpdate(userId, laundererInfo, { new : true})

	// ... y definimos a nuestro req.user como ese valor (es decir, nuestro usuario encontrado y actualizado)

      req.user = theUser;

    // redirigimos a nuestro '/dashboard' al finalizar
    res.redirect('/dashboard')
  } catch (error) {
    next(err);
    return;
  }
});

router.get("/launderers", withAuth, async (req, res, next) => {
    try {
      const launderersList = await User.find({$and: [{isLaunderer: true },{ _id: { $ne: req.userID } }]})
        
        // renderizamos nuestra vista 'launderers' con el resultado de nuestra búsqueda
        res.render('laundry/launderers', {launderers: launderersList})
    } catch (error) {
      next(error);
      return;
    }
});

router.get("/launderers/:id", async (req, res, next) => {
    
    const laundererId = req.params.id;

  try {
    const theUser = await User.findById(laundererId) 
	
    //... y renderizamos nuestra vista 'launderer-profile' con el resultado de dicha búsqueda
    res.render("laundry/launderer-profile", {
      theLaunderer: theUser,
    });
  } catch (error) {
    next(err);
    return;
  }
});

router.post("/laundry-pickups", withAuth, (req, res, next) => {
    const pickupInfo = {
      pickupDate: req.body.pickupDate,
      launderer: req.body.laundererId,
      user: req.userID,
    };
  
    const thePickup = new Pickup (pickupInfo);
    // utilizamos el método 'save' para guardar la información en BDD
    thePickup.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/dashboard')
    });
  });

module.exports = router;