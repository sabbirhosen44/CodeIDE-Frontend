import { FaCode, FaTerminal } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import { MdCloudQueue, MdLockOutline, MdShare } from "react-icons/md";
import { avatar1, avatar2, avatar3, avatar4 } from "./assets/avatars/avatars";

// Navlinks for navbar
export const navLinks = [
  { title: "Home", path: "/" },
  { title: "Templates", path: "/templates" },
  { title: "Snippets", path: "/snippets" },
  { title: "Pricing", path: "/pricing" },
];

// Features data in HomePage.tsx
export const features = [
  {
    id: 1,
    icon: FaCode,
    title: "Monaco-based Editor",
    description:
      "Enjoy a powerful code editor with syntax highlighting, code completion, and more.",
  },
  {
    id: 2,
    icon: FiZap,
    title: "Instant Code Execution",
    description:
      "Run your code directly in the browser with our integrated execution environment.",
  },
  {
    id: 3,
    icon: MdShare,
    title: "Real-time Collaboration",
    description:
      "Code together with your team in real-time, seeing changes as they happen.",
  },
  {
    id: 4,
    icon: FaTerminal,
    title: "Project Templates",
    description:
      "Get started quickly with templates for various programming languages and frameworks.",
  },
  {
    id: 5,
    icon: MdCloudQueue,
    title: "Cloud Storage",
    description:
      "Your projects are automatically saved and accessible from anywhere.",
  },
  {
    id: 6,
    icon: MdLockOutline,
    title: "Secure Environment",
    description:
      "Your code is protected with enterprise-grade security and encryption.",
  },
];

// Testimonial data in HomePage.tsx
export const testimonials = [
  {
    id: 1,
    name: "Benjamin Hayes",
    role: "Software Engineer at Rakuten",
    avatar: avatar1,
    content:
      "CodeIDE has completely transformed how our team collaborates. The real-time editing and sharing features are incredible!",
    rating: 5,
  },
  {
    id: 2,
    name: "Daniel Foster",
    role: "Freelance Web Developer",
    avatar: avatar2,
    content:
      "As someone who works from different locations, having a cloud IDE that just works everywhere is a game-changer.",
    rating: 5,
  },
  {
    id: 3,
    name: "Gabriel Reynolds",
    role: "CSE Student",
    avatar: avatar3,
    content:
      "The templates and snippets have helped me learn different programming languages faster than ever before.",
    rating: 4,
  },
  {
    id: 4,
    name: "Patrick Williams",
    role: "Lead Developer at StartupX",
    avatar: avatar4,
    content:
      "Our entire team switched to CodeIDE and we've seen a 30% increase in productivity. The collaboration features are unmatched.",
    rating: 5,
  },
];

// Pricing Plans
export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for learning and experimenting",
    price: 0,
    features: [
      "5 private projects",
      "Full code editor",
      "Community support",
      "Unimited Snippets",
    ],
    stripePriceId: "",
    isPopular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious programmers",
    price: 5,
    features: [
      "Unlimited Private Projects",
      "Advanced editor features",
      "Unimited Snippets",
      "Custom themes",
    ],
    stripePriceId: "price_1Rgt5kDjhqnCjFmqE1WDA7Dd",
    isPopular: true,
  },
];

// Pricing Page FAQ
export const FAQs = [
  {
    id: 1,
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely through Stripe.",
  },
  {
    id: 3,
    question: "Is there a free trial?",
    answer:
      "Yes, all paid plans come with a 14-day free trial. No credit card is required to try out CodeIDE.",
  },
  {
    id: 4,
    question: "Can I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time. When you cancel, you'll still have access to your paid features until the end of your current billing period.",
  },
  {
    id: 5,
    question: "What happens to my projects if I downgrade?",
    answer:
      "If you downgrade to a plan with fewer features or storage, you'll still have access to all your projects, but you may need to reduce your usage to comply with your new plan's limits.",
  },
];

// Platform supported languages
export const supportedLanguages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
] as const;

// Platform supported categories
export const supportedCategories = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "Desktop",
  "Standalone",
  "Library",
  "Framework",
] as const;

// Platform supported frameworks
export const supportedFrameworks = [
  "None",
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Express",
  "Django",
  "Spring",
  "Laravel",
] as const;

export const EDITOR_THEMES = [
  { value: "vs", label: "Light" },
  { value: "vs-dark", label: "Dark" },
  { value: "hc-black", label: "High Contrast Dark" },
  { value: "hc-light", label: "High Contrast Light" },
];

export const LANGUAGE_MAP: Record<string, string> = {
  js: "JavaScript",
  jsx: "JavaScript",
  ts: "TypeScript",
  tsx: "TypeScript",
  py: "Python",
  java: "Java",
  c: "C",
  cpp: "C++",
  cs: "C#",
  php: "PHP",
  rb: "Ruby",
  go: "Go",
  rs: "Rust",
  swift: "Swift",
  kt: "Kotlin",
};

export const EDITOR_FONT_SIZES = [
  { value: 12, label: "12px" },
  { value: 14, label: "14px" },
  { value: 16, label: "16px" },
  { value: 18, label: "18px" },
  { value: 20, label: "20px" },
  { value: 22, label: "22px" },
  { value: 24, label: "24px" },
];
