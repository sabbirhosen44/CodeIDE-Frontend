export const MOCK_TEMPLATES = [
  {
    _id: "template1",
    name: "React Single Page Application",
    description:
      "A modern React SPA with routing, state management, and responsive design",
    category: "Frontend",
    language: "JavaScript",
    framework: "React",
    tags: ["react", "spa", "frontend", "react router"],
    stars: 245,
    downloads: 1245,
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-04-20T15:30:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "App.jsx",
        path: "/App.jsx",
        content: `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;`,
      },
      {
        type: "file",
        name: "index.js",
        path: "/index.js",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      },
      {
        type: "file",
        name: "Navbar.jsx",
        path: "/components/Navbar.jsx",
        content: `import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">React App</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;`,
      },
      {
        type: "file",
        name: "Home.jsx",
        path: "/pages/Home.jsx",
        content: `import React from 'react';

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to React SPA</h1>
      <p>This is a single page application built with React.</p>
    </div>
  );
}

export default Home;`,
      },
      {
        type: "file",
        name: "About.jsx",
        path: "/pages/About.jsx",
        content: `import React from 'react';

function About() {
  return (
    <div className="about-page">
      <h1>About Us</h1>
      <p>This is the about page of our React SPA.</p>
    </div>
  );
}

export default About;`,
      },
      {
        type: "file",
        name: "App.css",
        path: "/App.css",
        content: `/* App styles */
.App {
  font-family: Arial, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.logo a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

main {
  padding: 2rem;
}

.home-page, .about-page {
  max-width: 800px;
  margin: 0 auto;
}`,
      },
    ],
  },
  {
    _id: "template2",
    name: "Express REST API",
    description: "A Node.js REST API with Express, MongoDB, and authentication",
    category: "Backend",
    language: "JavaScript",
    framework: "Express",
    tags: ["node", "express", "api", "mongodb"],
    stars: 189,
    downloads: 987,
    author: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-05-05T11:45:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "server.js",
        path: "/server.js",
        content: `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      },
      {
        type: "file",
        name: "auth.js",
        path: "/routes/auth.js",
        content: `const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save user
    const savedUser = await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;`,
      },
      {
        type: "file",
        name: "users.js",
        path: "/routes/users.js",
        content: `const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email } = req.body;

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;`,
      },
      {
        type: "file",
        name: "User.js",
        path: "/models/User.js",
        content: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);`,
      },
      {
        type: "file",
        name: "auth.js",
        path: "/middleware/auth.js",
        content: `const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};`,
      },
      {
        type: "file",
        name: ".env.example",
        path: "/.env.example",
        content: `PORT=5000
MONGODB_URI=mongodb://localhost:27017/express-api
JWT_SECRET=your_jwt_secret_key`,
      },
    ],
  },
  {
    _id: "template3",
    name: "Next.js Blog",
    description:
      "A blog application built with Next.js, featuring SSR and API routes",
    category: "Fullstack",
    language: "TypeScript",
    framework: "Next.js",
    tags: ["next", "react", "blog", "typescript"],
    stars: 156,
    downloads: 876,
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-03-05T14:20:00Z",
    updatedAt: "2023-05-12T09:10:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "index.tsx",
        path: "/pages/index.tsx",
        content: `import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../lib/api';
import { Post } from '../interfaces/post';

interface HomeProps {
  posts: Post[];
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Next.js Blog</title>
        <meta name="description" content="A blog built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold mb-8">Next.js Blog</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Link href={\`/posts/\${post.slug}\`} className="text-blue-600 hover:underline">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts(['title', 'date', 'slug', 'author', 'excerpt']);

  return {
    props: { posts },
  };
};

export default Home;`,
      },
      {
        type: "file",
        name: "[slug].tsx",
        path: "/pages/posts/[slug].tsx",
        content: `import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getPostBySlug, getAllPosts } from '../../lib/api';
import markdownToHtml from '../../lib/markdownToHtml';
import { Post } from '../../interfaces/post';

interface PostProps {
  post: Post;
}

const PostPage = ({ post }: PostProps) => {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{post.title} | Next.js Blog</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <main>
        <article className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center mb-6">
            <span className="text-gray-600">{post.date}</span>
            <span className="mx-2">•</span>
            <span className="text-gray-600">By {post.author.name}</span>
          </div>
          <div
            className="prose lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getPostBySlug(params?.slug as string, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'excerpt',
  ]);

  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};

export default PostPage;`,
      },
      {
        type: "file",
        name: "api.ts",
        path: "/lib/api.ts",
        content: `import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post } from '../interfaces/post';

const postsDirectory = join(process.cwd(), '_posts');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\\.md$/, '');
  const fullPath = join(postsDirectory, \`\${realSlug}.md\`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items: Post = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // Sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}`,
      },
      {
        type: "file",
        name: "markdownToHtml.ts",
        path: "/lib/markdownToHtml.ts",
        content: `import { remark } from 'remark';
import html from 'remark-html';

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}`,
      },
      {
        type: "file",
        name: "post.ts",
        path: "/interfaces/post.ts",
        content: `export interface Post {
  [key: string]: any;
  slug?: string;
  title?: string;
  date?: string;
  author?: {
    name: string;
    picture?: string;
  };
  excerpt?: string;
  content?: string;
}`,
      },
    ],
  },
  {
    _id: "template4",
    name: "Vue Dashboard",
    description:
      "A responsive admin dashboard built with Vue.js and Tailwind CSS",
    category: "Frontend",
    language: "JavaScript",
    framework: "Vue",
    tags: ["vue", "dashboard", "tailwind", "admin"],
    stars: 132,
    downloads: 654,
    author: {
      name: "Sarah Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-04-12T10:30:00Z",
    updatedAt: "2023-05-18T16:45:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "main.js",
        path: "/src/main.js",
        content: `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/tailwind.css'

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')`,
      },
      {
        type: "file",
        name: "App.vue",
        path: "/src/App.vue",
        content: `<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Sidebar v-if="isAuthenticated" />
    <div :class="{ 'ml-64': isAuthenticated && !isMobile, 'ml-0': !isAuthenticated || isMobile }">
      <Navbar v-if="isAuthenticated" />
      <main class="p-4 md:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar
  },
  setup() {
    const store = useStore()
    const isMobile = ref(false)

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth < 768
    }

    onMounted(() => {
      checkScreenSize()
      window.addEventListener('resize', checkScreenSize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize)
    })

    return {
      isAuthenticated,
      isMobile
    }
  }
}
</script>`,
      },
      {
        type: "file",
        name: "Navbar.vue",
        path: "/src/components/layout/Navbar.vue",
        content: `<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="px-4 py-3 flex items-center justify-between">
      <div class="flex items-center md:hidden">
        <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div class="flex-1 flex justify-end">
        <div class="flex items-center space-x-4">
          <button @click="toggleTheme" class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg v-if="isDarkMode" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <div class="relative">
            <button @click="toggleNotifications" class="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span v-if="unreadNotifications" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {{ unreadNotifications }}
              </span>
            </button>
          </div>

          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center focus:outline-none">
              <img class="h-8 w-8 rounded-full object-cover" :src="user.avatar" alt="User avatar" />
            </button>

            <div v-if="isUserMenuOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div class="py-1">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profile
                </router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </router-link>
                <button @click="logout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Navbar',
  setup() {
    const store = useStore()
    const isUserMenuOpen = ref(false)
    const isNotificationsOpen = ref(false)

    const user = computed(() => store.state.auth.user)
    const isDarkMode = computed(() => store.state.ui.darkMode)
    const unreadNotifications = computed(() => store.state.notifications.unread)

    const toggleUserMenu = () => {
      isUserMenuOpen.value = !isUserMenuOpen.value
      if (isUserMenuOpen.value) {
        isNotificationsOpen.value = false
      }
    }

    const toggleNotifications = () => {
      isNotificationsOpen.value = !isNotificationsOpen.value
      if (isNotificationsOpen.value) {
        isUserMenuOpen.value = false
      }
    }

    const toggleSidebar = () => {
      store.commit('ui/TOGGLE_SIDEBAR')
    }

    const toggleTheme = () => {
      store.commit('ui/TOGGLE_DARK_MODE')
    }

    const logout = () => {
      store.dispatch('auth/logout')
    }

    return {
      user,
      isDarkMode,
      unreadNotifications,
      isUserMenuOpen,
      isNotificationsOpen,
      toggleUserMenu,
      toggleNotifications,
      toggleSidebar,
      toggleTheme,
      logout
    }
  }
}
</script>`,
      },
      {
        type: "file",
        name: "Sidebar.vue",
        path: "/src/components/layout/Sidebar.vue",
        content: `<template>
  <div :class="['fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out', { '-translate-x-full': !isOpen && isMobile, 'translate-x-0': isOpen || !isMobile }]">
    <div class="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
      <router-link to="/" class="flex items-center">
        <span class="text-xl font-bold text-gray-800 dark:text-white">Vue Dashboard</span>
      </router-link>
      <button @click="closeSidebar" class="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="mt-5 px-2">
      <div class="space-y-1">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[isActive(item.path) ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white']">
          <component :is="item.icon" class="mr-4 h-6 w-6" :class="[isActive(item.path) ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300']" />
          {{ item.name }}
        </router-link>
      </div>
    </nav>
  </div>

  <div v-if="isOpen && isMobile" class="fixed inset-0 z-20 bg-black bg-opacity-50" @click="closeSidebar"></div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'Sidebar',
  setup() {
    const store = useStore()
    const route = useRoute()

    const isOpen = computed(() => store.state.ui.sidebarOpen)
    const isMobile = ref(window.innerWidth < 768)

    const navItems = [
      { name: 'Dashboard', path: '/', icon: 'HomeIcon' },
      { name: 'Analytics', path: '/analytics', icon: 'ChartBarIcon' },
      { name: 'Customers', path: '/customers', icon: 'UsersIcon' },
      { name: 'Products', path: '/products', icon: 'ShoppingBagIcon' },
      { name: 'Orders', path: '/orders', icon: 'ShoppingCartIcon' },
      { name: 'Reports', path: '/reports', icon: 'DocumentReportIcon' },
    ]

    const isActive = (path) => {
      return route.path === path
    }

    const closeSidebar = () => {
      store.commit('ui/CLOSE_SIDEBAR')
    }

    return {
      isOpen,
      isMobile,
      navItems,
      isActive,
      closeSidebar
    }
  }
}
</script>`,
      },
    ],
  },

  // Template 13: Python
  {
    _id: "template13",
    name: "Python",
    description: "A basic Hello World program in Python",
    category: "Standalone",
    language: "Python",
    framework: null,
    tags: ["python", "hello-world", "beginner", "standalone"],
    stars: 120,
    downloads: 600,
    author: {
      name: "Alex Carter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-08-05T09:00:00Z",
    updatedAt: "2023-08-15T14:20:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "main.py",
        path: "/main.py",
        content: `# Python Hello World
print("Hello, World!")`,
      },
    ],
  },

  // Template 14: Java
  {
    _id: "template14",
    name: "Java",
    description: "A basic Hello World program in Java",
    category: "Standalone",
    language: "Java",
    framework: null,
    tags: ["java", "hello-world", "beginner", "standalone"],
    stars: 115,
    downloads: 580,
    author: {
      name: "Alex Carter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-08-05T09:10:00Z",
    updatedAt: "2023-08-15T14:30:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "Main.java",
        path: "/Main.java",
        content: `// Java Hello World
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      },
    ],
  },

  // Template 15: C++
  {
    _id: "template15",
    name: "C++",
    description: "A basic Hello World program in C++",
    category: "Standalone",
    language: "C++",
    framework: null,
    tags: ["cpp", "hello-world", "beginner", "standalone"],
    stars: 110,
    downloads: 550,
    author: {
      name: "Alex Carter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-08-05T09:20:00Z",
    updatedAt: "2023-08-15T14:40:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "main.cpp",
        path: "/main.cpp",
        content: `// C++ Hello World
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      },
    ],
  },

  // Template 16: JavaScript
  {
    _id: "template16",
    name: "JavaScript",
    description: "A basic Hello World program in JavaScript",
    category: "Standalone",
    language: "JavaScript",
    framework: null,
    tags: ["javascript", "hello-world", "beginner", "standalone"],
    stars: 125,
    downloads: 620,
    author: {
      name: "Alex Carter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-08-05T09:30:00Z",
    updatedAt: "2023-08-15T14:50:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "main.js",
        path: "/main.js",
        content: `// JavaScript Hello World
console.log("Hello, World!");`,
      },
    ],
  },

  // Template 17: Rust
  {
    _id: "template17",
    name: "Rust",
    description: "A basic Hello World program in Rust",
    category: "Standalone",
    language: "Rust",
    framework: null,
    tags: ["rust", "hello-world", "beginner", "standalone"],
    stars: 105,
    downloads: 510,
    author: {
      name: "Alex Carter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-08-05T09:40:00Z",
    updatedAt: "2023-08-15T15:00:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "main.rs",
        path: "/main.rs",
        content: `// Rust Hello World
fn main() {
    println!("Hello, World!");
}`,
      },
    ],
  },

  // Template 18: C
  {
    _id: "template18",
    name: "C",
    description: "A basic Hello World program in C",
    category: "Standalone",
    language: "C",
    framework: null,
    tags: ["c", "hello-world", "beginner", "standalone"],
    stars: 100,
    downloads: 500,
    author: {
      name: "Alex Carter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-08-05T09:50:00Z",
    updatedAt: "2023-08-15T15:10:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "main.c",
        path: "/main.c",
        content: `// C Hello World
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      },
    ],
  },

  // Template 19: Go
  {
    _id: "template19",
    name: "Go",
    description: "A basic Hello World program in Go",
    category: "Standalone",
    language: "Go",
    framework: null,
    tags: ["go", "hello-world", "beginner", "standalone"],
    stars: 108,
    downloads: 520,
    author: {
      name: "Alex Carter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-08-05T10:00:00Z",
    updatedAt: "2023-08-15T15:20:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "main.go",
        path: "/main.go",
        content: `// Go Hello World
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
      },
    ],
  },

  // Template 20: Ruby
  {
    _id: "template20",
    name: "Ruby",
    description: "A basic Hello World program in Ruby",
    category: "Standalone",
    language: "Ruby",
    framework: null,
    tags: ["ruby", "hello-world", "beginner", "standalone"],
    stars: 102,
    downloads: 490,
    author: {
      name: "Alex Carter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-08-05T10:10:00Z",
    updatedAt: "2023-08-15T15:30:00Z",
    isPublic: true,
    files: [
      {
        type: "file",
        name: "main.rb",
        path: "/main.rb",
        content: `# Ruby Hello World
puts "Hello, World!"`,
      },
    ],
  },
];

// Mock snippets data
export const MOCK_SNIPPETS = [
  {
    id: "snippet1",
    title: "React useEffect Cleanup",
    description:
      "How to properly clean up effects in React functional components",
    content: `import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    
    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return <div>Seconds: {seconds}</div>;
}

export default Timer;`,
    language: "javascript",
    tags: ["react", "hooks", "useEffect", "cleanup"],
    author: {
      id: "user1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-05-10T14:30:00Z",
    likes: 42,
    comments: [
      {
        id: "comment1",
        author: {
          id: "user2",
          name: "Jane Smith",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "This is exactly what I needed, thanks!",
        createdAt: "2023-05-10T15:45:00Z",
      },
      {
        id: "comment2",
        author: {
          id: "user3",
          name: "Bob Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Great explanation of the cleanup pattern.",
        createdAt: "2023-05-11T09:20:00Z",
      },
    ],
  },
  {
    id: "snippet2",
    title: "CSS Grid Layout",
    description: "A responsive grid layout using CSS Grid",
    content: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
  padding: 20px;
}

.grid-item {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-gap: 10px;
  }
}`,
    language: "css",
    tags: ["css", "grid", "responsive", "layout"],
    author: {
      id: "user2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-05-08T10:15:00Z",
    likes: 35,
    comments: [
      {
        id: "comment3",
        author: {
          id: "user1",
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "This is a clean implementation of CSS Grid!",
        createdAt: "2023-05-08T11:30:00Z",
      },
    ],
  },
  {
    id: "snippet3",
    title: "Node.js File Upload with Multer",
    description:
      "How to handle file uploads in Express.js using Multer middleware",
    content: `const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create the multer instance
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Single file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  res.send({
    message: 'File uploaded successfully',
    file: req.file
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});`,
    language: "javascript",
    tags: ["node.js", "express", "multer", "file-upload"],
    author: {
      id: "user3",
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-05-05T16:45:00Z",
    likes: 28,
    comments: [
      {
        id: "comment4",
        author: {
          id: "user4",
          name: "Alice Williams",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "This helped me implement file uploads in my project, thanks!",
        createdAt: "2023-05-06T09:10:00Z",
      },
      {
        id: "comment5",
        author: {
          id: "user2",
          name: "Jane Smith",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Don't forget to create the uploads directory first!",
        createdAt: "2023-05-06T14:25:00Z",
      },
      {
        id: "comment6",
        author: {
          id: "user5",
          name: "Charlie Brown",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "You might want to add error handling for the directory creation as well.",
        createdAt: "2023-05-07T11:15:00Z",
      },
    ],
  },
  {
    id: "snippet4",
    title: "Python List Comprehension",
    description: "Examples of list comprehension in Python for cleaner code",
    content: `# Basic list comprehension
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(squared)  # Output: [1, 4, 9, 16, 25]

# List comprehension with condition
even_squared = [x**2 for x in numbers if x % 2 == 0]
print(even_squared)  # Output: [4, 16]

# Nested list comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(flattened)  # Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Dictionary comprehension
squares_dict = {x: x**2 for x in numbers}
print(squares_dict)  # Output: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Set comprehension
unique_lengths = {len(word) for word in ['hello', 'world', 'python', 'code']}
print(unique_lengths)  # Output: {5, 4, 6}`,
    language: "python",
    tags: ["python", "list-comprehension", "dictionaries", "sets"],
    author: {
      id: "user5",
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-05-03T13:20:00Z",
    likes: 56,
    comments: [
      {
        id: "comment7",
        author: {
          id: "user1",
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "List comprehensions are one of my favorite Python features!",
        createdAt: "2023-05-03T14:30:00Z",
      },
      {
        id: "comment8",
        author: {
          id: "user3",
          name: "Bob Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Great examples, very clear and concise.",
        createdAt: "2023-05-04T09:45:00Z",
      },
    ],
  },
  {
    id: "snippet5",
    title: "SQL JOIN Examples",
    description: "Different types of SQL JOINs with examples",
    content: `-- Sample tables
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    total_amount DECIMAL(10, 2)
);

-- INNER JOIN: Returns records that have matching values in both tables
SELECT c.name, c.email, o.order_id, o.order_date, o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;

-- LEFT JOIN: Returns all records from the left table, and matched records from the right table
SELECT c.name, c.email, o.order_id, o.order_date, o.total_amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;

-- RIGHT JOIN: Returns all records from the right table, and matched records from the left table
SELECT c.name, c.email, o.order_id, o.order_date, o.total_amount
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;

-- FULL JOIN: Returns all records when there is a match in either left or right table
SELECT c.name, c.email, o.order_id, o.order_date, o.total_amount
FROM customers c
FULL JOIN orders o ON c.customer_id = o.customer_id;`,
    language: "sql",
    tags: ["sql", "joins", "database", "queries"],
    author: {
      id: "user4",
      name: "Alice Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-05-01T11:10:00Z",
    likes: 47,
    comments: [
      {
        id: "comment9",
        author: {
          id: "user2",
          name: "Jane Smith",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "This is a great reference for SQL JOINs!",
        createdAt: "2023-05-01T12:25:00Z",
      },
      {
        id: "comment10",
        author: {
          id: "user5",
          name: "Charlie Brown",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "You might want to add examples with WHERE clauses too.",
        createdAt: "2023-05-02T09:15:00Z",
      },
    ],
  },
];
