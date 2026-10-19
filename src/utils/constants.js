/**
 * Central constants for Fimmit application
 */

export const TECH_OPTIONS = [
  'C++',
  'Python',
  'JS',
  'Rust',
  'React',
  'TypeScript',
  'Java',
  'Other',
];

export const INTEREST_OPTIONS = [
  'Backend',
  'AI/ML',
  'DevOps',
  'App Dev',
  'Frontend',
  'Web3',
  'Other',
];

export const GOAL_OPTIONS = [
  'Build my portfolio',
  'Find niche projects',
  'First PR',
];

export const DIFFICULTY_OPTIONS = [
  {
    uiLabel: 'Beginner',
    description: 'Good first issue',
    apiValue: 'EASY',
    color: 'green',
  },
  {
    uiLabel: 'Intermediate',
    description: 'Some project context needed',
    apiValue: 'MEDIUM',
    color: 'yellow',
  },
  {
    uiLabel: 'Expert',
    description: 'Advanced, deep changes',
    apiValue: 'HARD',
    color: 'orange',
  },
];

export const DIFFICULTY_MAP = {
  Beginner: 'EASY',
  Intermediate: 'MEDIUM',
  Expert: 'HARD',
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
};
