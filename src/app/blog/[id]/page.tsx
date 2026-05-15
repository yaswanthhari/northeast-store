import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User, ChefHat } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const recipe = await prisma.recipe.findUnique({
    where: { id }
  });

  if (!recipe) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#f9fbf9', minHeight: '100vh', padding: '12rem 0 8rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d4af37', fontWeight: 700, marginBottom: '3rem', textDecoration: 'none' }}>
          <ArrowLeft size={20} /> BACK TO RECIPES
        </Link>

        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', color: '#12402b', marginBottom: '2rem' }}>{recipe.title}</h1>
        
        <div style={{ display: 'flex', gap: '3rem', marginBottom: '4rem', color: 'rgba(18, 64, 43, 0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} /> <span>30 Mins Prep</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChefHat size={20} /> <span>Authentic Style</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} /> <span>By Northeast Store</span>
          </div>
        </div>

        <div style={{ position: 'relative', height: '500px', borderRadius: '30px', overflow: 'hidden', marginBottom: '5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
          <Image 
            src={recipe.image || '/story_hero.png'} 
            alt={recipe.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#12402b' }}>
          <p style={{ fontWeight: 600, fontSize: '1.5rem', marginBottom: '2rem', fontStyle: 'italic', color: '#d4af37' }}>
            "{recipe.summary}"
          </p>
          
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {recipe.content || `The culinary heritage of the Eight States is as diverse as its people. This traditional recipe for ${recipe.title} has been passed down through generations, utilizing fresh, organic ingredients sourced directly from the local hills.

Stay tuned as we update our kitchen journal with the full step-by-step preparation for this regional favorite!`}
          </div>
        </div>
      </div>
    </div>
  );
}
