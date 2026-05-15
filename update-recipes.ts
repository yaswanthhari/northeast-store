import { prisma } from './src/lib/db';

async function main() {
  console.log('Updating recipes with real images...');
  
  await prisma.recipe.updateMany({
    where: { title: { contains: 'Gurkha' } },
    data: { image: '/nepali_chutney.png' }
  });

  await prisma.recipe.updateMany({
    where: { title: { contains: 'Sticky Rice' } },
    data: { image: '/sticky_rice_pudding.png' }
  });

  await prisma.recipe.updateMany({
    where: { title: { contains: 'Black Sesame' } },
    data: { image: '/black_sesame_curry.png' }
  });

  console.log('Recipes updated successfully!');
}

main();
