"use client";

import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BenefitsSection, TrustSignals } from "@/components/home/benefits-section";
import { CampaignBanner } from "@/components/home/campaign-banner";
import { NewsletterSignup } from "@/components/home/newsletter-signup";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <TrustSignals />

      <CategoryGrid />

      <FeaturedProducts />

      <CampaignBanner />

      <BenefitsSection />

      <NewsletterSignup />
    </div>
  );
}
