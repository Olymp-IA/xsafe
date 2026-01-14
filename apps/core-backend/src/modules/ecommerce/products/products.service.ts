import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async getPublishedProducts(workshopId: string, filters: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
    } = {}) {
        const { page = 1, limit = 20, search, minPrice, maxPrice, category, sortBy = 'newest' } = filters;
        const skip = (page - 1) * limit;

        const where: any = {
            workshopId,
            isPublished: true,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = minPrice;
            if (maxPrice) where.price.lte = maxPrice;
        }

        if (category) {
            where.category = category;
        }

        const orderBy: any = {};
        switch (sortBy) {
            case 'price_asc': orderBy.price = 'asc'; break;
            case 'price_desc': orderBy.price = 'desc'; break;
            case 'name': orderBy.name = 'asc'; break;
            default: orderBy.publishedAt = 'desc';
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    variants: { where: { isAvailable: true } },
                    reviews: { where: { status: 'APPROVED' }, take: 3 },
                    compatibleModels: true,
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getProductBySlug(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                variants: { where: { isAvailable: true } },
                reviews: {
                    where: { status: 'APPROVED' },
                    include: { customer: { select: { firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                compatibleModels: true,
                ecomCategories: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Calculate average rating
        const avgRating = product.reviews.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
            : 0;

        return { ...product, avgRating, reviewCount: product.reviews.length };
    }

    async getFeaturedProducts(workshopId: string, limit = 8) {
        return this.prisma.product.findMany({
            where: { workshopId, isPublished: true, isFeatured: true },
            include: {
                variants: { where: { isAvailable: true }, take: 1 },
            },
            take: limit,
        });
    }

    async getProductsByCategory(workshopId: string, categorySlug: string) {
        const category = await this.prisma.ecommerceCategory.findFirst({
            where: { workshopId, slug: categorySlug },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return this.prisma.product.findMany({
            where: {
                workshopId,
                isPublished: true,
                ecomCategories: { some: { id: category.id } },
            },
            include: { variants: { where: { isAvailable: true } } },
        });
    }
}
