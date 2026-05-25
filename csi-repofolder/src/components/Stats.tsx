import { motion } from 'framer-motion';

const stats = [
  { label: 'Events Conducted', value: '50+' },
  { label: 'Students Impacted', value: '2500+' },
  { label: 'Core Members', value: '40+' },
  { label: 'Years of Excellence', value: '5+' },
];

const Stats = () => {
  return (
    <section className="relative overflow-hidden bg-csi-accent/15 py-32 text-csi-pale">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #9400FF 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-4 text-4xl font-black tracking-tighter text-csi-pale sm:text-6xl md:text-7xl">
                {stat.value}
              </div>
              <div className="text-xs font-black uppercase tracking-[0.3em] text-csi-light">
                {stat.label}
              </div>
              <div className="mx-auto mt-6 h-1 w-12 bg-csi-accent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
