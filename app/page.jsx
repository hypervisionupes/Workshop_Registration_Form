"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import './reg.css';

const Register = () => {
  const [activeField, setActiveField] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    name: "",
    sap: "",
    email: "",
    phone: "",
    orbit: "",
    expectations: ""
  });

  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const validate = (name, value) => {
    if (!value) {
      if (name === "sap") return "SAP ID is required";
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (name === "name") {
      if (value.length < 2) return "Name must be at least 2 characters";
      if (value.length > 100) return "Name must not exceed 100 characters";
    } else if (name === "sap") {
      const sapStr = value.toString();
      if (!sapStr.startsWith("5000") && !sapStr.startsWith("5900")) return "SAP ID must start with 5000 or 5900";
      if (sapStr.length !== 9) return "SAP ID must be 9 digits";
    } else if (name === "email") {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return "Enter a valid email";
    } else if (name === "phone") {
      if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
    } else if (name === "expectations") {
      if (value.length < 5) return "Please elaborate your objectives.";
      if (value.length > 500) return "Maximum 500 characters allowed";
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setActiveField(null);
    setIsTyping(false);
    setError(validate(name, value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sap" && value.length > 9) return;
    if (name === "name" && value.length > 100) return;
    if (name === "expectations" && value.length > 500) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsTyping(value.length > 0);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ["name", "sap", "email", "phone", "orbit", "expectations"];
    for (let field of required) {
      const msg = validate(field, formData[field]);
      if (msg) {
        setError(msg);
        setActiveField(field);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Submission failed");
      } else {
        setError("");
        setSubmitted(true);
      }
    } catch {
      setError("Cannot connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPos = () => {
    if (submitted) return 150;
    switch (activeField) {
      case 'name': return 20;
      case 'sap': return 80;
      case 'email': return 140;
      case 'phone': return 200;
      case 'orbit': return 260;
      case 'expectations': return 320;
      default: return 0;
    }
  };

  return (
    <div className="hv-root">
      <motion.div className="hv-card-wrapper">

        {/* PURPLE MONSTER */}
        <motion.div
          className="monster purp-monster"
          animate={{
            y: getPos(),
            x: isTyping ? 18 : 0,
            rotate: activeField === 'sap' ? -25 : (isTyping ? 15 : (submitted ? 10 : 0)),
            scale: isTyping ? 1.05 : 1
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        >
          <div className="monster-hand purp-hand-top" />
          <div className="monster-hand purp-hand-bottom" />
          <div className="hv-eyes">
            {activeField !== 'sap' && (
              <>
                <div className="hv-eye"><motion.div animate={{ x: isTyping ? 4 : mousePos.x, y: isTyping ? 2 : mousePos.y }} className="hv-pupil" /></div>
                <div className="hv-eye"><motion.div animate={{ x: isTyping ? 4 : mousePos.x, y: isTyping ? 2 : mousePos.y }} className="hv-pupil" /></div>
              </>
            )}
          </div>
          {(!error && (isTyping || submitted)) && <div className="monster-smile" />}
        </motion.div>

        {/* CYAN MONSTER */}
        <motion.div
          className="monster cyan-monster"
          animate={{
            y: getPos() - 10,
            x: isTyping ? -5 : 0,
            scale: error ? 0.8 : (isTyping || submitted ? 1.3 : 1),
            opacity: activeField === 'sap' ? 0.3 : 1,
            rotate: isTyping ? -10 : 0
          }}
        >
          <div className="hv-eyes">
            {activeField !== 'sap' && (
              <>
                <div className="hv-eye"><motion.div animate={{ y: isTyping ? 5 : mousePos.y, x: mousePos.x }} className="hv-pupil" /></div>
                <div className="hv-eye"><motion.div animate={{ y: isTyping ? 5 : mousePos.y, x: mousePos.x }} className="hv-pupil" /></div>
              </>
            )}
          </div>
          {error && <div className="error-bubble">{error}</div>}
        </motion.div>

        {/* DEEP BLUE MONSTER */}
        <motion.div
          className="monster deep-blue-monster"
          animate={{
            y: getPos() + 40,
            x: isTyping ? -18 : 0,
            rotate: activeField === 'sap' ? 25 : (isTyping ? -15 : (submitted ? -10 : 0)),
            scale: isTyping ? 1.1 : 1
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        >
          <div className="monster-hand-right blue-hand-top" />
          <div className="monster-hand-right blue-hand-bottom" />
          <div className="hv-eyes">
            {activeField !== 'sap' && (
              <div className="hv-eye-single-box">
                <motion.div animate={{ x: isTyping ? -4 : mousePos.x, y: isTyping ? 2 : mousePos.y }} className="hv-pupil" />
              </div>
            )}
          </div>
          {error && <div className="monster-frown" />}
        </motion.div>

        <div className="hv-main-card" >
          <div className="hv-brand-section">
            <img src="/logo.jpeg" className="hv-logo-img" alt="Hypervision" />
            <h1 className="hv-brand-name">HYPERVISION LAUNCHPAD 2026</h1>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, scale: 0.95 }}
                className="hv-vertical-stack"
                onSubmit={handleSubmit}
              >
                <div className="hv-field">
                  <label>Full Name *</label>
                  <input name="name" placeholder="Enter Name" maxLength="100" onFocus={() => setActiveField('name')} onBlur={handleBlur} onChange={handleChange} value={formData.name} />
                </div>
                <div className="hv-field">
                  <label>SAP ID *</label>
                  <input name="sap" className="no-spin" placeholder="Enter SAP ID" onFocus={() => setActiveField('sap')} onBlur={handleBlur} onChange={handleChange} value={formData.sap} />
                </div>
                <div className="hv-field">
                  <label>Email Address *</label>
                  <input name="email" type="email" placeholder="Enter Mail ID" maxLength="254" onFocus={() => setActiveField('email')} onBlur={handleBlur} onChange={handleChange} value={formData.email} />
                </div>
                <div className="hv-field">
                  <label>Phone Number *</label>
                  <input name="phone" type="tel" placeholder="Enter Contact Number" maxLength="10" onFocus={() => setActiveField('phone')} onBlur={handleBlur} onChange={handleChange} value={formData.phone} />
                </div>
                <div className="hv-field">
                  <label>Your Current Year *</label>
                  <select name="orbit" className="hv-dropdown" onFocus={() => setActiveField('orbit')} onBlur={handleBlur} onChange={handleChange} value={formData.orbit}>
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div className="hv-field">
                  <label>What do you hope to learn? *</label>
                  <input name="expectations" placeholder="Your Objectives?" maxLength="500" onFocus={() => setActiveField('expectations')} onBlur={handleBlur} onChange={handleChange} value={formData.expectations} />
                </div>

                <button type="submit" className="hv-launch-button" disabled={isSubmitting}>
                  <span>{isSubmitting ? "Submitting..." : "SUBMIT"}</span>
                  <motion.div
                    animate={isSubmitting ? { x: 500, y: -500, opacity: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeIn" }}
                  >
                  </motion.div>
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hv-success-message"
              >
                <CheckCircle size={56} color="#00d4ff" className="hv-success-check-icon" />
                <h2>Thank you for submitting!</h2>
                <p className="hv-success-desc">
                  We look forward to seeing you at <strong>Hypervision Launchpad 2026</strong>.
                </p>

                <div className="hv-whatsapp-section">
                  <p className="hv-whatsapp-prompt">
                    Join our WhatsApp group for further details and event updates:
                  </p>
                  
                  <a
                    href="https://chat.whatsapp.com/Iwoh6JEeqp21xG2gfVgBqP?mode=gi_t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hv-whatsapp-link-btn"
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>Join WhatsApp Group</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
