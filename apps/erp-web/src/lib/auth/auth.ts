import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Contraseña', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const validatedFields = loginSchema.safeParse(credentials);

                    if (!validatedFields.success) {
                        throw new Error('Credenciales inválidas');
                    }

                    const { email, password } = validatedFields.data;

                    // Buscar usuario en la base de datos
                    const user = await prisma.user.findUnique({
                        where: { email },
                        include: {
                            role: true,
                            permissions: true,
                        },
                    });

                    if (!user || !user.password) {
                        console.error('User not found or no password'); // Debug
                        return null;
                        // throw new Error('Usuario no encontrado'); // NextAuth expect null or user
                    }

                    // Verificar contraseña
                    const passwordMatch = await compare(password, user.password);

                    if (!passwordMatch) {
                        console.error('Password mismatch');
                        return null;
                    }

                    // Verificar si el usuario está activo
                    if (!user.isActive) {
                        console.error('User inactive');
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role.name,
                        permissions: user.permissions.map(p => p.name),
                        image: user.avatarUrl,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.permissions = user.permissions;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.permissions = token.permissions as string[];
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 horas
    },
    secret: process.env.NEXTAUTH_SECRET,
};
