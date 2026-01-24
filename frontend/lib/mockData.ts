// Mock data for the Gaurav Collection application

export interface ImageData {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    url: string;
    author: string;
    price: number;
    downloads: number;
    likes: number;
    resolution: string;
    fileSize: string;
    license: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    imageCount: number;
    icon: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatar: string;
    joinDate: string;
    downloads: number;
}

// Categories
export const categories: Category[] = [
    { id: '1', name: 'Devotion', slug: 'devotion', imageCount: 15420, icon: '🙏' },
    { id: '2', name: 'Nature', slug: 'nature', imageCount: 18900, icon: '🌿' },
    { id: '3', name: 'Others', slug: 'others', imageCount: 25600, icon: '✨' },
];

// Mock Images - Emptied to only show real database images
export const mockImages: ImageData[] = [];

// Mock Users
export const mockUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?img=1',
        joinDate: '2023-01-15',
        downloads: 45,
    },
    {
        id: '2',
        name: 'Admin User',
        email: 'admin@gauravcollection.com',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=2',
        joinDate: '2022-06-10',
        downloads: 0,
    },
];

// Analytics Data for Admin Dashboard - Removed Revenue
export interface AnalyticsData {
    totalImages: number;
    totalUsers: number;
    totalDownloads: number;
    recentDownloads: Array<{
        imageId: string;
        imageTitle: string;
        user: string;
        date: string;
    }>;
    popularCategories: Array<{
        category: string;
        downloads: number;
    }>;
}

export const mockAnalytics: AnalyticsData = {
    totalImages: 125430,
    totalUsers: 45678,
    totalDownloads: 234567,
    recentDownloads: [
        { imageId: '1', imageTitle: 'Sunset Over Mountains', user: 'John Doe', date: '2024-01-20' },
        { imageId: '3', imageTitle: 'Laptop and Coffee', user: 'Jane Smith', date: '2024-01-20' },
        { imageId: '6', imageTitle: 'Tropical Beach Paradise', user: 'Mike Brown', date: '2024-01-19' },
        { imageId: '4', imageTitle: 'Team Collaboration', user: 'Sarah Williams', date: '2024-01-19' },
        { imageId: '9', imageTitle: 'Fashion Model Portrait', user: 'Emily Davis', date: '2024-01-18' },
    ],
    popularCategories: [
        { category: 'Nature', downloads: 38901 },
        { category: 'Devotion', downloads: 32456 },
        { category: 'Others', downloads: 28734 },
    ],
};
