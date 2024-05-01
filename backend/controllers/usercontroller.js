const user = require("../models/User")


const login = async (req, res) => {
    try {
        const { email, password } = req.body; // Change username to email if you're using email for login
        const user = await col.findOne({ email }); // Change username to email if you're using email for login
        if (!user) {
            return res.status(401).send("Invalid username or password");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send("Invalid username or password");
        }
        res.send("Login successful");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error during login");
    }
}

const insertUser = async (request,response)=>{
    try{
        const input = request.body
        const user = new User(input)
        await user.save()
        response.send("Registered Successfully")
    }
    catch(e)
    {
        response.status(500).send(message)
    }
}

module.exports = {insertUser,login}