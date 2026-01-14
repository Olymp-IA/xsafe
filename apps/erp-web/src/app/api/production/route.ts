import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/db';
import { z } from 'zod';
import { createOrderSchema } from '@/lib/validations/production';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        // Obtener parámetros de consulta
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Construir condiciones de filtro
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (priority) {
            where.priority = priority;
        }

        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } },
                { motorcycleModel: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        // Obtener órdenes con paginación
        const [orders, total] = await Promise.all([
            prisma.productionOrder.findMany({
                where,
                include: {
                    stages: {
                        include: {
                            assignedTo: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                            machine: true,
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.productionOrder.count({ where }),
        ]);

        return NextResponse.json({
            data: orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validar datos de entrada
        const validatedData = createOrderSchema.parse(body);

        // Generar número de orden único
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const lastOrder = await prisma.productionOrder.findFirst({
            where: {
                orderNumber: {
                    startsWith: `ORD-${year}${month}`,
                },
            },
            orderBy: {
                orderNumber: 'desc',
            },
        });

        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
            sequence = lastSequence + 1;
        }

        const orderNumber = `ORD-${year}${month}-${String(sequence).padStart(4, '0')}`;

        // Crear orden en la base de datos
        const order = await prisma.productionOrder.create({
            data: {
                orderNumber,
                customerName: validatedData.customerName,
                motorcycleModel: validatedData.motorcycleModel,
                productType: validatedData.productType,
                priority: validatedData.priority,
                dueDate: new Date(validatedData.dueDate),
                notes: validatedData.notes,
                status: 'PENDING',
                createdById: session.user.id,
                stages: {
                    create: [
                        {
                            stageType: 'DESIGN',
                            status: 'PENDING',
                            estimatedHours: 8,
                            order: 1,
                        },
                        {
                            stageType: 'FABRICATION',
                            status: 'PENDING',
                            estimatedHours: 24,
                            order: 2,
                        },
                        {
                            stageType: 'ASSEMBLY',
                            status: 'PENDING',
                            estimatedHours: 16,
                            order: 3,
                        },
                        {
                            stageType: 'QUALITY_CHECK',
                            status: 'PENDING',
                            estimatedHours: 4,
                            order: 4,
                        },
                    ],
                },
            },
            include: {
                stages: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Orden creada exitosamente',
                data: order
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
