// src/pages/Partners.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const Partners = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Partner Hero Section */}
      <section className="py-16 bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Become a Reparo Partner ⚡
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Join India's Fast Growing EV Service Network
          </p>
          {/* <button className="bg-white text-[#0b86d0] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Start Registration
          </button> */}
          <button
            onClick={() => window.open("http://forms.gle/2RVerPAQwj2ehBYQ9", "_blank")}
            className="bg-white text-[#0b86d0] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Start Registration
          </button>
        </div>
      </section>

      {/* Why Partner With Reparo Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Partner With Reparo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">💰</div>
              <h5 className="text-xl font-semibold mb-2">High Earnings</h5>
              <p className="text-gray-600">Earn per booking with transparent commission model.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">📍</div>
              <h5 className="text-xl font-semibold mb-2">More Customers</h5>
              <p className="text-gray-600">Get verified leads directly from your service area.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h5 className="text-xl font-semibold mb-2">Dashboard Control</h5>
              <p className="text-gray-600">Manage bookings, pricing & reports in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Onboarding Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Partner Onboarding Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white flex items-center justify-center font-bold mb-3">1</div>
              <h5 className="text-lg font-semibold mb-2">Register</h5>
              <p className="text-gray-600">Sign up using mobile number & business details.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white flex items-center justify-center font-bold mb-3">2</div>
              <h5 className="text-lg font-semibold mb-2">Submit Documents</h5>
              <p className="text-gray-600">Upload ID proof, workshop photos & bank details.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white flex items-center justify-center font-bold mb-3">3</div>
              <h5 className="text-lg font-semibold mb-2">Verification</h5>
              <p className="text-gray-600">Our team verifies your credentials & service capability.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white flex items-center justify-center font-bold mb-3">4</div>
              <h5 className="text-lg font-semibold mb-2">Service Setup</h5>
              <p className="text-gray-600">Select services, pricing & service coverage area.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white flex items-center justify-center font-bold mb-3">5</div>
              <h5 className="text-lg font-semibold mb-2">Training</h5>
              <p className="text-gray-600">Basic platform usage & quality guidelines training.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white flex items-center justify-center font-bold mb-3">6</div>
              <h5 className="text-lg font-semibold mb-2">Go Live</h5>
              <p className="text-gray-600">Start receiving bookings from customers instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Required Documents
          </h2>
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-xl p-8">
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-700">
                <span className="text-green-500 text-xl">✓</span> Aadhaar / ID Proof
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="text-green-500 text-xl">✓</span> EV Certification (if available)
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="text-green-500 text-xl">✓</span> Workshop Photos
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="text-green-500 text-xl">✓</span> Bank Account Details
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="text-green-500 text-xl">✓</span> GST (if applicable)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How You Earn Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How You Earn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">💰</div>
              <p className="font-medium">Per Booking Commission</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">📋</div>
              <p className="font-medium">AMC Subscription Revenue</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">🔧</div>
              <p className="font-medium">Spare Parts Margin</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">🚨</div>
              <p className="font-medium">Emergency Support Charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#0b86d0] to-[#00c853]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow with Reparo? ⚡
          </h2>
          <button className="bg-white text-[#0b86d0] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Become a Partner Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default Partners



// import React, { useEffect } from 'react';

// const PartnersHTML = () => {
//   useEffect(() => {
//     // Load Bootstrap CSS if not already loaded
//     if (!document.querySelector('link[href*="bootstrap.min.css"]')) {
//       const bootstrapCSS = document.createElement('link');
//       bootstrapCSS.rel = 'stylesheet';
//       bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
//       document.head.appendChild(bootstrapCSS);
//     }

//     // Load Bootstrap Icons
//     if (!document.querySelector('link[href*="bootstrap-icons.css"]')) {
//       const bootstrapIcons = document.createElement('link');
//       bootstrapIcons.rel = 'stylesheet';
//       bootstrapIcons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
//       document.head.appendChild(bootstrapIcons);
//     }

//     // Load custom CSS files
//     const customCSS = [
//       '/assets/css/style.css',
//       '/assets/css/partners.css'
//     ];
    
//     customCSS.forEach(href => {
//       if (!document.querySelector(`link[href="${href}"]`)) {
//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = href;
//         document.head.appendChild(link);
//       }
//     });

//     // Load Bootstrap JS
//     if (!document.querySelector('script[src*="bootstrap.bundle.min.js"]')) {
//       const bootstrapJS = document.createElement('script');
//       bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';
//       document.body.appendChild(bootstrapJS);
//     }

//     return () => {
//       // Cleanup - remove dynamically added CSS (optional)
//       // Uncomment if needed
//       // customCSS.forEach(href => {
//       //   const link = document.querySelector(`link[href="${href}"]`);
//       //   if (link) link.remove();
//       // });
//     };
//   }, []);

//   return (
//     <div className="partners-page-content">
//       {/* Partner Hero Section */}
//       <section className="partner-hero text-center py-5" style={{ background: 'linear-gradient(135deg, #0b86d0, #00c853)', color: 'white' }}>
//         <div className="container">
//           <h1 className="fw-bold">Become a Reparo Partner ⚡</h1>
//           <p className="lead">Join India's Fast Growing EV Service Network</p>
//           <button className="btn btn-primary btn-lg mt-3" style={{ backgroundColor: '#fff', color: '#0b86d0', border: 'none' }}>Start Registration</button>
//         </div>
//       </section>

//       {/* Why Partner Section */}
//       <section className="py-5 bg-light">
//         <div className="container">
//           <h2 className="text-center mb-5 fw-bold">Why Partner With Reparo?</h2>
//           <div className="row g-4">
//             <div className="col-md-4">
//               <div className="partner-card text-center p-4" style={{ background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', transition: '0.3s ease' }}>
//                 <h5>💰 High Earnings</h5>
//                 <p>Earn per booking with transparent commission model.</p>
//               </div>
//             </div>
//             <div className="col-md-4">
//               <div className="partner-card text-center p-4" style={{ background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', transition: '0.3s ease' }}>
//                 <h5>📍 More Customers</h5>
//                 <p>Get verified leads directly from your service area.</p>
//               </div>
//             </div>
//             <div className="col-md-4">
//               <div className="partner-card text-center p-4" style={{ background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', transition: '0.3s ease' }}>
//                 <h5>📊 Dashboard Control</h5>
//                 <p>Manage bookings, pricing & reports in one place.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Partner Process Section */}
//       <section className="partner-process py-5">
//         <div className="container">
//           <h2 className="text-center mb-5 fw-bold">Partner Onboarding Process</h2>
//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="process-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
//                 <h5>Step 1: Register</h5>
//                 <p>Sign up using mobile number & business details.</p>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="process-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
//                 <h5>Step 2: Submit Documents</h5>
//                 <p>Upload ID proof, workshop photos & bank details.</p>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="process-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
//                 <h5>Step 3: Verification</h5>
//                 <p>Our team verifies your credentials & service capability.</p>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="process-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
//                 <h5>Step 4: Service Setup</h5>
//                 <p>Select services, pricing & service coverage area.</p>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="process-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
//                 <h5>Step 5: Training</h5>
//                 <p>Basic platform usage & quality guidelines training.</p>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="process-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
//                 <h5>Step 6: Go Live</h5>
//                 <p>Start receiving bookings from customers instantly.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Required Documents Section */}
//       <section className="py-5 bg-light">
//         <div className="container">
//           <h2 className="text-center mb-4 fw-bold">Required Documents</h2>
//           <ul className="list-group list-group-flush">
//             <li className="list-group-item">✔ Aadhaar / ID Proof</li>
//             <li className="list-group-item">✔ EV Certification (if available)</li>
//             <li className="list-group-item">✔ Workshop Photos</li>
//             <li className="list-group-item">✔ Bank Account Details</li>
//             <li className="list-group-item">✔ GST (if applicable)</li>
//           </ul>
//         </div>
//       </section>

//       {/* How You Earn Section */}
//       <section className="py-5">
//         <div className="container text-center">
//           <h2 className="fw-bold mb-4">How You Earn</h2>
//           <p>✔ Per Booking Commission</p>
//           <p>✔ AMC Subscription Revenue</p>
//           <p>✔ Spare Parts Margin</p>
//           <p>✔ Emergency Support Charges</p>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="partner-cta text-center py-5" style={{ background: 'linear-gradient(135deg, #00c853, #0b86d0)', color: 'white' }}>
//         <div className="container">
//           <h2 className="fw-bold">Ready to Grow with Reparo? ⚡</h2>
//           <button className="btn btn-success btn-lg mt-3" style={{ backgroundColor: '#fff', color: '#00c853', border: 'none' }}>Become a Partner Now</button>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default PartnersHTML;
