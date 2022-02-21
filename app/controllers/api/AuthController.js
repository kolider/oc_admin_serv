const { success, error, validation } = require("../../helpers/responseApi");
const { validationResult } = require("express-validator");
const config = require("config");
const sha1 = require('sha-1');
const jwt = require("jsonwebtoken");
const User = require("../../models/User");


/**
 * @desc    Login a user
 * @method  POST api/auth/login
 * @access  public
 */
exports.login = async (req, res) => {
  // Validation work by prev middleware on route, like: ('/url', validationLogin, login)
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));

  const { email, password } = req.body;


  try {
    const user = await User.findOne({ email });

    // Check the email
    // If there's not exists
    // Throw the error
    if (!user) return res.status(422).json(validation("Invalid credentials"));

    // Check the password
    // let checkPassword = await bcrypt.compare(password, user.password);
    let hash = sha1(user.salt + sha1(user.salt + sha1(password)))
    let checkPassword = hash === user.password

    if (!checkPassword)
      return res.status(422).json(validation("Invalid credentials"));

    if ( user.status !== 1)
      return res.status(422).json(validation("Account not active"));

    // console.log(user);
    // console.log(req.ip);

    // If the requirement above pass
    // Lets send the response with JWT token in it
    const payload = {
      user: {
        id: user.user_id,
        name: user.firstname,
        email: user.email,
      },
    };

    if (await User.setIpAddr(user.user_id, req.ip)){
      jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: '10h' },
          (err, token) => {
            if (err) throw err;

            res
                .status(200)
                .json(success("Login success", { token }, res.statusCode));
          }
      );
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};