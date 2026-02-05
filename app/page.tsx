import Header from "./components/Header";
import Hero from "./components/Hero";
import CarCarousel from "./components/CarCarousel";
import CarGrid from "./components/CarGrid";
import { getCars } from '@/lib/actions/cars';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Buscar carros do Supabase
  let cars = []
  try {
    cars = await getCars()
  } catch (error) {
    console.error('Erro ao carregar carros:', error)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CarCarousel cars={cars} />
      <CarGrid cars={cars} />
    </div>
  );
}
