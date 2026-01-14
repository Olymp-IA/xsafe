import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Definir rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/api/auth'];

// Definir permisos por rol
const rolePermissions: Record<string, string[]> = {
    admin: ['/dashboard', '/production', '/inventory', '/quality', '/machines', '/reports', '/settings'],
    manager: ['/dashboard', '/production', '/inventory', '/quality', '/reports'],
    operator: ['/dashboard', '/production'],
    viewer: ['/dashboard', '/reports'],
};

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // Redirigir a login si no está autenticado
        if (!token && !publicRoutes.some(route => pathname.startsWith(route))) {
            // Ignorar assets estáticos
            if (pathname.startsWith('/_next') || pathname.includes('.')) {
                return NextResponse.next();
            }
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('callbackUrl', encodeURI(req.url));
            return NextResponse.redirect(loginUrl);
        }

        // Si ya está autenticado y está en una ruta pública (login), redirigir al dashboard
        if (token && publicRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/api/auth')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // Verificar permisos basados en rol
        if (token) {
            const userRole = (token.role as string)?.toLowerCase();
            const allowedPaths = rolePermissions[userRole] || [];

            // lógica simple de permisos: si la ruta empieza por alguno de los paths permitidos
            const hasAccess = allowedPaths.some(path => pathname.startsWith(path)) || pathname === '/';

            // Permitir siempre el dashboard base si tiene acceso a algo
            if (!hasAccess && !publicRoutes.some(route => pathname.startsWith(route)) && pathname !== '/dashboard') {
                // Si es una ruta protegida desconocida o no permitida
                // return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: '/login',
        }
    }
);

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
