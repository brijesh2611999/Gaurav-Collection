const User = require("../models/User");

const bootstrapAdmin = async () => {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
        console.log("✅ Admin already exists");
        return;
    }

    await User.create({
        name: "Gaurav",
        email: "admin@gmail.com",
        password: "password123",
        role: "admin",
    });

    console.log("🚀 Admin user created");
};

module.exports = bootstrapAdmin;
