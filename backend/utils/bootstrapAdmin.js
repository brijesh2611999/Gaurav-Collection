const User = require("../models/User");

const admins = [
    {
        name: "Gaurav",
        email: "admin1@gmail.com",
        password: "password123",
        role: "admin",
    },
    {
        name: "Rahul",
        email: "admin2@gmail.com",
        password: "password123",
        role: "admin",
    },
];

const bootstrapAdmin = async () => {
    for (const admin of admins) {
        const exists = await User.findOne({ email: admin.email });

        if (!exists) {
            await User.create(admin);
            console.log(`🚀 Admin created: ${admin.email}`);
        } else {
            console.log(`✅ Admin exists: ${admin.email}`);
        }
    }
};

module.exports = bootstrapAdmin;
