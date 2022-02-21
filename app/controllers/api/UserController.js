const {success} = require("../../helpers/responseApi");
const UserModel = require('../../models/User')

class UserController {
    getMeHandler = async (req, res) => {
        let me = {
            email: req.user.email,
            name: req.user.username,
        }
        res
            .status(200)
            .json(success("ok", me, res.statusCode));
    }


}

module.exports = new UserController()