# Mini Seller - Lead Management System

A modern React-based lead management application that helps sales teams track, manage, and convert leads into opportunities. Built with TypeScript, React 19, and a clean architecture approach.

## Description

Mini Seller is a comprehensive lead management system that provides:

- **Lead Management**: View, filter, and manage leads with different statuses (new, contacted, qualified, disqualified)
- **Lead Conversion**: Convert qualified leads into sales opportunities
- **Opportunity Tracking**: Manage opportunities through different sales stages
- **Dashboard Analytics**: View key metrics including lead count, conversion rates, and total value
- **Responsive Design**: Modern UI built with Tailwind CSS that works on all devices

## Live Demo

🌐 **Live Application**: [https://mini-seller-red.vercel.app/](https://mini-seller-red.vercel.app/)

## Technologies Used

### Core Technologies

- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.2** - Fast build tool and development server

### State Management & Data Fetching

- **@tanstack/react-query 5.85.3** - Server state management and caching
- **React Hook Form 7.62.0** - Form handling and validation
- **Zod 4.0.17** - Schema validation

### UI & Styling

- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Heroicons 2.2.0** - Beautiful SVG icons
- **React Toastify 11.0.5** - Toast notifications
- **React Window 1.8.11** - Virtualized lists for performance

### Development Tools

- **ESLint 9.33.0** - Code linting
- **Vitest 3.2.4** - Unit testing framework
- **Testing Library** - React component testing
- **PostCSS & Autoprefixer** - CSS processing

## Architecture

The project follows a **Feature-Sliced Design (FSD)** architecture pattern, organizing code by business features rather than technical concerns:

### Key Architectural Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Feature Isolation**: Features are self-contained with their own logic and UI
3. **Shared Resources**: Common utilities and components are shared across features
4. **Type Safety**: Full TypeScript coverage with strict typing
5. **Testability**: Comprehensive test coverage with isolated unit tests

## Installation

### Prerequisites

- Node.js 18+
- Yarn package manager

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd mini-seller
```

2. Install dependencies:

```bash
yarn install
```

## Execution

### Development

Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### Testing

Run tests in watch mode:

```bash
yarn test
```
