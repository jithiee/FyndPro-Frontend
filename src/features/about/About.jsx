import React from 'react';
import { 
  ShieldCheck, 
  Wrench,
  Hammer,
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- Hero: Service Focused --- */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-slate-300"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Established 2021</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-slate-900">
            Expert skills. <br />
            <span className="text-slate-400">Instant solutions.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed">
            We bridge the gap between "I need this fixed" and "It's done." connecting you with top-tier <span className="text-blue-600 font-semibold">electricians, plumbers, and pros</span> who take pride in their craft.
          </p>
        </div>
      </section>

      {/* --- Bento Grid Section --- */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[800px]">
          
          {/* Cell 1: Main Visual - Trade Focused */}
          <div className="md:col-span-2 md:row-span-2 relative rounded-[2rem] overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
              alt="Professional Electrician" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
            />
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl max-w-sm border border-white/50 shadow-xl">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Our Promise</p>
                <p className="text-lg font-medium text-slate-900">Verified skills, transparent pricing, and professionals who show up on time.</p>
              </div>
            </div>
          </div>

          {/* Cell 2: Stat - Vetting */}
          <div className="bg-slate-50 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between border border-slate-100 hover:border-blue-200 transition-colors duration-300 group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 group-hover:text-blue-600 transition-colors">
              <ShieldCheck size={24} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-5xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">100%</h3>
              <p className="text-slate-500 font-medium">Vetted Professionals.</p>
            </div>
          </div>

          {/* Cell 3: Categories */}
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between text-white group relative overflow-hidden">
             {/* Subtle Blue Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/30 blur-3xl rounded-full -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100"></div>
            
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <Wrench size={24} className="text-blue-400" />
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-4">8+ Trades</h3>
              <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                <span className="bg-slate-800 px-2 py-1 rounded">Electricians</span>
                <span className="bg-slate-800 px-2 py-1 rounded">Plumbers</span>
                <span className="bg-slate-800 px-2 py-1 rounded">Carpenters</span>
                <span className="bg-slate-800 px-2 py-1 rounded">Mechanics</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- Minimalist Values --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 md:gap-24">
            {[
              { title: "Skill Verification", desc: "We don't just onboard anyone. Every electrician, mechanic, and tutor passes a rigorous skills assessment." },
              { title: "Safety First", desc: "Background checks and identity verification are standard. inviting someone into your home requires trust." },
              { title: "Fair Economy", desc: "Clients get fair prices, professionals get fair wages. We empower the gig economy with dignity." }
            ].map((item, i) => (
              <div key={i}>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600 text-sm">0{i+1}.</span> {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- The Split Layout: Image & Manifesto --- */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <div className="relative">
             {/* Stylized Image Grid */}
             <div className="grid grid-cols-2 gap-4">
               <img src="https://cbx-prod.b-cdn.net/COLOURBOX13756456.jpg?width=800&height=800&quality=70" className="rounded-2xl w-full h-64 object-cover mt-12" alt="Mechanic" />
               <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="rounded-2xl w-full h-64 object-cover" alt="Plumber" />
               <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="rounded-2xl w-full h-64 object-cover" alt="Trainer" />
               <div className="bg-blue-600 rounded-2xl w-full h-64 flex items-center justify-center text-white p-6 mt-[-3rem]">
                 <Hammer size={48} strokeWidth={1.5} />
               </div>
             </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              We build for the <br/>
              <span className="decoration-blue-200 decoration-4 underline underline-offset-4">skilled.</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-600">
              <p>
                Finding a reliable plumber shouldn't feel like a gamble. And finding good clients shouldn't involve chasing payments. 
              </p>
              <p>
                We created a platform where <strong>Cleaners, Drivers, Mechanics, and Tutors</strong> can build their reputation based on merit, not marketing budget.
              </p>
              <p>
                Whether you need a fitness trainer for 6 AM or a carpenter to fix that shelf—we are the infrastructure for reliable local services.
              </p>
            </div>
            
            <div className="mt-12 border-l-2 border-slate-200 pl-6">
              <p className="text-xl font-medium text-slate-900 italic">
                "Quality means doing it right when no one is looking."
              </p>
              <p className="mt-2 text-slate-500 text-sm font-bold uppercase tracking-wider">— Henry Ford</p>
            </div>
          </div>

        </div>
      </section>

      {/* --- Leadership Section --- */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-slate-200 pb-6">
          <h2 className="text-3xl font-bold text-slate-900">Leadership</h2>
          <a href="#" className="text-sm font-bold text-blue-600 hover:text-slate-900 transition-colors flex items-center gap-1">
     
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {[
            { name: "Alex Morgan", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { name: "Sarah Li", role: "Head of Operations", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { name: "Marcus Reid", role: "Product Design", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { name: "Priya Patel", role: "Community Lead", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
          ].map((member, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full aspect-[3/4] object-cover transition-all duration-500 group-hover:scale-110 group-hover:saturate-0" 
                />
              </div>
              <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
              <p className="text-slate-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Area / Final CTA --- */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Need a Pro? Book now.</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg">
            From leaking taps to fitness goals, find the right expert in seconds.
          </p>
   
          
          <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
      
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;
