import React from 'react';
import './HowItWorks.css';


export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Share your stack',
      description: 'Tell Fimmit about your preferred technologies, languages, and experience level in a few quick questions.'
    },
    {
      number: '02',
      title: 'Get matched',
      description: 'Our engine filters thousands of open-source repositories to surface issues tuned specifically to your interests.'
    },
    {
      number: '03',
      title: 'Ship your PR',
      description: 'Explore curated issues, review match scores, and jump straight into your first open-source contribution.'
    }
  ];

  return (
    <section id="how-it-works" className="fimmit-how-section" aria-label="How it works">
      <div className="fimmit-how__container">
        <div className="fimmit-how__header">
          <span className="fimmit-how__eyebrow">PROCESS</span>
          <h2 className="fimmit-how__title">How Fimmit works</h2>
        </div>

        <div className="fimmit-how__steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="fimmit-step-card">
              <div className="fimmit-step-card__number">{step.number}</div>
              <h3 className="fimmit-step-card__title">{step.title}</h3>
              <p className="fimmit-step-card__desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};