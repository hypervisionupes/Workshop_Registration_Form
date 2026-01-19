import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import './reg.css';

const Register = () => {
  const [activeField, setActiveField] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    name: "", sap: "", email: "", phone: "", orbit: "", hypId: "", expectations: ""
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
    // Specific check for SAP ID required message as requested
    if (!value && name !== "hypId") {
      if (name === "sap") return "SAP ID is required";
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    
    if (name === "sap") {
      if (!value.toString().startsWith("5900")) return "SAP ID must start with 5900";
      if (value.toString().length !== 9) return "SAP ID must be exactly 9 digits";
    } else if (name === "email") {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return "Enter a valid email (e.g. name@xyz.com)";
    } else if (name === "phone") {
      if (value.length < 10) return "Phone number must be 10 digits";
      if (!/^\d+$/.test(value)) return "Only numbers allowed in phone field";
    } else if (name === "hypId") {
      if (value && !value.startsWith("HYPE")) return "ID must start with 'HYPE'";
    } else if (name === "expectations") {
      if (value.length < 5) return "Please provide a more detailed objective";
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setActiveField(null);
    setIsTyping(false);
    // Validation triggers only after moving to the next field
    const errorMsg = validate(name, value);
    setError(errorMsg);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sap" && value.length > 9) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsTyping(value.length > 0);
    // Clear error while typing to allow user to see the field clearly
    if (error) setError(""); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'sap', 'email', 'phone', 'orbit', 'expectations'];
    let firstError = "";
    let firstErrorField = null;

    for (let field of requiredFields) {
      const checkError = validate(field, formData[field]);
      if (checkError) {
        if (!firstError) {
          firstError = checkError;
          firstErrorField = field;
        }
      }
    }

    if (firstErrorField) {
      setError(firstError);
      setActiveField(firstErrorField);
      return;
    }

    setIsSubmitting(true);
    console.log("Form successfully validated and submitted:", formData);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const getPos = () => {
    switch(activeField) {
      case 'name': return 20;
      case 'sap': return 80;
      case 'email': return 140;
      case 'phone': return 200;
      case 'orbit': return 260;
      case 'expectations': return 320;
      case 'hypId': return 380;
      default: return 0;
    }
  };

  const isHidden = activeField === 'sap';
  const isValid = !error;

  return (
    <div className="hv-root">
      <motion.div className="hv-card-wrapper">
        
        <motion.div 
          className="monster purp-monster"
          animate={{ 
            y: getPos(), 
            x: isTyping ? 18 : 0, 
            rotate: isHidden ? -25 : (isTyping ? 15 : 0),
            scale: isTyping ? 1.05 : 1
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        >
          <div className="monster-hand purp-hand-top" />
          <div className="monster-hand purp-hand-bottom" />
          <div className="hv-eyes">
            {!isHidden && (
              <>
                <div className="hv-eye">
                  <motion.div animate={{ x: isTyping ? 4 : mousePos.x, y: isTyping ? 2 : mousePos.y }} className="hv-pupil" />
                </div>
                <div className="hv-eye">
                  <motion.div animate={{ x: isTyping ? 4 : mousePos.x, y: isTyping ? 2 : mousePos.y }} className="hv-pupil" />
                </div>
              </>
            )}
          </div>
          {isValid && isTyping && <div className="monster-smile" />}
          {!isValid && <div className="error-bubble">{error}</div>}
        </motion.div>

        <motion.div 
          className="monster cyan-monster"
          animate={{ 
            y: getPos() - 10,
            x: isTyping ? -5 : 0,
            scale: !isValid ? 0.8 : (isTyping ? 1.3 : 1),
            opacity: isHidden ? 0.3 : 1,
            rotate: isTyping ? -10 : 0
          }}
        >
          <div className="hv-eyes">
            {!isHidden && (
              <>
                <div className="hv-eye">
                  <motion.div animate={{ y: isTyping ? 5 : mousePos.y, x: mousePos.x }} className="hv-pupil" />
                </div>
                <div className="hv-eye">
                  <motion.div animate={{ y: isTyping ? 5 : mousePos.y, x: mousePos.x }} className="hv-pupil" />
                </div>
              </>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="monster deep-blue-monster"
          animate={{ 
            y: getPos() + 40,
            x: isTyping ? -18 : 0,
            rotate: isHidden ? 25 : (isTyping ? -15 : 0),
            scale: isTyping ? 1.1 : 1
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        >
          <div className="monster-hand-right blue-hand-top" />
          <div className="monster-hand-right blue-hand-bottom" />
          <div className="hv-eyes">
            {!isHidden && (
              <div className="hv-eye-single-box">
                  <motion.div animate={{ x: isTyping ? -4 : mousePos.x, y: isTyping ? 2 : mousePos.y }} className="hv-pupil" />
              </div>
            )}
          </div>
          {!isValid && <div className="monster-frown" />}
        </motion.div>

        <div className="hv-main-card">
          <div className="hv-brand-section">
            <img src="/logo.jpeg" className="hv-logo-img" alt="Hypervision" />
            <h1 className="hv-brand-name">HYPERVISION</h1>
          </div>

          <form className="hv-vertical-stack" onSubmit={handleSubmit}>
            <div className="hv-field">
              <label>Full Name *</label>
              <input name="name" type="text" placeholder="Your Name" 
                onFocus={() => setActiveField('name')} 
                onBlur={handleBlur}
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div className="hv-field">
              <label>SAP ID *</label>
              <input name="sap" type="number" placeholder="5900XXXXX" className="no-spin"
                onFocus={() => setActiveField('sap')} 
                onBlur={handleBlur}
                onChange={handleChange}
                value={formData.sap}
              />
            </div>

            <div className="hv-field">
              <label>Email Address *</label>
              <input name="email" type="email" placeholder="email@domain.com"
                onFocus={() => setActiveField('email')} 
                onBlur={handleBlur}
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            <div className="hv-field">
              <label>Phone Number *</label>
              <input name="phone" type="tel" placeholder="10 Digit Number"
                onFocus={() => setActiveField('phone')} 
                onBlur={handleBlur}
                onChange={handleChange}
                value={formData.phone}
              />
            </div>

            <div className="hv-field">
              <label>Your Current Year *</label>
              <select name="orbit" className="hv-dropdown" 
                onFocus={() => setActiveField('orbit')} 
                onBlur={handleBlur}
                onChange={handleChange}
                value={formData.orbit}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="hv-field">
              <label>What do you hope to learn from this workshop? *</label>
              <input name="expectations" type="text" placeholder="Your Objectives?" 
                onFocus={() => setActiveField('expectations')} 
                onBlur={handleBlur}
                onChange={handleChange}
                value={formData.expectations}
              />
            </div>

            <div className="hv-field">
              <label>Hypervision ID (Optional)</label>
              <input name="hypId" type="text" placeholder="HYPEXXXX" 
                onFocus={() => setActiveField('hypId')} 
                onBlur={handleBlur}
                onChange={handleChange}
                value={formData.hypId}
              />
            </div>

            <button type="submit" className="hv-launch-button" disabled={isSubmitting}>
              <span>{isSubmitting ? 'LAUNCHING...' : 'SUBMIT'}</span>
              <div className="rocket-container">
                <motion.div
                  animate={isSubmitting ? { x: 100, y: -100, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeIn" }}
                >
                  <Rocket size={18} />
                </motion.div>
              </div>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;