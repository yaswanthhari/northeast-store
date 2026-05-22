'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import styles from './product-detail.module.css';
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  Heart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Star,
  Package,
  Clock,
  Thermometer,
} from 'lucide-react';

interface Category { id: string; name: string; slug: string; }
interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  state: string;
  image: string;
  description?: string | null;
  isNew?: boolean;
  isBestseller?: boolean;
  stock?: number;
  category: Category;
}

function generateDescription(product: Product) {
  return {
    taste: `${product.name} from ${product.state} offers an authentic, bold flavour deeply rooted in Northeast Indian culinary tradition. Each batch is crafted using time-honoured recipes passed down through generations.`,
    ingredients: `Carefully sourced local ingredients from ${product.state}, prepared with traditional methods. Free from artificial preservatives and additives.`,
    origin: `Originating from the lush hills and valleys of ${product.state}, this product represents the rich cultural heritage of Northeast India.`,
    shelfLife: '6 months from the date of manufacture when stored properly.',
    storage: 'Store in a cool, dry place away from direct sunlight. Refrigerate after opening.',
    weight: ['100g', '200g', '500g'],
  };
}

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(0);

  const desc = generateDescription(product);
  const images = [product.image, product.image, product.image];
  const [activeImg, setActiveImg] = useState(0);

  const discountPct = product.discountPrice
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <div className={styles.page}>
      {/* ── BREADCRUMB ── */}
      <div className={styles.breadcrumbBar}>
        <div className="container">
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`}>
              {product.category.name}
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container">
        <Link href="/products" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        {/* ── MAIN GRID ── */}
        <div className={styles.mainGrid}>

          {/* ── SECTION 1: GALLERY ── */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              {product.isNew && <span className={styles.badgeNew}>New</span>}
              {product.isBestseller && <span className={styles.badgeBestseller}>Bestseller</span>}
              {discountPct > 0 && <span className={styles.badgeDiscount}>-{discountPct}%</span>}
              <Image
                src={images[activeImg]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.mainImage}
              />
            </div>
            <div className={styles.thumbnails}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill sizes="80px" className={styles.thumbImg} />
                </button>
              ))}
            </div>
          </div>

          {/* ── SECTION 2 + 3 + 4 + 5 + 6: INFO ── */}
          <div className={styles.info}>

            {/* SECTION 2 — Product Info */}
            <div className={styles.infoTop}>
              <div className={styles.categoryTag}>
                {product.category.name} · {product.state}
              </div>
              <h1 className={styles.productName}>{product.name}</h1>

              <div className={styles.ratingRow}>
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={15} fill={s <= 4 ? '#d4af37' : 'none'} color="#d4af37" />
                ))}
                <span className={styles.ratingText}>4.0 · 24 reviews</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>₹{product.price}</span>
                {product.discountPrice && (
                  <>
                    <span className={styles.oldPrice}>₹{product.discountPrice}</span>
                    <span className={styles.saveBadge}>Save {discountPct}%</span>
                  </>
                )}
              </div>

              <div className={styles.stockRow}>
                <span className={`${styles.stockDot} ${(product.stock ?? 100) > 0 ? styles.inStock : styles.outOfStock}`} />
                <span className={styles.stockText}>
                  {(product.stock ?? 100) > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* SECTION 3 — Description */}
            <div className={styles.descSection}>
              <div className={styles.descGrid}>
                <div className={styles.descItem}>
                  <span className={styles.descIcon}><Star size={14} /></span>
                  <div>
                    <strong>Taste</strong>
                    <p>{desc.taste}</p>
                  </div>
                </div>
                <div className={styles.descItem}>
                  <span className={styles.descIcon}><Package size={14} /></span>
                  <div>
                    <strong>Ingredients</strong>
                    <p>{desc.ingredients}</p>
                  </div>
                </div>
                <div className={styles.descItem}>
                  <span className={styles.descIcon}><Clock size={14} /></span>
                  <div>
                    <strong>Shelf Life</strong>
                    <p>{desc.shelfLife}</p>
                  </div>
                </div>
                <div className={styles.descItem}>
                  <span className={styles.descIcon}><Thermometer size={14} /></span>
                  <div>
                    <strong>Storage</strong>
                    <p>{desc.storage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Options */}
            <div className={styles.weightSection}>
              <p className={styles.weightLabel}>Select Weight</p>
              <div className={styles.weightOptions}>
                {desc.weight.map((w, i) => (
                  <button
                    key={w}
                    className={`${styles.weightBtn} ${selectedWeight === i ? styles.weightBtnActive : ''}`}
                    onClick={() => setSelectedWeight(i)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 5 — Quantity */}
            <div className={styles.quantityRow}>
              <span className={styles.qtyLabel}>Quantity</span>
              <div className={styles.qtyPicker}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(q => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* SECTION 4 — Actions */}
            <div className={styles.actions}>
              <button
                onClick={handleAddToCart}
                className={`${styles.addCartBtn} ${addedToCart ? styles.addedBtn : ''}`}
                disabled={(product.stock ?? 100) === 0}
              >
                <ShoppingCart size={18} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className={styles.buyNowBtn}
                disabled={(product.stock ?? 100) === 0}
              >
                <Zap size={18} />
                Buy Now
              </button>
              <button
                className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
                onClick={() => setWishlisted(w => !w)}
                aria-label="Add to wishlist"
              >
                <Heart size={18} fill={wishlisted ? '#d4af37' : 'none'} />
              </button>
            </div>

            {/* SECTION 6 — Delivery Info */}
            <div className={styles.deliveryBox}>
              <div className={styles.deliveryItem}>
                <Truck size={16} color="#12402b" />
                <div>
                  <strong>Free Delivery</strong>
                  <span>Delivered in 5–7 business days across India</span>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <ShieldCheck size={16} color="#12402b" />
                <div>
                  <strong>Secure Payment</strong>
                  <span>Cash on Delivery available. 100% safe checkout.</span>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <Package size={16} color="#12402b" />
                <div>
                  <strong>Authentic & Fresh</strong>
                  <span>Sourced directly from {product.state}, Northeast India</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3 extended — Origin Story */}
        <div className={styles.originSection}>
          <div className={styles.originContent}>
            <h2 className={styles.originTitle}>The Story Behind This Product</h2>
            <p className={styles.originText}>{desc.origin}</p>
          </div>
        </div>

        {/* SECTION 7 — Related Products */}
        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
              <Link href={`/products?category=${product.category.slug}`} className={styles.viewAllLink}>
                View All
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* MOBILE STICKY FOOTER */}
      <div className={styles.mobileSticky}>
        <div className={styles.mobileStickyPrice}>₹{product.price}</div>
        <button onClick={handleAddToCart} className={styles.mobileStickyBtn}>
          <ShoppingCart size={16} />
          {addedToCart ? 'Added!' : 'Add to Cart'}
        </button>
        <button onClick={handleBuyNow} className={styles.mobileStickyBuyBtn}>
          <Zap size={16} />
          Buy Now
        </button>
      </div>
    </div>
  );
}