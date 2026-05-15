import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, ArrowRight } from 'lucide-react';
import styles from './blog.module.css';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Taste of the Eight States</h1>
          <p className={styles.subtitle}>
            Discover traditional recipes, culinary stories, and the rich cultural heritage of Northeast India's diverse kitchens.
          </p>
        </div>
      </header>

      <main className="container">
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <article key={recipe.id} className={styles.recipeCard}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={recipe.image || '/story_hero.png'} 
                  alt={recipe.title}
                  fill
                  className={styles.recipeImage}
                />
              </div>
              <div className={styles.content}>
                <span className={styles.category}>Traditional Recipe</span>
                <h2 className={styles.recipeTitle}>{recipe.title}</h2>
                <p className={styles.summary}>{recipe.summary}</p>
                
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>25 Mins</span>
                  </div>
                  <div className={styles.metaItem}>
                    <User size={16} />
                    <span>by NE Team</span>
                  </div>
                </div>

                <Link href={`/blog/${recipe.id}`} className="btn btn-outline mt-8" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>
                  Read Recipe <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
