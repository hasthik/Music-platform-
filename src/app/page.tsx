import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import Samples from '@/components/Samples';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import OrderForm from '@/components/OrderForm';
import Finale from '@/components/Finale';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Samples />
        <HowItWorks />
        <Pricing />
        <OrderForm />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
