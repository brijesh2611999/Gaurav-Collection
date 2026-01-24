'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { User } from '@/lib/mockData';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; requireOtp?: boolean; message?: string }>;
    verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
    googleLogin: (token: string, userInfo?: any) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isAdmin: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser({
                            id: userData._id,
                            name: userData.name,
                            email: userData.email,
                            avatar: userData.avatar,
                            role: userData.role,
                            joinDate: new Date().toISOString(), // Mock value
                            downloads: 0 // Mock value
                        });
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                }
            }
            setLoading(false);
        };
        checkLogin();
    }, []);

    const handleAuthResponse = async (response: Response) => {
        const data = await response.json();
        if (response.ok) {
            if (data.token) {
                localStorage.setItem('token', data.token);
                setUser({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                    role: data.role,
                    joinDate: new Date().toISOString(),
                    downloads: 0
                });
                return { success: true };
            }
            // Handling cases like OTP sent where token isn't returned yet
            return { success: true, ...data };
        }
        return { success: false, message: data.message || 'Authentication failed' };
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await handleAuthResponse(response);
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            // Register now expects { success: true, requireOtp: true } often
            return await handleAuthResponse(response);
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error' };
        }
    };

    const verifyOtp = async (email: string, otp: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            return await handleAuthResponse(response);
        } catch (error) {
            return { success: false, message: 'Verification failed' };
        }
    };

    const googleLogin = async (token: string, userInfo?: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    // If backend cannot verify token (dev mode), passing info helps
                    ...(userInfo && {
                        email: userInfo.email,
                        name: userInfo.name,
                        avatar: userInfo.picture,
                        googleId: userInfo.sub
                    })
                })
            });
            return await handleAuthResponse(response);
        } catch (error) {
            return { success: false, message: 'Google login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"}>
            <AuthContext.Provider value={{ user, login, register, verifyOtp, googleLogin, logout, isAdmin, loading }}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
