import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('Ecommerce - Products')
@Controller('ecommerce/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get(':workshopId')
    @ApiOperation({ summary: 'Get published products for a store' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'price_asc', 'price_desc', 'name'] })
    async getProducts(
        @Param('workshopId') workshopId: string,
        @Query() filters: any,
    ) {
        return this.productsService.getPublishedProducts(workshopId, filters);
    }

    @Get(':workshopId/featured')
    @ApiOperation({ summary: 'Get featured products' })
    async getFeatured(@Param('workshopId') workshopId: string) {
        return this.productsService.getFeaturedProducts(workshopId);
    }

    @Get(':workshopId/category/:slug')
    @ApiOperation({ summary: 'Get products by category' })
    async getByCategory(
        @Param('workshopId') workshopId: string,
        @Param('slug') categorySlug: string,
    ) {
        return this.productsService.getProductsByCategory(workshopId, categorySlug);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get product by slug' })
    async getBySlug(@Param('slug') slug: string) {
        return this.productsService.getProductBySlug(slug);
    }
}
