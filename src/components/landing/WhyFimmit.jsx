import React from 'react';
import './WhyFimmit.css';

/**
 * Fimmit WhyFimmit Component (Section D)
 * Asymmetric editorial benefit layout explaining why developers choose Fimmit.
 */
export const WhyFimmit = () => {
  const benefits = [
    {
      title: 'Zero endless searching',
      desc: 'Stop scrolling through hundreds of sprawling repositories trying to figure out where your skills actually apply.'
    },
    {
      title: 'Matched to your tech stack',
      desc: 'Whether you write vanilla JavaScript, TypeScript, or Python, recommendations are tailored precisely to your toolkit.'
    },
    {
      title: 'Clear entry points',
      desc: 'Every recommendation highlights difficulty levels, context, and exact starting points so you can contribute with confidence.'
    }
  ];

  return (
    <section id="about" className="fimmit-why-section" aria-label="Why Fimmit">
      <div className="fimmit-why__container">
        <div className="fimmit-why__header">
          <span className="fimmit-why__eyebrow">ADVANTAGE</span>
          <h2 className="fimmit-why__title">Built for developers who want to ship, not search.</h2>
        </div>

        <div className="fimmit-why__grid">
          {benefits.map((b, i) => (
            <div key={i} className="fimmit-why-card">
              <h3 className="fimmit-why-card__title">{b.title}</h3>
              <p className="fimmit-why-card__desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};