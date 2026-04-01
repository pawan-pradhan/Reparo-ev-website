// src/pages/SocialMedia.jsx
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const SocialMedia = () => {
  useEffect(() => {
    // Intersection Observer for fade animations
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('vis');
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.fi').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      
      {/* Flash Bar */}
      <div className="flash-bar" style={{ height: '4px', background: 'linear-gradient(90deg, #0b86d0, #00c853, #0b86d0)', backgroundSize: '200%', animation: 'flow 2s linear infinite' }}></div>

      {/* Profile Zone */}
      <section className="profile-zone py-5" style={{ background: 'linear-gradient(135deg, #0b86d0, #00c853)', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Avatar */}
            <div className="col-md-3 text-center">
              <div className="position-relative d-inline-block">
                <div className="rounded-circle p-1" style={{ background: 'conic-gradient(#0b86d0, #00c853, #0b86d0)' }}>
                  <img 
                    src="https://via.placeholder.com/150x150/0b86d0/ffffff?text=REPARO"
                    alt="Reparo EV"
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid white' }}
                  />
                </div>
                <span className="position-absolute bottom-0 start-50 translate-middle-x bg-success text-white px-2 py-1 rounded-pill small fw-bold">⚡ ACTIVE</span>
              </div>
            </div>
            
            {/* Stats & Actions */}
            <div className="col-md-9">
              <div className="row text-center text-md-start mb-3">
                <div className="col-4">
                  <h2 className="fw-bold mb-0">142</h2>
                  <small>Posts</small>
                </div>
                <div className="col-4">
                  <h2 className="fw-bold mb-0">12.4K</h2>
                  <small>Followers</small>
                </div>
                <div className="col-4">
                  <h2 className="fw-bold mb-0">386</h2>
                  <small>Following</small>
                </div>
              </div>
              <div className="d-flex gap-3">
                <button className="btn btn-light fw-bold px-4">Follow</button>
                <button className="btn btn-outline-light px-4">Message</button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            <h4 className="fw-bold mb-1">@reparo_ev</h4>
            <p className="small text-white-50 mb-2">⚡ EV Repair Specialists · India</p>
            <p className="mb-2">
              🔧 India's <strong>#1 Multi-Brand EV Repair Network</strong><br />
              ⚡ Expert service for <strong>2W &amp; 3W Electric Vehicles</strong><br />
              📍 <strong>PAN India</strong> — Doorstep repair in 50+ cities<br />
              💰 Reliable · Certified · Affordable
            </p>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {['🔋 2W EV Repair', '🛺 3W EV Repair', '🌍 PAN India', '🏠 Doorstep Service', '🏆 Certified Techs', '💰 Affordable', '⭐ 4.8 Rated'].map((tag) => (
                <span key={tag} className="badge bg-light text-dark px-3 py-2">{tag}</span>
              ))}
            </div>
            <div className="d-flex gap-4">
              <div><i className="bi bi-globe me-2"></i> <a href="https://partner.reparo24.com" className="text-white">partner.reparo24.com</a></div>
              <div><i className="bi bi-envelope me-2"></i> <a href="mailto:manager@reparo.care" className="text-white">manager@reparo.care</a></div>
              <div><i className="bi bi-telephone me-2"></i> <a href="tel:8019160606" className="text-white">80191 60606</a></div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="py-5 text-center fi" style={{ background: 'linear-gradient(135deg, #0b86d0, #00c853)', color: 'white' }}>
        <div className="container">
          <p className="small text-uppercase fw-bold mb-2">India's First Multi-Brand EV Repair Network</p>
          <h1 className="display-2 fw-bold mb-3">EV Repair.<br /><span style={{ color: '#fff' }}>Done Right.</span></h1>
          <p className="lead mb-4">Expert technicians for <strong>2W &amp; 3W electric vehicles</strong> — reliable, affordable, and available at your doorstep <strong>across PAN India.</strong></p>
          <div className="d-flex gap-3 justify-content-center">
            <a href="https://partner.reparo24.com" className="btn btn-light btn-lg px-4 fw-bold">Book a Service</a>
            <a href="tel:8019160606" className="btn btn-outline-light btn-lg px-4">📲 80191 60606</a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5 fi">
        <div className="container">
          <p className="text-center text-success fw-bold small mb-2">What We Offer</p>
          <h2 className="text-center fw-bold mb-5">Why Choose <span className="text-success">Reparo?</span></h2>
          <div className="row g-4">
            {[
              { icon: '🔋', title: '2W & 3W EV Repair Experts', desc: 'We specialise exclusively in electric two-wheelers and three-wheelers — Ola, Ather, TVS, Hero, Bajaj and every local brand.' },
              { icon: '🏆', title: 'Certified Expert Technicians', desc: 'Every technician is trained, tested and certified. No guesswork — only expert diagnostics and precision EV repair.' },
              { icon: '🏠', title: 'Doorstep Service', desc: 'Book online and our technician comes to your location. No towing, no waiting, no hassle.' },
              { icon: '💰', title: 'Affordable & Transparent', desc: 'Full cost breakdown shown before we begin. Zero hidden charges. Quality EV repair that fits every budget.' },
              { icon: '⏱️', title: 'Same-Day Repairs', desc: 'Most EV faults diagnosed and fixed on the same day. We get you back on the road fast.' },
              { icon: '🛡️', title: '30-Day Warranty', desc: 'Every repair is backed by a 30-day service warranty. Your satisfaction and your EV\'s health are our guarantee.' }
            ].map((service, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="card h-100 text-center p-4 border-0 shadow-sm fi d1">
                  <div className="fs-1 mb-3">{service.icon}</div>
                  <h5 className="fw-bold">{service.title}</h5>
                  <p className="text-muted mb-0">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Belt */}
      <div className="py-5 fi" style={{ background: 'linear-gradient(135deg, #0b86d0, #00c853)', color: 'white' }}>
        <div className="container">
          <div className="row text-center">
            {[
              { number: '500+', label: 'Certified Engineers' },
              { number: '50+', label: 'Cities Covered' },
              { number: '1000+', label: 'EVs Repaired' },
              { number: '4.8★', label: 'Average Rating' }
            ].map((stat, idx) => (
              <div className="col-6 col-md-3" key={idx}>
                <h2 className="display-4 fw-bold mb-0">{stat.number}</h2>
                <p className="mb-0">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <section className="py-5 fi" style={{ background: '#f8f9fa' }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="fs-1 mb-3">★★★★★</div>
              <h1 className="display-1 text-success mb-3">"</h1>
              <p className="lead fst-italic mb-4">"Reparo fixed my Ola S1 Pro in just 2 hours at my doorstep. Certified technician, transparent pricing, and absolutely reliable. This is what EV service should look like!"</p>
              <p className="fw-bold text-success mb-0">— Rajesh K., Hyderabad · Ola S1 Pro Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5 fi" style={{ background: 'linear-gradient(135deg, #0b86d0, #00c853)', color: 'white' }}>
        <div className="container text-center">
          <p className="small text-uppercase fw-bold mb-2">Get In Touch</p>
          <h2 className="display-5 fw-bold mb-3">Your EV Deserves<br /><span>The Best Care.</span></h2>
          <p className="lead mb-4">Book a service, join our partner network, or just say hello — we're always here for you.</p>
          <div className="d-flex gap-3 justify-content-center mb-5">
            <a href="https://partner.reparo24.com" className="btn btn-light btn-lg px-4 fw-bold">Book a Service Now</a>
            <a href="mailto:manager@reparo.care" className="btn btn-outline-light btn-lg px-4">✉️ Email Us</a>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-3">
                <div className="fs-1 mb-2">📲</div>
                <p className="small fw-bold mb-1">WhatsApp / Call</p>
                <a href="tel:8019160606" className="text-white text-decoration-none fs-5 fw-bold">80191 60606</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-3">
                <div className="fs-1 mb-2">✉️</div>
                <p className="small fw-bold mb-1">Email</p>
                <a href="mailto:manager@reparo.care" className="text-white text-decoration-none">manager@reparo.care</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-3">
                <div className="fs-1 mb-2">🌐</div>
                <p className="small fw-bold mb-1">Partner Portal</p>
                <a href="https://partner.reparo24.com" target="_blank" className="text-white text-decoration-none">partner.reparo24.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}

      <style>{`
        @keyframes flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .fi {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }
        .fi.vis {
          opacity: 1;
          transform: translateY(0);
        }
        .fi.d1 { transition-delay: 0.1s; }
        .fi.d2 { transition-delay: 0.2s; }
        .fi.d3 { transition-delay: 0.3s; }
      `}</style>
    </>
  );
};

export default SocialMedia;







// import React from 'react';
// import { useEffect } from 'react';
// import socialHTML from './social.html?raw';

// const SocialHTML = () => {
//   useEffect(() => {
//   // Add vis class to all fi elements after a short delay
//   setTimeout(() => {
//     document.querySelectorAll('.fi').forEach(el => {
//       el.classList.add('vis');
//     });
//   }, 100);
// }, []);
//   return (
//     <div dangerouslySetInnerHTML={{ __html: socialHTML }} />
//   );
// };

// export default SocialHTML;