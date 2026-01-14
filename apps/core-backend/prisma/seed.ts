import { PrismaClient, UserRole, WorkshopStatus, MachineType, MachineStatus, MaterialType, MaterialUnit, MotorcycleType, ProductCategory, FinishType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Workshop
    const workshop = await prisma.workshop.upsert({
        where: { email: 'demo@xsafe.com' },
        update: {},
        create: {
            name: 'XSafe Demo Workshop',
            taxId: '12-34567890-0',
            address: '123 Industrial Ave, Manufacturing District',
            phone: '+54 11 1234-5678',
            email: 'demo@xsafe.com',
            status: WorkshopStatus.ACTIVE,
        },
    });
    console.log(`✅ Created workshop: ${workshop.name}`);

    // 2. Create Users (3 with different roles)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('Password123!', saltRounds);

    const usersData = [
        { email: 'admin@xsafe.com', firstName: 'Admin', lastName: 'User', role: UserRole.ADMIN },
        { email: 'operator@xsafe.com', firstName: 'Operator', lastName: 'User', role: UserRole.OPERATOR },
        { email: 'inspector@xsafe.com', firstName: 'Inspector', lastName: 'User', role: UserRole.QUALITY_INSPECTOR },
    ];

    for (const userData of usersData) {
        await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                ...userData,
                password: hashedPassword,
                workshopId: workshop.id,
            },
        });
        console.log(`✅ Created user: ${userData.email}`);
    }

    // 3. Create Supplier
    const supplier = await prisma.supplier.upsert({
        where: { email: 'supplier@steelco.com' },
        update: {},
        create: {
            name: 'SteelCo Argentina',
            email: 'supplier@steelco.com',
            phone: '+54 11 9876-5432',
            address: '456 Steel Road, Industrial Zone',
        },
    });
    console.log(`✅ Created supplier: ${supplier.name}`);

    // 4. Create Motorcycle Models (10)
    const motorcycles = [
        { brand: 'Honda', model: 'CB500X', year: 2023, engineCC: 500, type: MotorcycleType.ADVENTURE },
        { brand: 'Honda', model: 'Africa Twin', year: 2024, engineCC: 1100, type: MotorcycleType.ADVENTURE },
        { brand: 'Yamaha', model: 'MT-07', year: 2023, engineCC: 689, type: MotorcycleType.SPORT },
        { brand: 'Yamaha', model: 'Tenere 700', year: 2024, engineCC: 700, type: MotorcycleType.ADVENTURE },
        { brand: 'BMW', model: 'R 1250 GS', year: 2024, engineCC: 1254, type: MotorcycleType.ADVENTURE },
        { brand: 'BMW', model: 'F 850 GS', year: 2023, engineCC: 853, type: MotorcycleType.ADVENTURE },
        { brand: 'KTM', model: '390 Adventure', year: 2023, engineCC: 390, type: MotorcycleType.ADVENTURE },
        { brand: 'Kawasaki', model: 'Versys 650', year: 2024, engineCC: 649, type: MotorcycleType.TOURING },
        { brand: 'Suzuki', model: 'V-Strom 650', year: 2023, engineCC: 645, type: MotorcycleType.ADVENTURE },
        { brand: 'Triumph', model: 'Tiger 900', year: 2024, engineCC: 888, type: MotorcycleType.ADVENTURE },
    ];

    for (const moto of motorcycles) {
        await prisma.motorcycleModel.create({ data: moto });
    }
    console.log(`✅ Created ${motorcycles.length} motorcycle models`);

    // 5. Create Materials (5 types)
    const materials = [
        { code: 'MAT-ACERO-001', name: 'Tubo Acero 4130 25mm', type: MaterialType.ACERO_4130, thickness: 2, width: 25, length: 6000, quantity: 100, unit: MaterialUnit.METER, minStock: 20 },
        { code: 'MAT-ACERO-002', name: 'Tubo Acero 4130 30mm', type: MaterialType.ACERO_4130, thickness: 2.5, width: 30, length: 6000, quantity: 80, unit: MaterialUnit.METER, minStock: 15 },
        { code: 'MAT-ALU-001', name: 'Plancha Aluminio 6061', type: MaterialType.ALUMINIO_6061, thickness: 3, width: 1200, length: 2400, quantity: 50, unit: MaterialUnit.SHEET, minStock: 10 },
        { code: 'MAT-ALU-002', name: 'Tubo Aluminio 7075', type: MaterialType.ALUMINIO_7075, thickness: 2, width: 25, length: 6000, quantity: 40, unit: MaterialUnit.METER, minStock: 10 },
        { code: 'MAT-INOX-001', name: 'Tubo Acero Inoxidable 304', type: MaterialType.ACERO_INOXIDABLE, thickness: 2, width: 25, length: 6000, quantity: 30, unit: MaterialUnit.METER, minStock: 5 },
    ];

    for (const material of materials) {
        await prisma.material.create({
            data: {
                ...material,
                supplierId: supplier.id,
                workshopId: workshop.id,
            },
        });
    }
    console.log(`✅ Created ${materials.length} materials`);

    // 6. Create Machines (3 typical ones)
    const machines = [
        { code: 'MCH-001', name: 'Cortadora Laser Fiber', type: MachineType.LASER_CUTTER, brand: 'Trumpf', model: 'TruLaser 3030', capacity: '10mm acero, 6mm inox', status: MachineStatus.AVAILABLE },
        { code: 'MCH-002', name: 'Dobladora CNC', type: MachineType.CNC_BENDER, brand: 'Amada', model: 'HFE 100-3', capacity: '100 ton, 3m longitud', status: MachineStatus.AVAILABLE },
        { code: 'MCH-003', name: 'Maquina Soldar TIG', type: MachineType.TIG_WELDER, brand: 'Lincoln', model: 'Precision TIG 225', capacity: '225A, AC/DC', status: MachineStatus.AVAILABLE },
    ];

    for (const machine of machines) {
        await prisma.machine.create({
            data: {
                ...machine,
                workshopId: workshop.id,
            },
        });
    }
    console.log(`✅ Created ${machines.length} machines`);

    // 7. Create Customer
    const customer = await prisma.customer.upsert({
        where: { email: 'orders@motoshop.com' },
        update: {},
        create: {
            name: 'MotoShop Argentina',
            email: 'orders@motoshop.com',
            phone: '+54 11 5555-1234',
            address: '789 Motorcycle Blvd',
            workshopId: workshop.id,
        },
    });
    console.log(`✅ Created customer: ${customer.name}`);

    // 8. Create Products
    const products = [
        { sku: 'DEF-CB500X-001', name: 'Defensa Honda CB500X Full', category: ProductCategory.DEFENSE, price: 350, materialType: MaterialType.ACERO_4130, weight: 8.5, dimensions: { length: 600, width: 400, height: 300 }, finishType: FinishType.POWDER_COATED },
        { sku: 'SLD-MT07-001', name: 'Slider Yamaha MT-07', category: ProductCategory.SLIDER, price: 120, materialType: MaterialType.ALUMINIO_6061, weight: 0.5, dimensions: { length: 100, width: 50, height: 50 }, finishType: FinishType.ANODIZED },
        { sku: 'DEF-GS1250-001', name: 'Defensa BMW R1250GS Full', category: ProductCategory.DEFENSE, price: 550, materialType: MaterialType.ACERO_4130, weight: 12, dimensions: { length: 700, width: 500, height: 400 }, finishType: FinishType.POWDER_COATED },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: {
                ...product,
                workshopId: workshop.id,
            },
        });
    }
    console.log(`✅ Created ${products.length} products`);

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
