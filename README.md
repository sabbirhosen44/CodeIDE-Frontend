# CodeIDE Platform - Frontend Documentation

## Table of Contents
1. [Introduction](#1-introduction)
    - [Overview](#11-overview)
    - [Key Features](#12-key-features)
2. [Technology Stack](#2-technology-stack)
    - [Core Libraries](#21-core-libraries)
    - [State Management](#22-state-management)
    - [UI Framework](#23-ui-framework)
    - [Code Editor](#24-code-editor)
    - [API Communication](#25-api-communication)
    - [Development Tools](#26-development-tools)
3. [Project Installation Guide](#3-project-installation-guide)
    - [System Requirements](#31-system-requirements)
    - [Installation Steps](#32-installation-steps)
    - [Building for Production](#33-building-for-production)

## 1. Introduction

### 1.1 Overview
The frontend of the CodeIDE Platform provides a responsive, intuitive web-based integrated development environment (IDE) that connects to the robust backend services. It enables developers to write, run, and debug code directly in their browsers with a modern, feature-rich interface.

### 1.2 Key Features
The frontend system supports the following key features:
- **Code Editor**: Rich text editing with syntax highlighting and code completion
- **File Explorer**: Browse and manage project files and directories
- **Terminal Integration**: Interactive terminal access for code execution
- **Real-time Collaboration**: Collaborative editing with presence indicators
- **Project Management**: Create, manage, and organize coding projects
- **Responsive Design**: Optimal experience across devices of different sizes
- **Theme Support**: Light/dark mode and customizable editor themes
- **Templates**: Predefined project templates to kickstart development
- **Snippets**: Store and reuse code snippets for faster development
- **User Dashboard**: Personalized dashboard for users to manage their projects and settings
- **Admin Dashboard**: Admin interface to manage users, monitor activity, and control settings
- **Pricing Plan**: Flexible pricing tiers with various features, offering a free tier and premium subscriptions for additional capabilities.

## 2. Technology Stack

### 2.1 Core Libraries
- **React**: Library for building user interfaces
- **TypeScript**: Static typing for JavaScript
- **React Router DOM**: Declarative routing for React applications

### 2.2 State Management
- **Redux Toolkit**: State management for the project.
- **RTK Query**: Data fetching and caching solution

### 2.3 UI Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library built with Tailwind
- **Framer Motion**: Animation library for React

### 2.4 Code Editor
- **Monaco Editor**: Code editor that powers VS Code

### 2.5 API Communication
- **Axios**: Promise-based HTTP client
- **Socket.IO Client**: Real-time bidirectional event-based communication

### 2.6 Development Tools
- **Vite**: Next generation frontend tooling
- **Prettier**: Code formatter

## 3. Project Installation Guide

### 3.1 System Requirements
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher (or yarn/pnpm)
- **Git**: For version control
- **Operating System**: macOS, Windows, or Linux

### 3.2 Installation Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/Md-SabbirHosen/CodeIDE-Frontend.git
    cd codeide-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

