const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    await prisma.point.deleteMany();
    await prisma.checkIn.deleteMany();
    await prisma.season.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('senha123', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin Sistema',
            email: 'admin@nasalinha.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    const member1 = await prisma.user.create({
        data: {
            name: 'Lucas Silva',
            email: 'lucas@example.com',
            password: hashedPassword,
            role: 'MEMBER',
        },
    });

    const member2 = await prisma.user.create({
        data: {
            name: 'Maria Santos',
            email: 'maria@example.com',
            password: hashedPassword,
            role: 'MEMBER',
        },
    });

    const trainee = await prisma.user.create({
        data: {
            name: 'Pedro Costa',
            email: 'pedro@example.com',
            password: hashedPassword,
            role: 'TRAINEE',
        },
    });

    const season = await prisma.season.create({
        data: {
            name: 'Temporada 2025.1',
            description: 'Primeira temporada de 2025',
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-06-30'),
            isActive: true,
            pointsPerCheckIn: 10,
        },
    });

    const checkIn1 = await prisma.checkIn.create({
        data: {
            userId: member1.id,
            seasonId: season.id,
            photoUrl: 'https://lh3.googleusercontent.com/p/AF1QipOx2WzCi8PRjXdKSP2bbPlFn-f5G0fjJAQa_Z63=s680-w680-h510-rw',
            status: 'APPROVED',
            points: 10,
        },
    });

    const checkIn2 = await prisma.checkIn.create({
        data: {
            userId: member1.id,
            seasonId: season.id,
            photoUrl: 'https://lh3.googleusercontent.com/p/AF1QipOx2WzCi8PRjXdKSP2bbPlFn-f5G0fjJAQa_Z63=s680-w680-h510-rw',
            status: 'APPROVED',
            points: 10,
        },
    });

    const checkIn3 = await prisma.checkIn.create({
        data: {
            userId: member2.id,
            seasonId: season.id,
            photoUrl: 'https://lh3.googleusercontent.com/p/AF1QipOx2WzCi8PRjXdKSP2bbPlFn-f5G0fjJAQa_Z63=s680-w680-h510-rw',
            status: 'APPROVED',
            points: 10,
        },
    });

    await prisma.point.create({
        data: {
            userId: member1.id,
            seasonId: season.id,
            totalPoints: 20,
            checkInsCount: 2,
        },
    });

    await prisma.point.create({
        data: {
            userId: member2.id,
            seasonId: season.id,
            totalPoints: 10,
            checkInsCount: 1,
        },
    });

    await prisma.point.create({
        data: {
            userId: trainee.id,
            seasonId: season.id,
            totalPoints: 0,
            checkInsCount: 0,
        },
    });

    console.log('\nDados criados:');
    console.log(`- Admin: admin@nasalinha.com / senha123`);
    console.log(`- Membros: lucas@example.com, maria@example.com / senha123`);
    console.log(`- Trainee: pedro@example.com / senha123`);
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
