export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        {/* glow background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green opacity-5 rounded-full blur-3xl pointer-events-none" />

        <span className="mb-6 inline-block px-4 py-1.5 rounded-full border border-[#4ade8033] bg-[#4ade8011] text-brand-green text-sm font-medium tracking-wide">
          No. 1 Fitness Platform
        </span>

        <h1 className="font-display font-800 text-6xl md:text-8xl text-white leading-none tracking-tight mb-6">
          TRANSFORM<br />
          YOUR <span className="text-brand-green">BODY.</span>
        </h1>

        <p className="text-white/50 text-lg max-w-xl mb-10 leading-relaxed">
          Personalized workout plans, expert coaching, and a community that pushes you further than you thought possible.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <a href="/pricing" className="px-8 py-4 bg-brand-green text-[#090c10] font-display font-700 text-lg rounded-xl hover:bg-brand-green-dim transition-all">
            Start for Free
          </a>
          <a href="/workouts" className="px-8 py-4 border border-white/20 text-white font-display font-700 text-lg rounded-xl hover:bg-white/5 transition-all">
            Explore Workouts
          </a>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/[0.08] bg-[#161b22]">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-white/[0.08]">
          {[
            { num: '50K+', label: 'Active Members' },
            { num: '200+', label: 'Workout Plans' },
            { num: '4.9★', label: 'App Rating' },
          ].map(({ num, label }) => (
            <div key={label} className="py-10 text-center">
              <div className="font-display font-700 text-4xl text-brand-green mb-1">{num}</div>
              <div className="text-white/40 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-brand-green text-sm font-medium tracking-widest uppercase">Why FitZone</span>
          <h2 className="font-display font-700 text-5xl text-white mt-3">Everything you need<br/>to get fit</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'AI Workout Plans', desc: 'Custom plans built around your body, goals, and schedule. Generated in seconds.' },
            { icon: '📈', title: 'Progress Tracking', desc: 'Visual charts, streaks, and heatmaps to keep your momentum going every week.' },
            { icon: '💳', title: 'Flexible Membership', desc: 'Three tiers to fit any budget. Upgrade, downgrade, or cancel anytime via Stripe.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8 hover:border-brand-green/30 transition-all">
              <div className="text-4xl mb-5">{icon}</div>
              <h3 className="font-display font-600 text-2xl text-white mb-3">{title}</h3>
              <p className="text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}