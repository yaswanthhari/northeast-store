import Link from 'next/link';
import Image from 'next/image';
import { HeartHandshake, Leaf, ShoppingBag, ArrowRight, Star, Quote, UtensilsCrossed } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import HeroContent from '@/components/HeroContent';
import styles from './page.module.css';
import { prisma } from '@/lib/db';

// ✅ Fix 5: replaced force-dynamic with revalidation — pages are cached and rebuilt every 60s
export const revalidate = 60;

export default async function Home() {

  // ✅ Fix 4: all 5 queries run in parallel instead of one after another
  const [popularProducts, latestProducts, topSelling, testimonials, recipes] =
    await Promise.all([
      prisma.product.findMany({
        where: { isPopular: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { isNew: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { isBestseller: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.testimonial.findMany({ take: 3 }),
      prisma.recipe.findMany({ take: 3 }),
    ]);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="/northeast_hero.png" 
            alt="Northeast India Landscapes" 
            fill 
            priority
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <HeroContent />
        </div>
      </section>

      {/* Service Ribbons */}
      <section className={styles.ribbon}>
        <div className="container">
          <div className={styles.ribbonGrid}>
            <div className={styles.ribbonItem}>
              <ShoppingBag size={24} />
              <span>Free Shipping*</span>
            </div>
            <div className={styles.ribbonItem}>
              <UtensilsCrossed size={24} />
              <span>Authentic Recipes</span>
            </div>
            <div className={styles.ribbonItem}>
              <HeartHandshake size={24} />
              <span>Direct from Farmers</span>
            </div>
            <div className={styles.ribbonItem}>
              <Leaf size={24} />
              <span>Secure Shopping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Picks */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Picks</h2>
            <Link href="/products" className={styles.viewAll}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.productGrid}>
            {popularProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* What We Do / Mission */}
      <section className={styles.missionSection}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionContent}>
              <h2 className={styles.missionTitle}>What We Do</h2>
              <p className={styles.missionText}>
                NortheastStore is an online marketplace dedicated to promoting and selling authentic products from the eight states of Northeast India. 
                We serve as a digital bridge between local producers, farmers, and small businesses from the region and customers looking for traditional, organic food products.
              </p>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <h3>8</h3>
                  <span>States</span>
                </div>
                <div className={styles.statItem}>
                  <h3>128+</h3>
                  <span>Products</span>
                </div>
                <div className={styles.statItem}>
                  <h3>50+</h3>
                  <span>Farmers</span>
                </div>
              </div>
            </div>
            <div className={styles.missionImageWrapper}>
              <Image src="/northeast_hero.png" alt="What We Do" width={600} height={400} className={styles.missionImage} />
            </div>
          </div>
        </div>
      </section>

      {/* Latest & Bestselling Products */}
      <section className={styles.section} style={{ backgroundColor: '#f9fbf9' }}>
        <div className="container">
          <div className={styles.rowGrid}>
            <div className={styles.col}>
              <h2 className={styles.rowTitle}>Our Latest Products</h2>
              <div className={styles.productList}>
                {latestProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
            <div className={styles.col}>
              <h2 className={styles.rowTitle}>Top Selling Products</h2>
              <div className={styles.productList}>
                {topSelling.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialSection}>
        <div className="container" style={{ position: 'relative' }}>
          <div className={styles.sectionHeaderCenter}>
            <Quote size={40} className={styles.quoteIcon} />
            <h2 className={styles.sectionTitle}>Real People, Real Stories</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((t) => (
              <div key={t.id} className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#d4af37" color="#d4af37" />
                  ))}
                </div>
                <p className={styles.testimonialContent}>"{t.content}"</p>
                <div className={styles.testimonialUser}>
                  <strong>{t.name}</strong>
                  <span>{t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog / Recipes */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>From our Blog</h2>
            <Link href="/blog" className={styles.viewAll}>
              Latest Recipes <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.recipeGrid}>
            {recipes.map((r) => (
              <div key={r.id} className={styles.recipeCard}>
                <div className={styles.recipeImageWrapper}>
                  <Image
                    src={r.image || '/story_hero.png'}
                    alt={r.title}
                    fill
                    className={styles.recipeImage}
                  />
                  <span className={styles.recipeTag}>RECIPE</span>
                </div>
                <div className={styles.recipeContent}>
                  <h3>{r.title}</h3>
                  <p>{r.summary}</p>
                  <Link href={`/blog/${r.id}`} className={styles.readMore}>Read Recipe</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}