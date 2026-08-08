import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Architecture from '@/components/Architecture';
import SpaceBackground from '@/components/SpaceBackground';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <SpaceBackground />
      <Hero />
      <Features />
      <Architecture />
      <Footer />
    </div>
  );
}
