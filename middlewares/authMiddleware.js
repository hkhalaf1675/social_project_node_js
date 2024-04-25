const { register, login } = require("../services/authServices");

exports.register = async (req, res) => {
    const { username,email, password, firstName, lastName, phoneNumber, bio } = req.body;

    const response = await register(firstName, lastName, username, email, phoneNumber, bio, password);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.login = async(req, res) => {
    const { email, password } = req.body;

    const response = await login(email, password);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}
    