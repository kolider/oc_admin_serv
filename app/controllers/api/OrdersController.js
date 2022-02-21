const {success, error} = require("../../helpers/responseApi");
const Orders = require('../../models/Orders')

const SET_ORDER_OF_MANAGER = "SET_ORDER_OF_MANAGER"

class OrdersController {
    getNewOrdersHandler = async (req, res) => {
        let orders = await this.getNewOrders();
        orders = orders.map(order=>{
            let email = order.email === '4635797@gmail.com' ? '' : order.email
            return {
                order_id: order.order_id,
                client: order.firstname +" "+order.lastname+"  "+order.email,
                date: order.date_modified,
                total: order.total
            }
        })
        res
            .status(200)
            .json(success("ok", orders, res.statusCode));
    }

    getNewOrders = async () => {
        return await Orders.getNewOrders();
    }

    getOrderHandler = async (req, res, next) => {
        const order_id = req.params.id
        // if (req.method === "GET"){}

        let order = await Orders.getOrder(req.params.id)
        if (order)
            res.status(200).json(success('ok', order, res.statusCode))
        else
            res.status(404).json(success('Order not found', order, res.statusCode))
    }

    updateOrderHandler = async (req, res) => {
        const order_id = req.params.id
        const action = req.body.action || ''
        const user_id = req.user.user_id

        switch (action){
            case SET_ORDER_OF_MANAGER:
                if (await this.setManager(order_id, user_id)){
                    res.status(200).json(success("Order set", true, res.statusCode))
                }else{
                    res.status(401).json(error('Not allow', res.statusCode))
                }
        }
    }

    haveNewOrder = async () => {
        let orders = await this.getNewOrders()
        return !!orders.length
    }

    setManager = async (order_id, user_id) => {
        return Orders.setManager(order_id, user_id)
            .then((affectedRows)=>{
                return (affectedRows === 1)

            }).catch(e=>{
                return false
        })
    }
}

module.exports = new OrdersController()

// module.exports = {
//     getNewOrdersHandler: async (req, res) => {
//         let orders = await Orders.getNewOrders();
//         res
//             .status(200)
//             .json(success("ok", orders, res.statusCode));
//     },
//     getOrder: async (req, res) => {
//         let order = await Orders.getOrder(req.params.id)
//         if (order)
//             res.status(200).json(success('ok', order, res.statusCode))
//         else
//             res.status(404).json(success('Order not found', order, res.statusCode))
//     }
// }