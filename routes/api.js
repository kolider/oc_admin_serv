const OrdersController = require("../app/controllers/api/OrdersController");
const eventsController = require("../app/controllers/api/EventsController");
const {loginValidation, auth} = require("../app/middlewares/auth");
const {login} = require("../app/controllers/api/AuthController");
const router = require('express').Router()
// const events = require('events');

// const ordersEvents = new events.EventEmitter();

setInterval(()=>{
  OrdersController.getNewOrders().then(
      newOrders => {
          let event = {
              event: "new_order",
              data: newOrders.map(order=>(order.order_id))
          }
        eventsController.notifyAllSubscriber(event)
      }
  )
}, 7000)

router.get('/', function(req, res, next) {
  res.json({status:"Ok" });
});

router.get('/account', auth)

router.route('/login')
    .post(loginValidation, login)

router.route('/orders/order/:id')
    .all(auth)
    .get(OrdersController.getOrderHandler)
    .post(OrdersController.updateOrderHandler)

router.route('/orders/new')
    .all(auth)
    .get(OrdersController.getNewOrdersHandler)

router.get('/events', auth, eventsController.eventsHandler)

module.exports = router;