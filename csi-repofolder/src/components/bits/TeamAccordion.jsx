import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './TeamAccordion.css';

const TeamItem = ({ member, isExpanded, onExpand, isDragging }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current || isExpanded || isDragging) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    if (!isDragging) {
      onExpand();
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`team-item ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => !isDragging && onExpand()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX: isExpanded ? 0 : rotateX,
        rotateY: isExpanded ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      layout
      transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 1 }}
    >
      <div className="team-item-content" style={{ transform: "translateZ(50px)" }}>
        <div className="image-container">
          <img src={member.image} alt={member.name} className="member-image" draggable={false} />
          <div className="image-overlay" />
          
          {!isExpanded && (
             <motion.div 
               className="collapsed-info"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.1 }}
             >
               <span className="vertical-name">{member.name.split(' ').pop()}</span>
             </motion.div>
          )}
          
          <div className="pc-glow" />
        </div>
        
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div 
              className="member-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="details-inner">
                <motion.p 
                  className="member-quote"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {member.quote || 'Leading the way with innovation and excellence.'}
                </motion.p>
                
                <motion.div 
                  className="member-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="info-line" />
                  <h3 className="member-name">— {member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const TeamAccordion = ({ members }) => {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && scrollRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const scrollWidth = scrollRef.current.scrollWidth;
        setConstraints({ left: -(scrollWidth - containerWidth), right: 0 });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [members, expandedIndex]);

  return (
    <div className="team-accordion-wrapper" ref={containerRef}>
      <motion.div 
        ref={scrollRef}
        className="team-accordion"
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.2}
        dragMomentum={true}
        dragTransition={{ power: 0.5, timeConstant: 100 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setTimeout(() => setIsDragging(false), 50);
        }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {members.map((member, index) => (
          <TeamItem 
            key={index} 
            member={member} 
            isExpanded={expandedIndex === index} 
            onExpand={() => !isDragging && setExpandedIndex(index)}
            isDragging={isDragging}
          />
        ))}
      </motion.div>
      
      <div className="drag-hint">
        <span>DRAG TO EXPLORE</span>
        <div className="hint-line" />
      </div>
    </div>
  );
};

export default TeamAccordion;
