# AI-Dataset-Augmenter

Official Guide: Image AI Dataset Augmenter
Welcome to the official guide for Image AI Dataset Augmenter, the Adobe Photoshop script that transforms how you prepare data for artificial intelligence.

Table of Contents
🚀 The Mission

⚙️ 60-Second Installation

✨ Quickstart Guide: Your First Augmented Dataset

💡 Use Cases: From Idea to Implementation

Case 1: Industrial Robotic Vision

Case 2: Advanced Symbol Recognition (OCR+)

🧠 Pro-Tips & Frequently Asked Questions (FAQ)

1. The Mission
The Problem: AI is Data-Hungry
Every computer vision model, from the simplest to the most complex, needs one thing above all else: a massive amount of high-quality data. Training an AI to recognize an object in any condition—with different rotations, scales, and perspectives—requires thousands of sample images. Manually sourcing or creating this data is slow, expensive, and often prohibitive.

The Solution: Multiply Your Reality
Image AI Dataset Augmenter is your shortcut. This script takes a single source image of an object and generates hundreds of realistic variations by applying random yet controlled transformations. It teaches your AI to generalize, to recognize an object not just as it is, but as it could be in the real world.

It's the perfect tool for AI developers, researchers, students, and hobbyists who want to build more robust, fast, and effective visual recognition models.

2. 60-Second Installation
The installation is so simple it can hardly be called one.

Copy the Code: Get the full source code of the .jsx script.

Create the File: Open a plain text editor (Notepad, TextEdit, VS Code, etc.), paste the code, and save it as Image_AI_Dataset_Augmenter.jsx.

⚠️ Important: Make sure the file extension is .jsx, not .txt.

Done. The script is ready to go.

3. Quickstart Guide: Your First Augmented Dataset
Launch the script and create your first dataset in under 5 minutes.

Step 1: Prepare Your Environment
Open Photoshop and ensure no other documents are open. This guarantees the script runs without interference.

Step 2: Run the Script
In Photoshop, navigate to File > Scripts > Browse... and select your Image_AI_Dataset_Augmenter.jsx file.

Step 3: Configure the Generation
The main interface will appear. Configure it to fit your needs.

!(https://i.imgur.com/g0a1s3c.png)

Source File: Click Browse... to select your object's image. Pro-tip: Use a square (1:1) image with the object well-centered.

Output Options:

Prefix: A name to identify the set (e.g., bolt_v1_).

Number of versions: How many different images to generate. Start with 100 for a test run.

Format: PNG is ideal for preserving transparency, while JPG is great for smaller files.

Random Transformations:

Rotation: A slight range (e.g., -15 to 15) simulates small perspective shifts.

Zoom: A range like 90 to 110 simulates distance from the object.

Flip: Essential for teaching the AI reflection invariance.

Step 4: Execute and Relax
Click Execute, choose a destination folder to save everything, and let the script work its magic. When it's done, you'll have a folder full of training-ready data.

4. Use Cases: From Idea to Implementation
Case 1: Industrial Robotic Vision
Goal: Train a robotic arm to identify and pick up a mechanical component (e.g., a bolt) from a conveyor belt, regardless of its orientation.

Source Image: A top-down, perfectly centered photo of a single bolt on a neutral background.

Configuration:

Versions: 500

Rotation: Min -180, Max 180 (to cover all possible orientations).

Zoom: Min 95, Max 105 (to simulate minor distance variations).

Flip: Not necessary for a symmetrical object like a bolt.

Result: A dataset that teaches the model to recognize the bolt at any rotation, making the pick-and-place system far more reliable.

Case 2: Advanced Symbol Recognition (OCR+)
Goal: Build an application that can recognize a company logo or a specific icon from a photo taken with a smartphone.

Source Image: The logo's PNG file with a transparent background.

Configuration:

Versions: 1000

Rotation: Min -25, Max 25 (photos are rarely perfectly straight).

Zoom: Min 80, Max 120 (the user can be closer or farther away).

Flip: Horizontal (useful if the logo is seen through glass or a reflective surface).

Result: A robust AI model that identifies the logo even in "imperfect" real-world photos, drastically improving the user experience.

5. Pro-Tips & Frequently Asked Questions (FAQ)
How do I handle non-square images?
The script is optimized for 1:1 images. With rectangular images, the "smart zoom" logic to prevent empty borders will still work, but it might crop the vertical or horizontal sides of the image. For best results, crop your source image into a square first.

The script is slow. Can I speed it up?
Performance depends on your image resolution and your computer's power. To generate thousands of images, consider using a lower-resolution source (e.g., 512x512 pixels), which is often sufficient for AI training.

Why use Photoshop instead of a Python library like OpenCV?
For its resampling quality. Photoshop's transformation algorithms (like "Bicubic") are industry-leading and produce high-quality augmented images without artifacts. Additionally, the visual interface makes the process more intuitive.
