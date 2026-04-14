// src/components/layout/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[rgb(11,61,59)] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Logo & About */}
          <div className="flex flex-col items-center md:items-start">
            {/* <h5 className="text-primary text-2xl font-bold mb-2">Reparo ⚡</h5> */}
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/assets/logo/logo.png" alt="Reparo Logo" className="h-16 pb-4 pt[-2] w-auto" />
            </Link>
            <p className="text-sm text-gray-300 max-w-xs">
              Smart EV service marketplace for bikes & scooters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <ul className="flex flex-wrap justify-center md:justify-start gap-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="md:text-right">
            <p className="text-sm text-gray-300">
              © 2026 Reparo. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer