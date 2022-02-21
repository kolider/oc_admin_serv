const poolPromise = require('../utils/db').getPoolPromise()


class Orders {
    getNewOrders = async () => {
        let sql = "SELECT DISTINCT o.* " +
            "FROM oc_order o " +
            "LEFT JOIN oc_order_status os ON o.order_status_id=os.order_status_id " +
            "LEFT JOIN oc_order_managers om ON o.order_id=om.order_id " +
            "WHERE (os.name != 'Complete' OR o.order_status_id != 0) AND om.order_id IS NULL " +
            "ORDER BY o.order_id DESC LIMIT 100"
        return poolPromise.query(sql)
            .then(([rows, fields])=>{
                return rows
            })
    }
    getOrder = async (order_id) => {
        let sql = "SELECT * FROM `oc_order` WHERE `order_id` = ?"
        return poolPromise.query(sql, [order_id])
            .then( async ([rows, fields]) => {
                if (rows.length === 1){
                    rows[0].products = await this.getOrderProducts(order_id)
                    return rows[0]
                }
                else return false
            })
    }
    getOrderProducts = async (order_id) => {
        let sql = "SELECT * FROM `oc_order_product` WHERE `order_id` = ?"
        return poolPromise.query(sql, [order_id])
            .then(([rows, fields]) => {
                return rows
            })
    }
    setManager = async (order_id, user_id, status_id=1) => {
        let sql = "INSERT INTO `oc_order_managers` (order_id, manager_id, status_id) VALUES (?, ?, ?)"
        return poolPromise.query(sql, [order_id, user_id, status_id]).then(([rows, fields])=>{
            return rows.affectedRows
        })
    }
}

module.exports = new Orders()