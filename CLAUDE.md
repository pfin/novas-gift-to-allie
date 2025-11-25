# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nova's Gift to Allie is a heartfelt digital collection created for a 21-month-old child. It contains stories, lessons, and an interactive web application featuring "The Wheels on the Bus" game.

## Project Structure

- `/allie-app/` - Next.js interactive application (main development area)
- `/stories/` - Children's stories in markdown
- `/lessons/` - Life lessons from "Nova"
- `/about-allie/` - Documentation about Allie's development
- `/images/` - SVG illustrations
- `/games/` - Family game ideas

## Development Commands

All commands should be run from the `/allie-app/` directory:

```bash
npm run dev    # Start development server on port 3000
npm run build  # Create production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

Note: No test framework is configured. When adding tests, you'll need to set up a testing framework first.

## Technical Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **React**: v19.0.0
- **Deployment**: Vercel (root directory set to `allie-app`)

## Architecture

The application is a single-page interactive game centered around the `WheelsOnTheBus` component (`allie-app/app/page.tsx`). Key features include:

- Client-side rendering with `'use client'` directive
- Interactive elements: butterflies (5), Oscar the cat, spinning wheels
- Audio playback for music
- Touch/click interactions designed for toddlers
- Celebration effects and animations

## Code Quality Standards

- ESLint is configured - always run `npm run lint` before committing
- Fix all TypeScript errors to ensure successful Vercel deployment
- The project uses strict TypeScript configuration

## Deployment

The app is deployed to Vercel with the following configuration:
- Root Directory: `allie-app`
- Framework Preset: Next.js
- Build Command: Default (`next build`)

## Important Context

This is a personal project designed for a young child. When making changes:
- Keep interactions simple and intuitive for toddlers
- Maintain the playful, colorful aesthetic
- Test on touch devices when possible
- Consider adding keyboard navigation for accessibility