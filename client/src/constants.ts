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
