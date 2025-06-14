# Releaf – AI-Driven Plant Care System

"You just plant the seed – and leave the rest to us."

**Releaf** is an AI-powered self-care plant system that enables users to grow vegetables and greenery indoors with minimal intervention. By combining smart hardware, CNN-based machine learning models, and an intuitive web platform, Releaf automates irrigation, monitors plant health, detects pests and diseases, and visualizes plant well-being.

Designed for urban living and sustainable lifestyles, Releaf is ideal for anyone from first-time growers to professionals seeking efficient, intelligent plant care.

---

## Live Demo

Explore the deployed project here:  
**[https://releaf-plant-care.web.app](https://releaf-plant-care.web.app)**

---

## Project Introduction

Releaf is featured in our podcast episode *"Technology as a Means of Climate Justice"*, where we explore how accessible technologies can empower sustainable behaviors. Releaf is more than just automation—it represents a shift toward equitable, eco-conscious urban life.

Listen here:

---

## Key Features

### Web Application
- Plant recognition via image upload or capture
- Real-time dashboard with moisture, health status, and care alerts
- AI-powered plant care recommendation system
- Notifications and reminders for watering and maintenance

### Hardware System (ESP32)
- Soil moisture sensor
- Automatic water pump triggered by moisture thresholds
- LED dot matrix display showing plant mood (smile/sad face)
- WiFi-enabled data transmission to the backend server

### Backend & AI Models
- Node.js + Express backend (deployed on Render)
- Convolutional Neural Network (CNN) models for:
  - Growth stage classification (seedling, vegetative, mature)
  - Pest and disease detection via image analysis
- Data storage and authentication using Firebase

---

## Tech Stack

**Frontend**
- React with Vite
- React Router
- Firebase Authentication and Firestore
- Spline 3D integration

**Backend & Machine Learning**
- Node.js + Express
- Python (CNN model)
- Flask-based inference API (image processing)
- Render-hosted server

**Hardware**
- ESP32 microcontroller
- Soil moisture sensor, relay, water pump, LED matrix display
- Arduino IDE for embedded development






