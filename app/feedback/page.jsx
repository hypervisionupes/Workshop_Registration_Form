"use client";

import React, { useState } from "react";
import "./feedback.css";

const QUESTIONS = [
  "Overall quality of the workshop",
  "Clarity of explanations",
  "Hands-on usefulness",
  "Speaker knowledge",
  "Workshop pacing",
  "Relevance to your learning goals",
  "Would you recommend this workshop?"
];

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    hypervisionId: "",
    ratings: Array(7).fill(0),
    feedback: ""
  });

  const handleRating = (qIndex, value) => {
    const updated = [...formData.ratings];
    updated[qIndex] = value;
    setFormData(prev => ({ ...prev, ratings: updated }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "feedback" && value.length > 1500) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (formData.name.length < 2) return "Name is required";
    if (!/^HYPE\d{4}$/.test(formData.hypervisionId.toUpperCase()))
      return "Hypervision ID must be HYPE1234";

    for (let i = 0; i < formData.ratings.length; i++) {
      if (formData.ratings[i] === 0)
        return `Please rate question ${i + 1}`;
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      hypervisionId: formData.hypervisionId.toUpperCase(),
      ratings: formData.ratings,
      feedback: formData.feedback
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Submission failed");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Cannot connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="hv-root">
        <div className="hv-card-wrapper">
          <div className="hv-main-card">

            <div className="hv-brand-section">
              <img src="/logo.jpeg" className="hv-logo-img" alt="Hypervision" />
              <h1 className="hv-brand-name">HYPERVISION</h1>
            </div>

            {!submitted ? (
              <form className="hv-vertical-stack" onSubmit={handleSubmit}>

                <div className="hv-field">
                  <label>Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="hv-field">
                  <label>Hypervision ID *</label>
                  <input
                    name="hypervisionId"
                    value={formData.hypervisionId}
                    onChange={handleChange}
                    style={{ textTransform: "uppercase" }}
                  />
                </div>

                {QUESTIONS.map((q, i) => (
                  <div className="hv-field" key={i}>
                    <label>{q}</label>
                    <div className="hv-stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={
                            star <= formData.ratings[i]
                              ? "hv-star filled"
                              : "hv-star"
                          }
                          onClick={() => handleRating(i, star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="hv-field">
                  <label>Additional Feedback (optional)</label>
                  <textarea
                    name="feedback"
                    className="hv-textarea"
                    value={formData.feedback}
                    onChange={handleChange}
                  />
                  <div className="hv-char-count">
                    {formData.feedback.length} / 1500
                  </div>
                </div>

                {error && <div className="error-bubble">{error}</div>}

                <button className="hv-launch-button" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "SUBMIT FEEDBACK"}
                </button>

              </form>
            ) : (
              <div className="hv-success-message">
                <h2>Thank you!</h2>
                <p>Your workshop feedback has been submitted.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
