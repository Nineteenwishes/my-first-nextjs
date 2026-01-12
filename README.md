# My First Next.js - Portfolio Website

[![Deploy to Vercel](https://github.com/Nineteenwishes/my-first-nextjs/actions/workflows/deploy.yml/badge.svg)](https://github.com/Nineteenwishes/my-first-nextjs/actions/workflows/deploy.yml)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://portofolio-akbarr.vercel.app/)

A modern portfolio website built with [Next.js](https://nextjs.org), featuring a personal branding theme and AI-powered chat widget.

## 🚀 Features

- ⚡ Built with Next.js 16 and React 19
- 🎨 Responsive design with Tailwind CSS
- 🤖 AI Chat Widget powered by Google Gemini
- 🌙 Dark/Light theme toggle
- 📱 Mobile-first approach
- 🔄 CI/CD with GitHub Actions

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📦 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key
```

## 📄 CI/CD Pipeline

This project uses GitHub Actions for automated deployment:

- **Auto Deploy**: Pushes to `main` trigger production deployment
- **Preview Deployments**: Pull requests get preview URLs
- **Manual Trigger**: Workflow can be triggered manually
- **PR Comments**: Deployment URLs are commented on PRs

## 🌐 Live Demo

Visit the live site: [portofolio-akbarr.vercel.app](https://portofolio-akbarr.vercel.app/)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
