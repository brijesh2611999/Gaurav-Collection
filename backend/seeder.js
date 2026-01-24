require('dotenv').config();
const mongoose = require('mongoose');
const Image = require('./models/Image');
const Category = require('./models/Category');
const User = require('./models/User');

const categories = [
    { id: '1', name: 'Devotion', description: 'Spiritual and religious imagery', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop', itemCount: 15420 },
    { id: '2', name: 'Nature', description: 'Majestic landscapes and wildlife', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', itemCount: 18900 },
    { id: '3', name: 'Others', description: 'Architecture, abstract, and more', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', itemCount: 25600 },
];

const mockImages = [
    {
        id: '1',
        title: 'Morning Prayer Ritual',
        description: 'Serene spiritual morning scene with incense and soft sunlight. Captured with Canon EOS R5.',
        category: 'Devotion',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=4000&q=90&auto=format',
        author: 'Siddharth V.',
        downloads: 1234,
        likes: 567,
        resolution: '8192 x 5464',
        format: 'RAW',
        price: 29.99,
    },
    {
        id: '2',
        title: 'Modern Architecture Minimal',
        description: 'Contemporary building design with glass and steel elements. Sony A7IV shot.',
        category: 'Others',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=4000&q=90&auto=format',
        author: 'Jane Smith',
        downloads: 2341,
        likes: 892,
        resolution: '7008 x 4672',
        format: 'TIFF',
        price: 39.99,
    },
    {
        id: '3',
        title: 'Sacred Lotus Bloom',
        description: 'A beautiful lotus flower representing purity and devotion. Macro photography on Nikon Z9.',
        category: 'Devotion',
        url: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=4000&q=90&auto=format',
        author: 'Anita R.',
        downloads: 3456,
        likes: 1234,
        resolution: '8256 x 5504',
        format: 'RAW',
        price: 34.99,
    },
    {
        id: '4',
        title: 'Majestic Forest Waterfall',
        description: 'Powerful waterfall deep in the rainforest with lush greenery. Long exposure.',
        category: 'Nature',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=4000&q=90&auto=format',
        author: 'Chris Evans',
        downloads: 4567,
        likes: 1890,
        resolution: '6000 x 4000',
        format: 'JPG',
        price: 44.99,
    },
    {
        id: '5',
        title: 'Temple Bells',
        description: 'Close-up of traditional bronze bells in a historical temple. Shallow depth of field.',
        category: 'Devotion',
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=4000&q=90&auto=format',
        author: 'Rajesh K.',
        downloads: 2890,
        likes: 1123,
        resolution: '6720 x 4480',
        format: 'RAW',
        price: 24.99,
    },
    {
        id: '6',
        title: 'Sunset Over Alpine Lake',
        description: 'Breathtaking golden hour reflection on a calm mountain lake. Landscape master shot.',
        category: 'Nature',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=4000&q=90&auto=format',
        author: 'Elena M.',
        downloads: 5678,
        likes: 2345,
        resolution: '9504 x 6336',
        format: 'TIFF',
        price: 49.99,
    },
    {
        id: '7',
        title: 'Abstract Light Trails',
        description: 'Dynamic long exposure of city lights at night. Urban photography.',
        category: 'Others',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=4000&q=90&auto=format',
        author: 'Tom G.',
        downloads: 1987,
        likes: 765,
        resolution: '6000 x 4000',
        format: 'JPG',
        price: 36.99,
    },
    {
        id: '8',
        title: 'Deep Forest Path',
        description: 'A mystical trail through a dense, foggy forest. Moody atmosphere.',
        category: 'Nature',
        url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=4000&q=90&auto=format',
        author: 'Sarah C.',
        downloads: 3210,
        likes: 1456,
        resolution: '7008 x 4672',
        format: 'RAW',
        price: 42.99,
    },
    {
        id: '9',
        title: 'Creative Artistic Workspace',
        description: 'Professional art studio with vivid colors and creative tools.',
        category: 'Others',
        url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=4000&q=90&auto=format',
        author: 'Marc L.',
        downloads: 4123,
        likes: 1789,
        resolution: '4000 x 6000',
        format: 'JPG',
        price: 54.99,
    },
    {
        id: '10',
        title: 'Spiritual Mountain Peaks',
        description: 'Majestic peaks touching the clouds, evoking a sense of wonder. High altitude shot.',
        category: 'Nature',
        url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=4000&q=90&auto=format',
        author: 'David H.',
        downloads: 2567,
        likes: 987,
        resolution: '8192 x 5464',
        format: 'RAW',
        price: 38.99,
    },
    {
        id: '11',
        title: 'Lush Green Valley',
        description: 'A vibrant green valley under a clear blue sky. Panorama stitch.',
        category: 'Nature',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=4000&q=90&auto=format',
        author: 'Emma W.',
        downloads: 3890,
        likes: 1567,
        resolution: '12000 x 4000',
        format: 'TIFF',
        price: 31.99,
    },
    {
        id: '12',
        title: 'Modern Office Interior',
        description: 'Clean and bright office space for productive work. Architectural photography.',
        category: 'Others',
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=4000&q=90&auto=format',
        author: 'Paul S.',
        downloads: 2789,
        likes: 1098,
        resolution: '6000 x 4000',
        format: 'JPG',
        price: 41.99,
    },
];

const mockUsers = [

    {
        name: 'Gaurav',
        email: 'Gauravkaranwal788@gmail.com',
        password: 'password123',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
        name: 'Brijesh',
        email: 'bv2611999@gmail.com',
        password: 'password123',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=4',
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await Image.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({});

        // Seed Users
        for (const userData of mockUsers) {
            try {
                const user = new User(userData);
                await user.save();
                console.log(`✅ User seeded: ${userData.email}`);
            } catch (err) {
                console.error(`❌ Failed to seed user ${userData.email}:`, err.message);
                throw err;
            }
        }
        console.log('✅ Users seeded');

        // Seed Categories
        await Category.insertMany(categories);
        console.log('✅ Categories seeded');

        // Seed Images
        await Image.insertMany(mockImages);
        console.log('✅ Images seeded');

        console.log('🚀 Database seeding completed!');
        process.exit();
    } catch (error) {
        console.error('❌ SEEDING FATAL ERROR:');
        console.error('Message:', error.message);
        console.error('Full Stack Trace:', error.stack);
        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
};

seedDB();
