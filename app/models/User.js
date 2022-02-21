const poolPromise = require('../utils/db').getPoolPromise()

class User {

    findOne = async (options) => {
        let sql = "SELECT * FROM oc_user WHERE ?"

        return poolPromise.query(sql, options)
            .then(([rows, fields]) => {
                if (rows.length === 1) {
                    return rows[0]
                } else {
                    return false
                }
            })
            .catch(e => {
                throw e
            })
    }
    setIpAddr = async (user_id, ip) => {
        let sql = "UPDATE oc_user SET ip=? WHERE user_id=?"

        return poolPromise.query(sql, [ip, user_id])
            .then(([rows, fields]) => {
                return true;
            }).catch(e => {
                throw e
            })
    }

}

module.exports = new User();