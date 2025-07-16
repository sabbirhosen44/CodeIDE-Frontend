# CodeIDE Platform - Frontend Documentation

## Table of Contents
1. [Introduction](#1-introduction)
    - [Project Structure](#11-project-structure)
    - [Overview](#12-overview)
    - [Key Features](#13-key-features)
    - [Planned Features](#14-planned-features)
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

### 1.1 Project Structure
This repository contains the frontend of the CodeIDE Platform, built with React, TypeScript, and Monaco Editor. The backend, which handles server-side logic, authentication, and API services, is hosted in a separate repository. Visit the backend repository for more details:  
- **Backend Repository**: https://github.com/sabbirhosen44/CodeIDE-Backend.

### 1.2 Overview
The frontend of the CodeIDE Platform provides a responsive, intuitive web-based integrated development environment (IDE) that connects to robust backend services. It enables developers to write, run, and debug code directly in their browsers with a modern, feature-rich interface.

### 1.3 Key Features
- **Code Editor**: Rich text editing powered by Monaco Editor, featuring syntax highlighting and code completion.
- **Editor Settings**: Customizable editor options including theme, font size, font family, minimap, and additional settings for a tailored coding experience.
- **AI Assistant**: Integrated AI-powered assistant in the code editor for real-time coding support, suggestions, and error detection.
- **Responsive Design**: Optimized for devices of all sizes, ensuring a consistent experience on desktops, tablets, and mobiles.
- **Theme Support**: Light/dark mode for the overall application UI.
- **Templates**: Predefined project templates to kickstart programming.
- **Admin Dashboard**: Interface for administrators to manage templates and monitor activity.
- **Pricing Plan**: Static page outlining flexible pricing tiers, including a free tier and premium subscription options.
- **Authentication System**: User login, registration, forgot password, and password reset functionalities.

### 1.4 Planned Features
- **File Explorer**: Browse and manage project files and directories.
- **Real-time Collaboration**: Collaborative editing with presence indicators.
- **Project Management**: Create, manage, and organize coding projects.
- **Snippets**: Store and reuse code snippets for faster development.
- **User Dashboard**: Personalized dashboard for users to manage their projects and settings.

## 2. Technology Stack

### 2.1 Core Libraries
- **React**: Library for building user interfaces
- **TypeScript**: Static typing for JavaScript
- **React Router DOM**: Declarative routing for React applications

### 2.2 State Management
- **Redux Toolkit**: State management for the project.

### 2.3 UI Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library built with Tailwind
- **Framer Motion**: Animation library for React

### 2.4 Code Editor
- **Monaco Editor**: Code editor that powers VS Code

### 2.5 API Communication
- **Axios**: Promise-based HTTP client

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

### 3.3 Building for Production
To create a production-ready build:
```bash
npm run build
# or
yarn build
# or
pnpm build
