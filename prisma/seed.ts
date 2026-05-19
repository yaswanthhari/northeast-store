import { PrismaClient, type Category } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.recipe.deleteMany();

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'USER',
    }
  });
  console.log('Test user created:', testUser.email);

  const admin1 = await prisma.user.create({
    data: {
      email: 'yaswanthharitaluru@gmail.com',
      password: hashedPassword,
      name: 'Yaswanth Hari Taluru',
      role: 'ADMIN',
    }
  });
  console.log('Admin user created:', admin1.email);

  const admin2 = await prisma.user.create({
    data: {
      email: 'yaswanthharit@gmail.com',
      password: hashedPassword,
      name: 'Yaswanth Hari',
      role: 'ADMIN',
    }
  });
  console.log('Admin user created:', admin2.email);

  const regularUser = await prisma.user.create({
    data: {
      email: 'yaswanth@gmail.com',
      password: hashedPassword,
      name: 'Yaswanth',
      role: 'USER',
    }
  });
  console.log('Regular user created:', regularUser.email);

  const admin3 = await prisma.user.create({
    data: {
      email: 'parimigayatri5@gmail.com',
      password: hashedPassword,
      name: 'Gayatri Parimi',
      role: 'ADMIN',
    }
  });
  console.log('Admin user created:', admin3.email);

  const admin4 = await prisma.user.create({
    data: {
      email: '23051003@kiit.ac.in',
      password: hashedPassword,
      name: 'KIIT Member',
      role: 'ADMIN',
    }
  });
  console.log('Admin user created:', admin4.email);

  const admin5 = await prisma.user.create({
    data: {
      email: 'yugayatra@gmail.com',
      password: hashedPassword,
      name: 'Yugayatra Admin',
      role: 'ADMIN',
    }
  });
  console.log('Admin user created:', admin5.email);

  console.log('Seeding categories...');
  const categories = [
    { name: 'Pickles', slug: 'pickles' },
    { name: 'Smoked Meats', slug: 'smoked-meats' },
    { name: 'Cooking Ingredients', slug: 'cooking-ingredients' },
    { name: 'Meat Snacks', slug: 'meat-snacks' },
    { name: 'Beverages', slug: 'beverages' },
    { name: 'Spices', slug: 'spices' },
    { name: 'Sweet Corner', slug: 'sweet-corner' },
    { name: 'Grains', slug: 'grains' },
  ];

  const createdCategories: Category[] = [];
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories.push(created);
  }

  const findCat = (slug: string) => createdCategories.find(c => c.slug === slug)?.id || createdCategories[0].id;

  console.log('Seeding products...');
  const products = [
    // PICKLES
    {
      name: 'Pork Pickle, HS',
      price: 289.00,
      state: 'Assam',
      image: '/pork_pickle.png',
      description: 'Traditional Assam style pork pickle with secret spices.',
      categoryId: findCat('pickles'),
      isPopular: true,
      isNew: true,
    },
    {
      name: 'Sohphie, Bayberry Pickle',
      price: 189.00,
      state: 'Meghalaya',
      image: '/bayberry.png',
      description: 'Tangy and sweet wild bayberry pickle.',
      categoryId: findCat('pickles'),
      isNew: true,
    },
    {
      name: 'Garcinia, Sohdanei Pickle',
      price: 180.00,
      state: 'Assam',
      image: '/thekera.png',
      description: 'Authentic Thekera Tenga (Dried Garcinia) pickle.',
      categoryId: findCat('pickles'),
      isNew: true,
    },
    // SMOKED MEATS
    {
      name: 'Smoked Pork (On Pre-Order)',
      price: 599.00,
      state: 'Nagaland',
      image: '/smoked_pork.png',
      description: 'Authentic Nagaland smoked pork, traditionally prepared over wood fire.',
      categoryId: findCat('smoked-meats'),
      isBestseller: true,
      isMostViewed: true,
    },
    {
      name: 'Smoked Beef',
      price: 650.00,
      state: 'Nagaland',
      image: '/smoked_beef.png',
      description: 'Premium quality smoked beef, slow-cooked for days.',
      categoryId: findCat('smoked-meats'),
      isNew: true,
    },
    {
      name: 'Smoked Chicken with Bamboo Shoot',
      price: 520.00,
      state: 'Nagaland',
      image: '/smoked_chicken.png',
      description: 'Tender smoked chicken pieces infused with the tangy flavor of bamboo shoot.',
      categoryId: findCat('smoked-meats'),
    },
    // MEAT SNACKS
    {
      name: 'Crispy Garlic Shrimp Chutney',
      price: 235.00,
      state: 'Manipur',
      image: '/shrimp_chutney.png',
      description: 'Crunchy, spicy, and full of umami. A Manipur specialty.',
      categoryId: findCat('meat-snacks'),
      isPopular: true,
      isNew: true,
    },
    {
      name: 'Pork Chutney, Naga Style',
      price: 199.00,
      state: 'Mizoram',
      image: '/pork_chutney.png',
      description: 'Home-made style pork chutney with local herbs.',
      categoryId: findCat('meat-snacks'),
      isBestseller: true,
    },
    {
      name: 'Beef Chutney, HB',
      price: 215.00,
      state: 'Meghalaya',
      image: '/beef_chutney.png',
      description: 'Rich, smoky, and genuinely meaty beef chutney.',
      categoryId: findCat('meat-snacks'),
      isBestseller: true,
    },
    {
      name: 'Sidol (Dry Fish Chutney)',
      price: 185.00,
      state: 'Tripura',
      image: '/sidol.png',
      description: 'Traditional fermented dry fish chutney with an intense flavor profile.',
      categoryId: findCat('meat-snacks'),
    },
    // SPICES
    {
      name: 'Bhut Jolokia Chilli Oil',
      price: 242.10,
      discountPrice: 269.00,
      state: 'Nagaland',
      image: '/chilli_oil.png',
      description: 'Infused with the world famous ghost pepper.',
      categoryId: findCat('spices'),
      isPopular: true,
    },
    {
      name: 'Long Pepper, Pippali',
      price: 250.00,
      state: 'Meghalaya',
      image: '/pippali.png',
      description: 'Traditional medicinal and culinary spice from Meghalaya.',
      categoryId: findCat('spices'),
      isNew: true,
    },
    {
      name: 'Dry King Chili (Ghost Chili)',
      price: 160.00,
      state: 'Nagaland',
      image: '/king_chili.png',
      description: 'World famous Bhut Jolokia in its driest, most potent form.',
      categoryId: findCat('spices'),
      isBestseller: true,
      isMostViewed: true,
    },
    {
      name: 'Lakadong Turmeric Powder',
      price: 199.00,
      state: 'Meghalaya',
      image: '/turmeric.png',
      description: 'Highest curcumin content turmeric from Jaintia Hills.',
      categoryId: findCat('spices'),
    },
    // COOKING INGREDIENTS
    {
      name: 'Fermented Bamboo Shoot',
      price: 175.00,
      state: 'Assam',
      image: '/bamboo_shoot.png',
      description: 'Authentic Khorisa (fermented bamboo shoot) in a ready-to-use form.',
      categoryId: findCat('cooking-ingredients'),
      isNew: true,
    },
    {
      name: 'Axone (Fermented Soybean)',
      price: 149.00,
      state: 'Nagaland',
      image: '/axone.png',
      description: 'Traditional fermented soyabean cakes, a staple in Naga cuisine.',
      categoryId: findCat('cooking-ingredients'),
    },
    {
      name: "Bird's Eye Chili Powder",
      price: 120.00,
      state: 'Mizoram',
      image: '/birds_eye_powder.png',
      description: "Extra spicy chili powder made from sun-dried bird's eye chilies.",
      categoryId: findCat('cooking-ingredients'),
    },
    // BEVERAGES
    {
      name: 'Masala Chai',
      price: 250.00,
      state: 'Assam',
      image: '/masala_chai.png',
      description: 'Premium Orthodox Assam tea blended with traditional spices.',
      categoryId: findCat('beverages'),
      isPopular: true,
    },
    {
      name: 'Purple Tea',
      price: 300.00,
      state: 'Arunachal Pradesh',
      image: '/purple_tea.png',
      description: 'Rare and antioxidant-rich tea from Arunachal.',
      categoryId: findCat('beverages'),
    },
    // SWEET CORNER
    {
      name: 'Raw Wild Forest Honey',
      price: 399.00,
      state: 'Nagaland',
      image: '/honey.png',
      description: 'Wild apple flower honey sourced from the deep forests of Nagaland.',
      categoryId: findCat('sweet-corner'),
      isPopular: true,
    },
    {
      name: 'Sohïong Jam (Wild Blackberry)',
      price: 195.00,
      state: 'Meghalaya',
      image: '/blackberry_jam.png',
      description: 'Exotic wild blackberry jam from the Khasi hills.',
      categoryId: findCat('sweet-corner'),
    },
    // GRAINS
    {
      name: 'Manipuri Black Rice',
      price: 245.00,
      state: 'Manipur',
      image: '/black_rice.png',
      description: 'Nutritious and aromatic "Forbidden Rice" from Manipur.',
      categoryId: findCat('grains'),
      isPopular: true,
      isNew: true,
    },
    {
      name: 'Assamese Red Rice',
      price: 185.00,
      state: 'Assam',
      image: '/red_rice.png',
      description: 'High-fiber red rice, traditionally grown in the Brahmaputra valley.',
      categoryId: findCat('grains'),
    },
    {
      name: 'Naga Sticky Rice',
      price: 165.00,
      state: 'Nagaland',
      image: '/sticky_rice_pudding.png',
      description: 'Sweet and sticky rice, perfect for traditional desserts.',
      categoryId: findCat('grains'),
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Seeding testimonials...');
  const testimonials = [
    {
      name: 'Megha Talukdar',
      city: 'Kolkata',
      content: "The best place to get real Northeastern food items! I love everything, but my favorites are the dry bhoot jolokia and bird's eye chili pickle.",
    },
    {
      name: 'Devashish B',
      city: 'Hyderabad',
      content: "I'm thrilled with my order! The packaging exhibits remarkable attention to detail. Bravo to the group!",
    },
    {
      name: 'J Sailo',
      city: 'Delhi',
      content: "Sincere flavor reminiscent of the food prepared by my Khasi friend's grandma. Five stars for everything.",
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('Seeding recipes...');
  const recipes = [
    {
      title: 'Black Sesame Potato Curry',
      summary: 'Potato curry with black sesame paste gives such a unique flavor profile typical of the region.',
      image: '/black_sesame_curry.png',
    },
    {
      title: 'White Sticky Rice Pudding',
      summary: 'A simple and traditional recipe for White Sticky Rice Pudding, a comfort food staple.',
      image: '/sticky_rice_pudding.png',
    },
    {
      title: 'Gurkha/Nepali Chutney',
      summary: 'Nepali chutney / Gorkha chutney aka matar chana with a spicy kick.',
      image: '/nepali_chutney.png',
    }
  ];

  for (const r of recipes) {
    await prisma.recipe.create({ data: r });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
