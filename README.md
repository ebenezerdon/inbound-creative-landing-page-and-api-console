# inbound: Creative Landing Page and API Console

This project delivers a design-forward landing page and a lightweight API console for inbound, a complete email API for sending, receiving, threading, and AI-powered replies. Built by [Teda.dev](https://teda.dev), the AI app builder for everyday problems, it emphasizes editorial typography, asymmetric layouts, and delightful micro-interactions.

## What's inside
- Editorial landing page with:
  - Dramatic hero and pull-quote layout
  - Animated marquee of capabilities
  - Feature sections for outbound, inbound, threading, and AI agents
  - Developer Experience area with live-copy code sample
  - API overview and horizontally scrollable use cases
  - Accessible, mobile-first design
- API Console (app.html):
  - Build a POST /v2/emails JSON payload
  - Copy JSON and curl
  - Mock send with activity log
  - Local persistence using localStorage

## Tech stack
- HTML5, Tailwind CSS (CDN), and jQuery 3.7.x
- Modular JavaScript in scripts/ with a single global namespace window.App
- Local storage utilities and UI helpers

## Getting started
1. Open index.html in a modern browser.
2. Explore the landing page and use the CTAs.
3. Open app.html to try the API console demo.

No backend services are required. All interactions run locally in your browser.

## Accessibility
- Keyboard navigable and screen reader friendly landmarks
- High-contrast color palette
- Respects reduced motion preferences

## Persistence
The console saves your inputs to browser localStorage under the key `inbound.api.console.v1` so your work remains after reloads.

## Development notes
- Tailwind component compositions live in inline `<style type="text/tailwindcss">` blocks within the HTML files for CDN compilation.
- Avoids gradients and uses a modern, print-like editorial aesthetic.

Enjoy building with inbound.
