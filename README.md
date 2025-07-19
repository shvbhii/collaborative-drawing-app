# 🎨 Real-Time Collaborative Drawing Board

![Challenge Day](https://img.shields.io/badge/Day%2019%2F30-Challenge-blueviolet)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/YOUR_REPO_NAME)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/issues)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/YOUR_REPO_NAME)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/network)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO_NAME)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/stargazers)

### [🚀 View Live Demo](https://collaborative-drawing-app.onrender.com)


A real-time, multi-user, and fully responsive drawing application. This project allows multiple users to join distinct rooms and draw together simultaneously, with every stroke, color change, and action reflected on everyone's screen instantly.

![Project Demo GIF](./)


---

## 🚀 About This Project

This project is **Day 19** of my **#30DaysOfVibeCoding** challenge.

The "vibe" for this project was to explore the complexities of real-time communication and build something truly interactive. The goal was to move beyond simple data fetching and create a dynamic, shared experience using WebSockets. This isn't just a static webpage; it's a live environment where users can create together, from any device.

## ✨ Features

-   **Real-Time Collaboration:** Strokes appear on everyone's screen instantly using WebSockets.
-   **Room-Based Sessions:** Create or join private rooms for isolated drawing sessions.
-   **User Presence:** See a list of all active users in the room.
-   **Full Drawing Toolkit:**
    -   Color Picker
    -   Adjustable Brush Size with Live Preview
    -   Eraser Tool
-   **History Management:** Unlimited Undo and Redo functionality.
-   **Fully Responsive:** Works seamlessly on desktops, tablets, and mobile phones with touch support.
-   **Save Your Work:** Export the final canvas as a high-quality PNG, complete with watermark.
-   **Personalization:** Users can enter their name for a personalized experience.

## 🛠️ Tech Stack

This project leverages a modern web stack to achieve its real-time capabilities:

-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **Backend:** Node.js, Express.js
-   **Real-Time Engine:** Socket.IO
-   **Deployment:** Render

## 📦 Installation & Setup

To run this project locally, follow these simple steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/shvbhii/collaborative-drawing-app.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd collaborative-drawing-app
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Start the server:**
    ```sh
    node server.js
    ```
5.  Open your browser and go to `http://localhost:3000` to access the lobby.

## 🤝 Contributing & Issues

This was a fast-paced project for a daily challenge, but improvements are always welcome! Feel free to fork this repository, make your changes, and submit a pull request.

If you find a bug or have a feature request, please [open an issue](https://github.com/shvbhii/collaborative-drawing-app.git).

1.  **Fork** the project.
2.  Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

## 🤖 The Role of AI

As part of the #30DaysOfVibeCoding challenge, I'm transparent about how AI played a role. For this project.

-   **Debugging:** Acted as a rubber duck, helping identify logical errors like the mobile touch bug and the coordinate space issue.
-   **Boilerplate & SVGs:** Generated the initial server setup and the SVG icons for the UI, saving time to focus on core logic.
-   **Concept Explanation:** Provided explanations for complex topics like WebSocket rooms and canvas coordinate scaling.

## 👤 Creator & Connect

This project was built by **Shubhi Sharma** as part of a personal learning journey.

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shvbhi)

Connect with me on LinkedIn! I'd love to hear your thoughts, feedback, or just say hi.