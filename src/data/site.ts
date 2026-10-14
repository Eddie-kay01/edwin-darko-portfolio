/** Update personal links and copy here before publishing. Empty links are intentionally not rendered. */
export const site = {
  name: 'Edwin Darko',
  email: 'YOUR_EMAIL@example.com',
  github: '',
  linkedin: '',
  cvPath: '', // Example: '/edwin-darko-cv.pdf' after adding a real CV to /public.
  university: 'Ghana Communication Technology University',
  degree: 'Computer Science',
  currentlyBuilding: 'Small ideas into useful software',
  currentlyLearning: 'Strengthening software engineering fundamentals',
  currentInterests: ['Web experiences', 'Useful digital products', 'Problem solving'],
  nextGoal: 'Keep shipping projects and learning from the process.',
}

export type Project = {
  name: string
  short: string
  status: 'Exploration' | 'In progress' | 'Completed' | 'Live'
  type: string
  stack: string[]
  features: string[]
  learning: string
  repo?: string
  demo?: string
  accent: string
}

// Potential projects from the initial brief. Verify descriptions, status and stack before publishing.
export const projects: Project[] = [
  {
    name: 'NeedIt',
    short: 'A marketplace concept exploring how people discover what they need, with a chatbot-related direction.',
    status: 'Exploration', type: 'Product concept', stack: ['Stack to confirm'],
    features: ['Marketplace experience', 'Chatbot-related concept', 'User needs discovery'],
    learning: 'Add the real technical decisions, challenges, and lessons from the project here.', accent: 'violet',
  },
  {
    name: 'Regiwhite Bakery',
    short: 'A bakery website concept focused on presenting a brand and its products clearly online.',
    status: 'Exploration', type: 'Web experience', stack: ['Stack to confirm'],
    features: ['Brand presentation', 'Product discovery', 'Responsive layout'],
    learning: 'Add verified implementation details and lessons learned here.', accent: 'cyan',
  },
  {
    name: 'BIWC',
    short: 'A church website project, with project scope and implementation details to be added.',
    status: 'Exploration', type: 'Community website', stack: ['Stack to confirm'],
    features: ['Information architecture', 'Community information', 'Responsive experience'],
    learning: 'Add verified features, challenges, and lessons learned here.', accent: 'pink',
  },
]

export const skills = [
  { category: 'Languages', items: ['Add languages you have used'] },
  { category: 'Frontend', items: ['Add frontend technologies'] },
  { category: 'Backend & data', items: ['Add backend or database tools'] },
  { category: 'Tools & learning', items: ['Add development tools', 'Currently learning: update me'] },
]

export const journey = [
  { label: 'Education', title: 'Computer Science at GCTU', detail: 'Building a foundation in computing, software, and problem solving.', kind: 'Current chapter' },
  { label: 'Practice', title: 'Learning by making', detail: 'Use this space to add verified projects, experiments, and the lessons they taught you.', kind: 'Ongoing' },
  { label: 'Next', title: 'Grow as a software engineer', detail: 'An ambition: keep developing practical skills, collaborating, and creating useful technology.', kind: 'Aspiration' },
]
