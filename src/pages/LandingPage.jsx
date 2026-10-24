import React, { useState } from 'react';
import githubIcon from '../assets/github.png';
import logoSrc from '../assets/Logo.svg';
import './LandingPage.css';

export const LandingPage = ({ onContinueWithGithub, onHowItWorks }) => {
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      question: "Do you read my private code?",
      answer: "No. Only public profile and repository metadata is used to estimate your experience and build search tags."
    },
    {
      question: "Do you read my private code?",
      answer: "No. Only public profile and repository metadata is used to estimate your experience and build search tags."
    },
    {
      question: "Do you read my private code?",
      answer: "No. Only public profile and repository metadata is used to estimate your experience and build search tags."
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fimmit-landing-page">
      <div className="fimmit-page-content">
        <div className="fimmit-landing-container">
          <div className="fimmit-eyebrow">
            <span>PROJECT</span>
            <span className="fimmit-eyebrow-dot">·</span>
            <span>OPEN-SOURCE MATCHMAKER</span>
            <span className="fimmit-eyebrow-dot">·</span>
            <span>BUILT FOR YOUR STACK</span>
          </div>

          <div className="fimmit-hero-section">
            <div className="fimmit-hero-left">
              <h1 className="fimmit-hero-headline">
                <span className="fimmit-headline-line">Find issues</span>
                <span className="fimmit-headline-line">tuned to your</span>
                <span className="fimmit-headline-banner-wrapper">
                  {/* ANIMATION CLASS ADDED HERE */}
                  <span className="fimmit-orange-banner animate-hero-banner">
                    exact stack.
                  </span>
                </span>
              </h1>
            </div>

            <div className="fimmit-hero-right">
              <div className="fimmit-sticker-container">
                <svg viewBox="0 0 200 200" className="fimmit-sticker-svg" aria-hidden="true">
                  <path
                    id="stickerTextPath"
                    d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                    fill="none"
                  />
                  <text className="fimmit-sticker-circular-text">
                    <textPath href="#stickerTextPath" startOffset="0%">
                      NO GUESSWORK  ·  ONE ISSUE AT A TIME  ·  
                    </textPath>
                  </text>
                </svg>

                <div className="fimmit-sticker-outer-circle">
                  <div className="fimmit-sticker-inner-circle">
                    <span>Ship your</span>
                    <span>first PR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fimmit-bottom-hero">
            <div className="fimmit-bottom-left">
              <button type="button" className="fimmit-matching-link-btn" onClick={onHowItWorks}>
                How the matching works <span className="fimmit-arrow">→</span>
              </button>
              <p className="fimmit-bottom-description">
                Open-source issues tuned to your exact stack and experience. Four questions in, ten issues out.
              </p>
            </div>

            <div className="fimmit-bottom-center">
              <button type="button" className="fimmit-github-cta-btn" onClick={onContinueWithGithub}>
                <div className="fimmit-github-icon-badge">
                  <img src={githubIcon} alt="Github" className="fimmit-github-svg" aria-hidden="true" />
                </div>
                <span>Continue with Github</span>
              </button>
            </div>

            <div className="fimmit-bottom-right">
              <span className="fimmit-handwritten-accent animate-blue-text-float">
                first issues are welcome too
              </span>
            </div>
          </div>

          <div className="fimmit-section-divider"></div>

          <section className="fimmit-preview-section">
            <div className="fimmit-preview-left">
              <h2 className="fimmit-preview-headline">
                See a match<br />before you<br />sign up
              </h2>
              <p className="fimmit-preview-desc">
                Each recommendation shows the repo, the issue, the tags. High-difficulty or off-stack picks are flagged.
              </p>
              <span className="fimmit-preview-handwritten animate-blue-text-float">
                no black boxes
              </span>
            </div>

            <div className="fimmit-preview-right">
              <div className="fimmit-preview-card animate-preview-card">
                <div className="fimmit-card-header">
                  <div className="fimmit-card-repo">
                    reactjs/react.dev
                    <span className="fimmit-card-star">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      11k
                    </span>
                  </div>
                  <div className="fimmit-card-difficulty fimmit-diff-hard">hard</div>
                </div>

                <h3 className="fimmit-card-title">
                  Fix broken sandbox in useDeferredValue<br />docs <span className="fimmit-card-issue-num">#6120</span>
                </h3>

                <div className="fimmit-card-tags">
                  <span className="fimmit-card-tag">JS</span>
                  <span className="fimmit-card-tag">react</span>
                  <span className="fimmit-card-tag">docs</span>
                </div>

                <div className="fimmit-card-match-row">
                  <span className="fimmit-match-score">88% match</span>
                  <span className="fimmit-match-desc">Good first issue with a clear fix and active maintainers</span>
                </div>

                <div className="fimmit-card-actions">
                  <button type="button" className="fimmit-card-btn-open">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Open issue
                  </button>
                  <button type="button" className="fimmit-card-btn-saved">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Saved
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          <div className="fimmit-section-divider"></div>

          <section className="fimmit-how-it-works-section" id="how-it-works">
            <div className="fimmit-hiw-header">
              <h2 className="fimmit-hiw-title">
                How it{' '}
                <span className="fimmit-hiw-banner-wrapper">
                  <span className="fimmit-hiw-orange-banner">works</span>
                </span>
              </h2>
              <div className="fimmit-hiw-eyebrow">
                <span>4 STEPS</span>
                <span className="fimmit-hiw-eyebrow-dot">·</span>
                <span>ABOUT 2 MINUTES</span>
              </div>
            </div>

            <div className="fimmit-hiw-timeline-area">
              <svg className="fimmit-hiw-svg-line" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 400 95 C 600 120, 600 150, 680 350 C 600 900, 250 480, 280 650 C 300 820, 500 980, 600 880" fill="none" stroke="#000000" strokeWidth="5" strokeDasharray="16, 16" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
              </svg>

              <div className="fimmit-hiw-grid">
                <div className="fimmit-hiw-col left-col">
                  <div className="fimmit-hiw-step-container">
                    <div className="fimmit-hiw-card bg-yellow">
                      <div className="fimmit-hiw-badge">1</div>
                      <h3 className="fimmit-hiw-card-title">Tell us who you are</h3>
                      <p className="fimmit-hiw-card-desc">Bio, goal, stack, interests and how hard you want it.</p>
                    </div>
                  </div>
                  <div className="fimmit-hiw-step-container">
                    <span className="fimmit-hiw-blue-note note-1">takes about two minutes</span>
                    <div className="fimmit-hiw-card bg-teal">
                      <div className="fimmit-hiw-badge">3</div>
                      <h3 className="fimmit-hiw-card-title">Models tag and rank</h3>
                      <p className="fimmit-hiw-card-desc">Up to 5 search tags, then candidates ranked by fit.</p>
                    </div>
                  </div>
                </div>

                <div className="fimmit-hiw-col right-col">
                  <div className="fimmit-hiw-step-container">
                    <div className="fimmit-hiw-card bg-orange">
                      <div className="fimmit-hiw-badge">2</div>
                      <h3 className="fimmit-hiw-card-title">We read your GitHub</h3>
                      <p className="fimmit-hiw-card-desc">Repos and history reveal your real experience level.</p>
                    </div>
                  </div>
                  <div className="fimmit-hiw-step-container">
                    <div className="fimmit-hiw-card bg-green">
                      <div className="fimmit-hiw-badge">4</div>
                      <h3 className="fimmit-hiw-card-title">Pick from your top 10</h3>
                      <p className="fimmit-hiw-card-desc">Save the issue, and start working on it.</p>
                    </div>
                    <span className="fimmit-hiw-blue-note note-2">then go ship it</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="fimmit-section-divider"></div>

          <section className="fimmit-faq-section" id="faqs">
            <h2 className="fimmit-faq-title">Quick Answers</h2>
            <div className="fimmit-faq-list">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`fimmit-faq-item ${activeFaq === index ? 'active' : ''}`}
                  onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                >
                  <div className="fimmit-faq-header">
                    <span className="fimmit-faq-question">{faq.question}</span>
                    <span className="fimmit-faq-icon">{activeFaq === index ? 'x' : '+'}</span>
                  </div>
                  {activeFaq === index && (
                    <div className="fimmit-faq-answer">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      <div className="fimmit-cta-banner">
        <h2 className="fimmit-cta-title">
          Your next PR is<br />already open<br />somewhere.
        </h2>
        <button type="button" className="fimmit-footer-github-btn" onClick={onContinueWithGithub}>
          <img src={githubIcon} alt="Github" className="fimmit-footer-github-icon" aria-hidden="true" />
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default LandingPage;