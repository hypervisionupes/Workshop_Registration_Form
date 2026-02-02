import React, { useState } from "react";
import "./feedback.css";

export default function Feedback() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sap: "",
    hypId: "",
    year: "",
    feedback: ""
  });

  /* -------- VALIDATION -------- */
  const validate = (name, value) => {
    if (!value) return `${name.toUpperCase()} is required`;

    if (name === "name" && value.length < 2)
      return "Name must be at least 2 characters";

    if (name === "sap") {
      if (!/^\d{9}$/.test(value)) return "SAP ID must be 9 digits";
      if (!value.startsWith("5000") && !value.startsWith("5900"))
        return "SAP ID must start with 5000 or 5900";
    }

    if (name === "hypId") {
      if (!/^HYPE\d{4}$/.test(value.toUpperCase()))
        return "Format: HYPE1234";
    }

    if (name === "feedback") {
      if (value.length < 5) return "Feedback is too short";
      if (value.length > 5000) return "Max 5000 characters allowed";
    }

    return "";
  };

  /* -------- CHANGE HANDLER -------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "feedback" && value.length > 5000) return;
    if (name === "sap" && value.length > 9) return;
    if (name === "hypId" && value.length > 8) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  /* -------- SUBMIT HANDLER -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // frontend validation
    for (let field in formData) {
      const msg = validate(field, formData[field]);
      if (msg) {
        setError(msg);
        return;
      }
    }

    setIsSubmitting(true);

    // backend payload mapping
    const payload = {
      name: formData.name,
      sap: formData.sap,
      hypervisionId: formData.hypId,
      year: formData.year,
      feedback: formData.feedback
    };

    try {
      const res = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Submission failed");
        return;
      }

      setError("");
      setSubmitted(true);

    } catch {
      setError("Cannot connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------- UI -------- */
  return (
    <div className="hv-root">
      <div className="hv-card-wrapper">

        {/* MONSTERS */}
        <div className="monster purp-monster">
          <div className="hv-eyes">
            <div className="hv-eye"><div className="hv-pupil" /></div>
            <div className="hv-eye"><div className="hv-pupil" /></div>
          </div>
          <div className="monster-smile" />
          <div className="monster-hand purp-hand-top" />
          <div className="monster-hand purp-hand-bottom" />
        </div>

        <div className="monster cyan-monster">
          <div className="hv-eye-single-box">
            <div className="hv-pupil" />
          </div>
          {error && <div className="error-bubble">{error}</div>}
        </div>

        <div className="monster deep-blue-monster">
          <div className="hv-eye-single-box">
            <div className="hv-pupil" />
          </div>
        </div>

        {/* CARD */}
        <div className="hv-main-card">
          <div className="hv-brand-section">
            <img src="/logo.jpeg" alt="Hypervision" className="hv-logo-img" />
            <h1 className="hv-brand-name">HYPERVISION</h1>
          </div>

          {!submitted ? (
            <form className="hv-vertical-stack" onSubmit={handleSubmit}>

              <div className="hv-field">
                <label>Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div className="hv-field">
                <label>SAP ID *</label>
                <input name="sap" className="no-spin" value={formData.sap} onChange={handleChange} />
              </div>

              <div className="hv-field">
                <label>Hypervision ID *</label>
                <input
                  name="hypId"
                  value={formData.hypId}
                  onChange={handleChange}
                  style={{ textTransform: "uppercase" }}
                />
              </div>

              <div className="hv-field">
                <label>Year *</label>
                <select name="year" className="hv-dropdown" value={formData.year} onChange={handleChange}>
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="hv-field">
                <label>Feedback *</label>
                <textarea
                  name="feedback"
                  className="hv-textarea"
                  value={formData.feedback}
                  onChange={handleChange}
                />
                <div className="hv-char-count">
                  {formData.feedback.length} / 5000
                </div>
              </div>

              <button className="hv-launch-button" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "SUBMIT FEEDBACK"}
              </button>

            </form>
          ) : (
            <div className="hv-success-message">
              <h2>Submission Successful </h2>
              <p>Your feedback has been recorded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
