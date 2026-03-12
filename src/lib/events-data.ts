
import { Event } from './types';

export const eventsData: Event[] = [
  {
    slug: 'flagship-hackathon',
    name: 'Flagship Hackathon',
    isTechnical: true,
    category: 'Development',
    description: 'A 24-hour coding marathon to build innovative solutions.',
    longDescription: 'The Flagship Hackathon is the crown jewel of TECH KURUKSHETRA. Participants will form teams and work tirelessly over 24 hours to develop a software or hardware solution to a given problem statement. It\'s a test of skill, endurance, and creativity.',
    imgId: 'hero-tech',
    iconName: 'Code',
    color: 'text-primary',
    rules: [
      'Teams of 2-4 members.',
      'All code must be written during the event.',
      'APIs and libraries are allowed.',
      'Final presentation and demo required.'
    ],
  },
  {
    slug: 'project-exhibition',
    name: 'Project Exhibition',
    isTechnical: true,
    category: 'Showcase',
    description: 'Showcase your best projects to industry experts and peers.',
    longDescription: 'Present your most innovative projects to a panel of esteemed judges and an audience of tech enthusiasts. This is your chance to get valuable feedback, network with professionals, and even attract potential investors.',
    imgId: 'team-member-1',
    iconName: 'Rocket',
    color: 'text-primary',
    rules: [
        'Individual or team participation.',
        'Projects can be from any domain of technology.',
        'Judging based on innovation, impact, and presentation.'
    ],
  },
  {
    slug: 'robo-rush',
    name: 'ROBO Rush',
    isTechnical: true,
    category: 'Robotics',
    description: 'Navigate your autonomous robot through a challenging obstacle course.',
    longDescription: 'Design, build, and program an autonomous robot to compete in a head-to-head race through a complex maze. The robot that completes the course in the fastest time wins.',
    imgId: 'team-member-2',
    iconName: 'Cpu',
    color: 'text-primary',
    rules: [
      'Teams of up to 4 members.',
      'Robot must be autonomous.',
      'Fastest time to complete the course wins.'
    ],
  },
  {
    slug: 'maths-quiz',
    name: 'Maths Quiz',
    isTechnical: false,
    category: 'Logic',
    description: 'A battle of wits for mathematics enthusiasts.',
    longDescription: 'Put your mathematical prowess to the test in this challenging quiz. Rounds will cover everything from classical theorems to modern applied mathematics. Speed and accuracy are key.',
    imgId: 'team-rahil',
    iconName: 'BrainCircuit',
    color: 'text-accent',
    rules: [
        'Individual participation.',
        'Multiple rounds with increasing difficulty.',
        'No calculators allowed.'
    ],
  },
  {
    slug: 'esports-tournament',
    name: 'eSports Tournament',
    isTechnical: false,
    category: 'Gaming',
    description: 'Compete in popular mobile games for glory.',
    longDescription: 'Join the ultimate mobile gaming showdown. Compete in tournaments for popular titles like BGMI and Free Fire. Squad up or go solo and fight your way to the top of the leaderboards.',
    imgId: 'team-khizer',
    iconName: 'Gamepad2',
    color: 'text-accent',
    rules: [
        'Team-based and solo events.',
        'Games include BGMI and Free Fire.',
        'Participants must bring their own devices.'
    ],
  },
  {
    slug: 'treasure-hunt',
    name: 'Treasure Hunt',
    isTechnical: false,
    category: 'Adventure',
    description: 'A fun-filled treasure hunt with clues hidden across the campus.',
    longDescription: 'Embark on an exciting adventure across the festival grounds. Solve cryptic clues, complete fun challenges, and race against other teams to find the hidden treasure. The first to the finish line wins!',
    imgId: 'hero-tech',
    iconName: 'Map',
    color: 'text-accent',
    rules: [
        'Teams of 2-4 members.',
        'First team to solve all clues and find the treasure wins.',
        'Physical and mental challenges involved.'
    ],
  },
];

    