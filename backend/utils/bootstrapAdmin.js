const User = require("../models/User");

const admins = [
    {
        name: "Gaurav",
        email: "Gauravkaranwal788@gmail.com",
        password: "password_gaurav",
        role: "admin",
    },
    {
        name: "Brijesh",
        email: "bv2611999@gmail.com",
        password: "password_brijesh",
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
