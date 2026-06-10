import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <Link href="#" className="logo">solenne<span> studios</span></Link>
      <div className="foot-links">
        <Link href="#samples">Samples</Link>
        <Link href="#how">Process</Link>
        <Link href="#pricing">Pricing</Link>
        <Link href="#order">Order</Link>
      </div>
      <p>© {new Date().getFullYear()} Solenne Studios · All songs written by human artists, with love.</p>
    </footer>
  );
}
