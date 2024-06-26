const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require("dotenv").config()


const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToMongoDB();

const db = client.db("banking");
const col = db.collection("banking");

app.get('/home', (req, res) => {
    res.send("Hello World");
});

app.post('/insert', async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 5);
        await col.insertOne(req.body);
        res.send("Data Received");
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data");
    }
});
app.post('/balance', async (req, res) => {
    try {
        const { mobile } = req.body;
        const user = await col.findOne({ mobile });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ balance: user.balance });
    } catch (error) {
        console.error("Error checking balance:", error);
        res.status(500).send("Error checking balance");
    }
});

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
app.post("/login",login)

app.post('/transfer', async (req, res) => {
    try {
        const { senderMobile, recipientMobile, amount } = req.body;
        const sender = await col.findOne({ mobile: senderMobile });
        const recipient = await col.findOne({ mobile: recipientMobile });

        if (!sender || !recipient) {
            return res.status(404).send("Sender or recipient not found");
        }

        const transferAmount = parseFloat(amount); // Convert amount to a number

        if (isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).send("Invalid amount");
        }

        const senderBalance = parseFloat(sender.balance);
        const recipientBalance = parseFloat(recipient.balance);

        if (isNaN(senderBalance) || isNaN(recipientBalance)) {
            return res.status(500).send("Invalid balance format");
        }

        if (senderBalance < transferAmount) {
            return res.status(400).send("Insufficient balance");
        }

        // Update sender's balance
        await col.updateOne(
            { mobile: senderMobile },
            { $set: { balance: (senderBalance - transferAmount).toString() } }
        );

        // Update recipient's balance by incrementing
        await col.updateOne(
            { mobile: recipientMobile },
            { $set: { balance: (recipientBalance + transferAmount).toString() } }
        );

        res.send("Transfer successful");
    } catch (error) {
        console.error("Error transferring money:", error);
        res.status(500).send("Error transferring money");
    }
});








const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
});