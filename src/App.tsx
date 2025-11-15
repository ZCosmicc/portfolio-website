
import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Phone, Send, } from 'lucide-react';
import emailjs from '@emailjs/browser';

// TYPES - TypeScript interfaces untuk type safety
interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image: string;
  github?: string;
  demo?: string;
}

interface Skill {
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

function App() {
  // STATE
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gradientPosition, setGradientPosition] = useState(0);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLSpanElement>(null);
  const lastMouseMoveTime = useRef<number>(Date.now());
  const clickIdCounter = useRef(0);
  const toastIdCounter = useRef(0);

  // TOAST HELPER - Add toast notification
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = toastIdCounter.current++;
    const toast: Toast = { id, type, message };
    setToasts(prev => [...prev, toast]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // CV DOWNLOAD HANDLER
  const handleDownloadCV = () => {
    // Create a simple placeholder PDF download
    // In production, replace with your actual CV PDF file
    const cvUrl = '/cv.pdf'; // Place your CV.pdf in the public folder
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Fariz_Fadillah_CV.pdf';
    link.click();
    addToast('✅ CV downloaded successfully!', 'success');
    setIsMenuOpen(false);
  };

  // EMAILJS INITIALIZATION - Initialize EmailJS service
  useEffect(() => {
    emailjs.init('JVf-CrGRWuLwqu9pk');
  }, []);

  // MOUSE TRACKING - track mouse movement untuk gradient effect (throttled & optimized)
  useEffect(() => {
    let rafId: number;
    let lastUpdate = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Throttle to 60fps (16ms)
      if (now - lastUpdate < 16) return;
      
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          });
          lastMouseMoveTime.current = Date.now();
          lastUpdate = now;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // GRADIENT ANIMATION - animasi gradient saat mouse idle (optimized with RAF)
  useEffect(() => {
    let rafId: number;
    let lastTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const timeSinceLastMove = now - lastMouseMoveTime.current;
      
      // Only animate if mouse idle > 100ms
      if (timeSinceLastMove > 100) {
        // Update every ~32ms (30fps for gradient is enough)
        if (now - lastTime > 32) {
          setGradientPosition(prev => (prev + 1) % 360);
          lastTime = now;
        }
      }
      
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(rafId);
  }, []);

  // SMOOTH SCROLL HANDLER
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // CLICK EFFECT HANDLER - Retro gaming pixel effect (optimized with limit)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Limit max concurrent effects to prevent performance issues
    if (clickEffects.length >= 3) return;
    
    const newEffect: ClickEffect = {
      id: clickIdCounter.current++,
      x: e.clientX,
      y: e.clientY
    };
    
    setClickEffects(prev => [...prev, newEffect]);
    
    // Remove effect setelah animasi selesai (1.5 detik)
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1500);
  };

  // WAVE ANIMATION HANDLER - Trigger wave on hover or click
  const handleWaveClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    const span = e.currentTarget;
    span.classList.remove('animate-wave');
    // Trigger reflow to restart animation
    void span.offsetWidth;
    span.classList.add('animate-wave');
  };

  // DATA - Skills/Tools untuk running marquee dengan icon
  const skills: Skill[] = [
  { name: 'React', icon: <i className="si si-react text-3xl"></i>, color: '#61DAFB' },
  { name: 'TypeScript', icon: <i className="si si-typescript text-3xl"></i>, color: '#3178C6' },
  { name: 'JavaScript', icon: <i className="si si-javascript text-3xl"></i>, color: '#F7DF1E' },
  { name: 'Node.js', icon: <i className="si si-nodedotjs text-3xl"></i>, color: '#339933' },
  { name: 'Python', icon: <i className="si si-python text-3xl"></i>, color: '#3776AB' },
  { name: 'HTML5', icon: <i className="si si-html5 text-3xl"></i>, color: '#E34F26' },
  { name: 'CSS3', icon: <i className="devicon-css3-plain text-3xl"></i>, color: '#1572B6' },
  { name: 'Tailwind', icon: <i className="si si-tailwindcss text-3xl"></i>, color: '#06B6D4' },
  { name: 'Git', icon: <i className="si si-git text-3xl"></i>, color: '#F05032' },
  { name: 'GitHub', icon: <i className="si si-github text-3xl"></i>, color: '#FFFFFF' },
  { name: 'MongoDB', icon: <i className="si si-mongodb text-3xl"></i>, color: '#47A248' },
  { name: 'PostgreSQL', icon: <i className="si si-postgresql text-3xl"></i>, color: '#4169E1' },
  { name: 'Next.js', icon: <i className="si si-nextdotjs text-3xl"></i>, color: '#FFFFFF' },
  { name: 'Docker', icon: <i className="si si-docker text-3xl"></i>, color: '#2496ED' },
  { name: 'Vercel', icon: <i className="si si-vercel text-3xl"></i>, color: '#FFFFFF' },
  { name: 'Netlify', icon: <i className="si si-netlify text-3xl"></i>, color: '#00C7B7' },
  { name: 'Figma', icon: <i className="si si-figma text-3xl"></i>, color: '#F24E1E' },
  { name: 'Notion', icon: <i className="si si-notion text-3xl"></i>, color: '#FFFFFF' },
  ];

  // DATA - Projects
  const projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce dengan payment gateway integration",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Task Management System",
      description: "Real-time collaboration tool untuk team productivity",
      tech: ["TypeScript", "React", "Firebase", "Tailwind"],
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Weather Analytics Dashboard",
      description: "Data visualization dengan real-time weather API",
      tech: ["React", "D3.js", "REST API", "Chart.js"],
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Social Media App",
      description: "Platform social networking dengan chat feature",
      tech: ["React Native", "Socket.io", "Express", "MongoDB"],
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop"
    }
  ];

  // PROJECT CARDS ANIMATION - Intersection Observer with staggered badge pop-up
  useEffect(() => {
    const cards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            const index = Array.from(cards).indexOf(card);
            
            // Card entrance animation
            setTimeout(() => {
              card.classList.add('card-visible');
            }, index * 100);
            
            // Tech badge pop-up animations (staggered)
            const badges = card.querySelectorAll('.tech-badge');
            badges.forEach((badge, badgeIdx) => {
              setTimeout(() => {
                badge.classList.add('badge-pop');
              }, index * 100 + badgeIdx * 80);
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cards.forEach(card => observer.observe(card));
    return () => {
      cards.forEach(card => observer.unobserve(card));
      observer.disconnect();
    };
  }, [projects]);

  // FORM HANDLER
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field as user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = async () => {
    const errors: { name?: string; email?: string; message?: string } = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    // If there are errors, set them and return
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_olxwm1w',
        'template_412bsoh',
        {
          to_email: 'farizfadillah612@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email
        }
      );

      // Success message
      addToast(`✅ Message sent! Thank you ${formData.name}, I'll get back to you soon.`, 'success');
      setFormData({ name: '', email: '', message: '' });
      setFormErrors({});
    } catch (error) {
      console.error('EmailJS error:', error);
      addToast('❌ Failed to send message. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="bg-black text-white overflow-hidden scroll-smooth relative"
      onClick={handleClick}
      style={{ cursor: 'crosshair' }}
    >
      
      {/* PIXEL LAYER - Behind all content */}
      <div className="fixed inset-0 pointer-events-none z-0"></div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* FLOATING HAMBURGER MENU - Fixed on right side */}
      <div className="fixed top-8 right-8 z-50">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-14 h-14 flex flex-col justify-center items-center gap-1.5 backdrop-blur-md bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 group"
        >
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-20 right-0 w-56 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3 animate-slide-in shadow-2xl">
            {/* CV Download Button */}
            <button
              onClick={handleDownloadCV}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19v-7m0 0V5m0 7l-4-4m4 4l4-4" />
              </svg>
              Download CV
            </button>

            {/* Certificates Button */}
            <button
              onClick={() => {
                scrollToSection('contact');
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Certificates
            </button>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Quick Links */}
            <button
              onClick={() => {
                scrollToSection('projects');
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 font-semibold text-sm transition-all duration-300"
            >
              Projects
            </button>

            <button
              onClick={() => {
                scrollToSection('contact');
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 font-semibold text-sm transition-all duration-300"
            >
              Contact
            </button>
          </div>
        )}
      </div>

      {/* PIXEL LAYER - Behind all content */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {clickEffects.map(effect => (
          <div
            key={effect.id}
            className="absolute"
            style={{
              left: effect.x,
              top: effect.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Grid pattern - scattered around click point */}
            {[
              { x: 0, y: 0, delay: 0, distance: 0 },
              { x: -1, y: 0, delay: 0.05, distance: 1 },
              { x: 1, y: 0, delay: 0.05, distance: 1 },
              { x: 0, y: -1, delay: 0.05, distance: 1 },
              { x: 0, y: 1, delay: 0.05, distance: 1 },
              
              { x: -2, y: 0, delay: 0.1, distance: 2 },
              { x: 2, y: 0, delay: 0.1, distance: 2 },
              { x: 0, y: -2, delay: 0.1, distance: 2 },
              { x: 0, y: 2, delay: 0.1, distance: 2 },
              { x: -1, y: -1, delay: 0.1, distance: 1.4 },
              { x: 1, y: -1, delay: 0.1, distance: 1.4 },
              { x: -1, y: 1, delay: 0.1, distance: 1.4 },
              { x: 1, y: 1, delay: 0.1, distance: 1.4 },
              
              { x: -3, y: 0, delay: 0.15, distance: 3 },
              { x: 3, y: 0, delay: 0.15, distance: 3 },
              { x: 0, y: -3, delay: 0.15, distance: 3 },
              { x: 0, y: 3, delay: 0.15, distance: 3 },
              { x: -2, y: -1, delay: 0.15, distance: 2.2 },
              { x: 2, y: -1, delay: 0.15, distance: 2.2 },
              { x: -2, y: 1, delay: 0.15, distance: 2.2 },
              { x: 2, y: 1, delay: 0.15, distance: 2.2 },
              { x: -1, y: -2, delay: 0.15, distance: 2.2 },
              { x: 1, y: -2, delay: 0.15, distance: 2.2 },
              { x: -1, y: 2, delay: 0.15, distance: 2.2 },
              { x: 1, y: 2, delay: 0.15, distance: 2.2 },
            ].map((pos, i) => {
              const maxOpacity = Math.max(0.3, 1 - (pos.distance * 0.2));
              
              return (
                <div
                  key={i}
                  className="pixel-tile"
                  style={{
                    '--tx': `${pos.x * 24}px`,
                    '--ty': `${pos.y * 24}px`,
                    '--delay': `${pos.delay}s`,
                    '--max-opacity': maxOpacity,
                    '--hue': `${240 + Math.random() * 50}`,
                    left: `${pos.x * 24}px`,
                    top: `${pos.y * 24}px`,
                  } as React.CSSProperties}
                />
              );
            })}
            
            <div className="pixel-center-glow" />
          </div>
        ))}
      </div>
      
      {/* HERO SECTION */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden z-10"
      >
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent)`
          }}
        />
        
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h1 className="text-7xl md:text-9xl font-bold mb-6 tracking-tight">
            Hi There{' '}
            <span 
              ref={waveRef}
              onClick={handleWaveClick}
              onMouseEnter={(e) => {
                e.currentTarget.classList.remove('animate-wave');
                void e.currentTarget.offsetWidth;
                e.currentTarget.classList.add('animate-wave');
              }}
              className="inline-block cursor-pointer origin-bottom"
              style={{ display: 'inline-block' }}
            >
              👋
            </span>
            {' '}I'm<br/>
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(${gradientPosition}deg, 
                  hsl(${240 + (mousePosition.x / 20)}, 80%, 70%), 
                  hsl(${280 + (mousePosition.y / 20)}, 85%, 65%), 
                  hsl(${(gradientPosition + 260) % 360}, 90%, 75%))`,
                backgroundSize: '200% 200%',
                transition: 'background-image 0.3s ease'
              }}
            >
              FARIZ FADILLAH
            </span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-400 mb-4">Web Developer</p>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Building digital experiences that matter. Specialized in design and modern web technologies.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
            >
              View Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border border-white hover:bg-white hover:text-black transition-colors"
            >
              Get in Touch
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* MARQUEE SECTION */}
      <section className="py-20 border-y border-gray-800 relative z-10">
        <div className="overflow-hidden mb-12">
          <div className="flex animate-marquee-smooth">
            {[...skills, ...skills, ...skills].map((skill, idx) => (
              <div 
                key={`l2r-${idx}`}
                className="flex-shrink-0 mx-8 group cursor-pointer"
              >
                <div className="flex items-center gap-3 px-6 py-3 border-2 border-gray-700 bg-black/50 hover:border-white transition-all duration-300">
                  <div 
                    className="transition-all duration-300 grayscale group-hover:grayscale-0"
                    style={{ color: skill.color }}
                  >
                    {skill.icon}
                  </div>
                  <span className="text-gray-400 group-hover:text-white font-mono font-semibold text-lg whitespace-nowrap transition-colors">
                    {skill.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex animate-marquee-smooth-reverse">
            {[...skills.slice(-Math.floor(skills.length / 3)), ...skills, ...skills].map((skill, idx) => (
              <div 
                key={`r2l-${idx}`}
                className="flex-shrink-0 mx-8 group cursor-pointer"
              >
                <div className="flex items-center gap-3 px-6 py-3 border-2 border-gray-700 bg-black/50 hover:border-white transition-all duration-300">
                  <div 
                    className="transition-all duration-300 grayscale group-hover:grayscale-0"
                    style={{ color: skill.color }}
                  >
                    {skill.icon}
                  </div>
                  <span className="text-gray-400 group-hover:text-white font-mono font-semibold text-lg whitespace-nowrap transition-colors">
                    {skill.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION - Modern grid with smooth animations */}
      <section id="projects" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">Selected Work</h2>
            <p className="text-gray-500 text-xl">Projects I'm proud of</p>
          </div>

          {/* PROJECTS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="project-card group relative overflow-hidden border border-gray-700 transition-all duration-500 bg-black/40 backdrop-blur"
              >
                {/* Image Container with Hover Eye Icon */}
                <div className="relative overflow-hidden h-64 md:h-56">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-image w-full h-full object-cover group-hover:blur-sm transition-all duration-500"
                  />
                  
                  {/* Hover overlay with eye icon */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Project link placeholder for ${project.title}`);
                      }}
                      className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white hover:bg-white hover:text-black transition-all duration-300 transform group-hover:scale-100 scale-90"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Content - visible always */}
                <div className="p-6 space-y-4">
                  <div className="inline-block px-3 py-1 border border-gray-600 text-gray-400 text-xs uppercase tracking-wider">
                    Project {String(idx + 1).padStart(2, '0')}
                  </div>

                  <h3 className="text-2xl font-bold line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack with Pop-up Animation */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="tech-badge px-3 py-1 text-xs font-mono bg-gray-900/80 border border-gray-700 text-gray-300 rounded hover:border-white hover:text-white transition-all duration-300 opacity-0"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIAGONAL ANIMATED SPLITTER */}
      <div className="relative h-28 overflow-hidden z-10">
        {/* Strip 1 - Top */}
        <div className="absolute top-8 left-0 right-0 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transform -skew-y-2 animate-gradient-shift">
          <div className="flex items-center justify-center h-full animate-marquee-fast whitespace-nowrap">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="text-white font-bold text-base mx-6 uppercase tracking-widest">
                ✦ Reliable ✦ Engaging ✦ Efficient ✦ Responsive ✦
              </span>
            ))}
          </div>
        </div>

        {/* Strip 2 - Bottom */}
        <div className="absolute bottom-6 left-0 right-0 h-12 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 transform skew-y-1 animate-gradient-shift-reverse">
          <div className="flex items-center justify-center h-full animate-marquee-fast-reverse whitespace-nowrap">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="text-white font-bold text-base mx-6 uppercase tracking-widest">
                ✦ Let's Work Together ✦ Let's Make it Work ✦
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-16">Let's Connect ✦</h2>
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-8">Get in touch</h3>
                <p className="text-gray-400 text-lg mb-12">
                  Interested in working together? Feel free to reach out for collaborations or just a friendly chat.
                </p>
              </div>

              <div className="space-y-6">
                <a 
                  href="mailto:farizfadillah612@gmail.com"
                  className="flex items-center gap-4 text-xl hover:text-gray-400 transition-colors group"
                >
                  <div className="w-12 h-12 border border-white group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <span>farizfadillah612@gmail.com</span>
                </a>

                <a 
                  href="https://wa.me/087873139405"
                  className="flex items-center gap-4 text-xl hover:text-gray-400 transition-colors group"
                >
                  <div className="w-12 h-12 border border-white group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <span>+62 878-7313-9405</span>
                </a>

                <a 
                  href="https://linkedin.com/in/farizfadillah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-xl hover:text-gray-400 transition-colors group"
                >
                  <div className="w-12 h-12 border border-white group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center">
                    <Linkedin size={20} />
                  </div>
                  <span>linkedin.com/in/farizfadillah</span>
                </a>

                <a 
                  href="https://github.com/ZCosmicc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-xl hover:text-gray-400 transition-colors group"
                >
                  <div className="w-12 h-12 border border-white group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center">
                    <Github size={20} />
                  </div>
                  <span>github.com/ZCosmicc</span>
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm mb-2 text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-transparent border px-4 py-3 focus:outline-none transition-colors ${
                    formErrors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-700 focus:border-white'
                  }`}
                  placeholder="Your name"
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-transparent border px-4 py-3 focus:outline-none transition-colors ${
                    formErrors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-700 focus:border-white'
                  }`}
                  placeholder="your.email@example.com"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm mb-2 text-gray-400 flex justify-between">
                  <span>Message</span>
                  <span className="text-xs">{formData.message.length}/1000</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  maxLength={1000}
                  className={`w-full bg-transparent border px-4 py-3 focus:outline-none transition-colors resize-none ${
                    formErrors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-700 focus:border-white'
                  }`}
                  placeholder="What would you like to discuss?"
                />
                {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-white text-black py-4 font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GRADIENT ANIMATED FOOTER LINE */}
      <div className="gradient-footer-border" />

      {/* FOOTER */}
      <footer className="py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500">© 2025 Fariz Fadillah. All rights reserved.</p>
          <p className="text-gray-500">Thanks for visiting my site.</p>
        </div>
      </footer>

      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-lg text-white font-semibold text-sm md:text-base pointer-events-auto backdrop-blur-md border animate-slide-in transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-green-500/20 border-green-500/50'
                : toast.type === 'error'
                ? 'bg-red-500/20 border-red-500/50'
                : 'bg-blue-500/20 border-blue-500/50'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}



export default App;