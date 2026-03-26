import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  Menu, 
  X, 
  BarChart3, 
  Wallet, 
  Landmark, 
  Mail, 
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Founder', href: '#founder' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-nexus-dark/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-nexus-gold to-nexus-gold-dark rounded-lg flex items-center justify-center text-nexus-dark font-bold text-xl">
            N
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-white group-hover:text-nexus-gold transition-colors">
            Nexus<span className="text-nexus-gold">Edge</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-slate-300 hover:text-nexus-gold transition-colors uppercase tracking-wider"
            >
              {link.name}
            </a>
          ))}
          <Link 
            to="/login" 
            className="px-6 py-2.5 bg-transparent border border-nexus-gold text-nexus-gold hover:bg-nexus-gold hover:text-nexus-dark transition-all duration-300 font-medium rounded-sm uppercase tracking-wider text-xs"
          >
            Client Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-nexus-dark border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-300 hover:text-nexus-gold"
                >
                  {link.name}
                </a>
              ))}
              <Link 
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 px-6 py-3 bg-nexus-gold text-nexus-dark font-bold text-center rounded-sm"
              >
                Client Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CryptoTicker = () => {
  const tickers = [
    { symbol: 'BTC', price: '98,432.10', change: '+2.4%' },
    { symbol: 'ETH', price: '3,842.50', change: '+1.8%' },
    { symbol: 'SOL', price: '145.20', change: '+4.2%' },
    { symbol: 'XRP', price: '1.12', change: '-0.5%' },
    { symbol: 'BNB', price: '612.40', change: '+0.9%' },
    { symbol: 'ADA', price: '0.78', change: '+1.2%' },
    { symbol: 'DOT', price: '9.45', change: '+3.1%' },
  ];

  return (
    <div className="bg-nexus-navy border-b border-white/5 py-2 overflow-hidden flex items-center relative z-40">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...tickers, ...tickers, ...tickers].map((ticker, i) => (
          <div key={i} className="flex items-center mx-6 text-xs font-mono">
            <span className="font-bold text-slate-300 mr-2">{ticker.symbol}</span>
            <span className="text-slate-400 mr-2">${ticker.price}</span>
            <span className={ticker.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
              {ticker.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-nexus-dark">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-nexus-dark via-transparent to-nexus-dark"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-nexus-dark to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-nexus-gold text-xs font-medium uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-nexus-gold animate-pulse"></span>
            Institutional Grade Finance
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Powering the <br />
            <span className="gold-gradient-text">Future of Wealth</span>
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-lg leading-relaxed">
            Secure. Strategic. Scalable. We bridge the gap between traditional finance and the digital asset economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-nexus-gold hover:bg-white text-nexus-dark font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Start Investing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#contact" 
              className="px-8 py-4 bg-transparent border border-white/20 hover:border-nexus-gold text-white hover:text-nexus-gold font-medium rounded-sm transition-all duration-300 flex items-center justify-center"
            >
              Book Consultation
            </a>
          </div>
          
          <div className="mt-12 flex items-center gap-8 text-sm text-blue-300 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-nexus-gold" />
              <span>SECURE ASSET CUSTODY</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-nexus-gold" />
              <span>GLOBAL COMPLIANCE</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden md:block"
        >
          {/* Abstract Financial Visualization */}
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-nexus-gold/20 to-transparent rounded-full blur-3xl"></div>
            <div className="relative h-full w-full glass-panel rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider">Total Assets Managed</p>
                  <h3 className="text-4xl font-mono font-bold text-white mt-1">$482.5M<span className="text-nexus-gold text-lg">+</span></h3>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <TrendingUp className="text-nexus-gold w-6 h-6" />
                </div>
              </div>
              
              {/* Mock Chart */}
              <div className="h-48 flex items-end gap-2 mt-8">
                {[40, 65, 50, 80, 65, 90, 85, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className={`flex-1 rounded-t-sm ${i === 7 ? 'bg-nexus-gold' : 'bg-white/10'}`}
                  ></motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-blue-300 mb-1">YTD Return</p>
                  <p className="text-nexus-gold font-mono font-bold">+124.8%</p>
                </div>
                <div>
                  <p className="text-xs text-blue-300 mb-1">Active Portfolios</p>
                  <p className="text-white font-mono font-bold">1,240+</p>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 glass-panel p-4 rounded-xl flex items-center gap-3 shadow-2xl shadow-black/50"
            >
              <div className="w-10 h-10 rounded-full bg-nexus-gold/20 flex items-center justify-center text-nexus-gold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-blue-300 uppercase">Audit Status</p>
                <p className="text-white font-bold">100% Verified</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-nexus-navy relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Bridging Tradition with <span className="text-nexus-gold">Innovation</span></h2>
            <p className="text-blue-200 leading-relaxed mb-6">
              NexusEdge Finance stands at the forefront of the financial revolution. We combine the stability of traditional fiat asset management with the explosive growth potential of cryptocurrency markets.
            </p>
            <p className="text-blue-200 leading-relaxed mb-8">
              Our expert-led team employs institutional-grade risk management strategies to navigate volatile markets, ensuring long-term wealth preservation and growth for our partners and clients.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                "Expert-led crypto & fiat asset management",
                "Diversified portfolio strategies",
                "Institutional-grade risk management",
                "Long-term wealth building focus"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-nexus-gold rounded-full"></div>
                  <span className="text-blue-100">{item}</span>
                </li>
              ))}
            </ul>
            
            <a href="#contact" className="inline-flex items-center gap-2 text-nexus-gold font-medium hover:gap-3 transition-all group">
              Schedule Strategy Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border border-nexus-gold/20 rounded-sm z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600" 
              alt="NexusEdge Office" 
              className="relative z-10 w-full h-auto rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Partnerships = () => {
  return (
    <section className="py-16 border-y border-white/5 bg-nexus-dark">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-10">Backed by Strategic Global Partnerships</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Text-based logos for reliability */}
          <div className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 border-2 border-white rounded-full"></span>
            BlackRock
          </div>
          <div className="text-2xl md:text-3xl font-sans font-bold tracking-tighter text-white flex items-center gap-2">
            <Globe className="w-8 h-8" />
            WORLD LIBERTY <span className="font-light">FINANCIAL</span>
          </div>
          <div className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-2">
            <Landmark className="w-8 h-8" />
            FIDELITY
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      icon: <Wallet className="w-8 h-8 text-nexus-gold" />,
      title: "Crypto Portfolio Management",
      description: "Active management of digital assets using proprietary algorithms and expert market analysis to maximize returns while mitigating volatility."
    },
    {
      icon: <Landmark className="w-8 h-8 text-nexus-gold" />,
      title: "Fiat Asset Strategies",
      description: "Traditional investment vehicles including bonds, equities, and forex, structured to provide a stable foundation for your wealth portfolio."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-nexus-gold" />,
      title: "Long-Term Wealth Structuring",
      description: "Comprehensive financial planning focusing on tax efficiency, estate planning, and multi-generational wealth transfer."
    }
  ];

  return (
    <section id="services" className="py-24 bg-nexus-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-nexus-navy to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Investment <span className="text-nexus-gold">Services</span></h2>
          <p className="text-blue-200 max-w-2xl mx-auto">Tailored financial solutions designed for the modern investor.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="glass-panel p-8 rounded-xl group hover:border-nexus-gold/30 transition-colors"
            >
              <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-nexus-gold/10 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-nexus-gold transition-colors">{service.title}</h3>
              <p className="text-blue-200 leading-relaxed text-sm mb-6">
                {service.description}
              </p>
              <a href="#contact" className="inline-flex items-center text-nexus-gold text-sm font-medium hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "NexusEdge Finance transformed my crypto portfolio into consistent growth. Their approach is unlike anything else in the market.",
      author: "Michael R.",
      location: "London",
      role: "Angel Investor"
    },
    {
      quote: "Professional, transparent and highly strategic investment approach. I finally feel like my digital assets are in safe hands.",
      author: "Sarah L.",
      location: "Toronto",
      role: "Tech Executive"
    },
    {
      quote: "Their risk management strategy gives me confidence in volatile markets. The returns have consistently outperformed my expectations.",
      author: "David K.",
      location: "New York",
      role: "Real Estate Developer"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-nexus-navy relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4">What Our <span className="text-nexus-gold">Investors Say</span></h2>
            <p className="text-blue-200">Trusted by high-net-worth individuals worldwide.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="p-3 border border-white/10 rounded-full hover:bg-white/5 transition-colors"><ArrowRight className="w-5 h-5 rotate-180" /></button>
            <button className="p-3 border border-white/10 rounded-full hover:bg-white/5 transition-colors"><ArrowRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-nexus-dark p-8 rounded-xl border border-white/5 relative">
              <div className="text-nexus-gold text-6xl font-serif absolute top-4 left-4 opacity-20">"</div>
              <p className="text-blue-100 italic mb-8 relative z-10 leading-relaxed">
                {item.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center font-bold text-white">
                  {item.author[0]}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.author}</h4>
                  <p className="text-xs text-nexus-gold">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Founder = () => {
  return (
    <section id="founder" className="py-24 bg-nexus-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-panel rounded-2xl p-8 md:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-gold/10 blur-[100px] rounded-full"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="order-2 md:order-1">
              <div className="inline-block px-3 py-1 bg-nexus-gold/10 text-nexus-gold text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Leadership
              </div>
              <h2 className="text-4xl font-bold mb-2">Flynn Thomas</h2>
              <p className="text-xl text-blue-200 font-serif italic mb-6">Founder & Chief Investment Strategist</p>
              
              <div className="space-y-6 text-blue-100 leading-relaxed">
                <p>
                  With over a decade of experience bridging the gap between traditional finance and the emerging digital asset economy, Flynn Thomas has established himself as a visionary leader in the fintech space.
                </p>
                <p>
                  His background in institutional asset strategy allows NexusEdge Finance to offer a unique value proposition: the high-growth potential of crypto with the rigorous risk management frameworks of Wall Street.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-white">10+</p>
                  <p className="text-xs text-blue-300 uppercase tracking-wider">Years Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">$500M+</p>
                  <p className="text-xs text-blue-300 uppercase tracking-wider">Assets Strategized</p>
                </div>
              </div>
              
              <div className="mt-8">
                 <a href="mailto:Flynnthomas907@gmail.com" className="text-nexus-gold hover:underline flex items-center gap-2">
                   <Mail className="w-4 h-4" /> Contact Flynn Directly
                 </a>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-72 h-80 md:w-80 md:h-96">
                <div className="absolute inset-0 border-2 border-nexus-gold translate-x-4 translate-y-4 rounded-sm"></div>
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
                  alt="Flynn Thomas" 
                  className="absolute inset-0 w-full h-full object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-nexus-navy relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-6">Start Your <span className="text-nexus-gold">Wealth Journey</span></h2>
            <p className="text-blue-200 mb-12">
              Ready to diversify your portfolio with institutional-grade crypto and fiat strategies? Schedule a consultation with our team today.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-nexus-gold shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">General Inquiries</h4>
                  <a href="mailto:NexusEdgeFinance@gmail.com" className="text-blue-300 hover:text-nexus-gold transition-colors">NexusEdgeFinance@gmail.com</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-nexus-gold shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Founder Direct</h4>
                  <a href="mailto:Flynnthomas907@gmail.com" className="text-blue-300 hover:text-nexus-gold transition-colors">Flynnthomas907@gmail.com</a>
                </div>
              </div>

              <div className="p-6 bg-nexus-gold/10 border border-nexus-gold/20 rounded-lg mt-8">
                <h4 className="text-nexus-gold font-bold mb-2 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" /> Strategy Call
                </h4>
                <p className="text-sm text-blue-200 mb-4">
                  Book a complimentary 15-minute strategy session to discuss your investment goals.
                </p>
                <button className="w-full py-3 bg-nexus-gold text-nexus-dark font-bold rounded-sm hover:bg-white transition-colors">
                  Schedule Now
                </button>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">First Name</label>
                  <input type="text" className="w-full bg-nexus-dark border border-white/10 rounded-sm p-3 text-white focus:border-nexus-gold outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-nexus-dark border border-white/10 rounded-sm p-3 text-white focus:border-nexus-gold outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                <input type="email" className="w-full bg-nexus-dark border border-white/10 rounded-sm p-3 text-white focus:border-nexus-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Investment Interest</label>
                <select className="w-full bg-nexus-dark border border-white/10 rounded-sm p-3 text-white focus:border-nexus-gold outline-none transition-colors">
                  <option>Crypto Portfolio Management</option>
                  <option>Fiat Asset Strategies</option>
                  <option>Wealth Structuring</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Message</label>
                <textarea rows={4} className="w-full bg-nexus-dark border border-white/10 rounded-sm p-3 text-white focus:border-nexus-gold outline-none transition-colors"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-white text-nexus-dark font-bold rounded-sm hover:bg-nexus-gold transition-colors uppercase tracking-widest text-sm">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-nexus-dark border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-nexus-gold rounded-md flex items-center justify-center text-nexus-dark font-bold">N</div>
              <span className="text-xl font-display font-bold text-white">Nexus<span className="text-nexus-gold">Edge</span></span>
            </a>
            <p className="text-blue-300 text-sm leading-relaxed">
              A global cryptocurrency and fiat investment company focused on secure, transparent, and high-growth investment opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-blue-300">
              <li><a href="#about" className="hover:text-nexus-gold transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-nexus-gold transition-colors">Investment Services</a></li>
              <li><a href="#testimonials" className="hover:text-nexus-gold transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-nexus-gold transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-blue-300">
              <li><a href="#" className="hover:text-nexus-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-nexus-gold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-nexus-gold transition-colors">Risk Disclosure</a></li>
              <li><a href="#" className="hover:text-nexus-gold transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-blue-300 text-sm mb-4">Subscribe for market insights and company updates.</p>
            <div className="flex">
              <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 px-4 py-2 rounded-l-sm text-sm text-white outline-none focus:border-nexus-gold w-full" />
              <button className="bg-nexus-gold text-nexus-dark px-4 py-2 rounded-r-sm font-bold hover:bg-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-400 text-xs">
            © 2026 NexusEdge Finance. All rights reserved.
          </p>
          <div className="flex gap-6">
            <p className="text-blue-400 text-xs max-w-xl text-center md:text-right">
              Investing in cryptocurrencies and financial markets involves risk. Past performance is not indicative of future results. Please read our Risk Disclosure before investing.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Landing() {
  return (
    <div className="bg-nexus-dark min-h-screen text-blue-50 font-sans selection:bg-nexus-gold selection:text-nexus-dark">
      <CryptoTicker />
      <Navbar />
      <Hero />
      <Partnerships />
      <About />
      <Services />
      <Testimonials />
      <Founder />
      <Contact />
      <Footer />
    </div>
  );
}
