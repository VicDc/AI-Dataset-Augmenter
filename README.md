# 🇬🇧 Image AI Dataset Augmenter

**Image AI Dataset Augmenter** is an Adobe Photoshop script that transforms how you prepare image data for artificial intelligence.

---

## 📚 Table of Contents

- [🚀 The Mission](#-the-mission)
- [⚙️ 60-Second Installation](#-60-second-installation)
- [✨ Quickstart Guide: Your First Augmented Dataset](#-quickstart-guide-your-first-augmented-dataset)
- [💡 Use Cases: From Idea to Implementation](#-use-cases-from-idea-to-implementation)
  - [Case 1: Industrial Robotic Vision](#case-1-industrial-robotic-vision)
  - [Case 2: Advanced Symbol Recognition (OCR+)](#case-2-advanced-symbol-recognition-ocr)
- [🧠 Pro-Tips & Frequently Asked Questions (FAQ)](#-pro-tips--frequently-asked-questions-faq)

---

## 🚀 The Mission

### The Problem: AI is Data-Hungry

Every computer vision model—from the simplest to the most complex—needs one key ingredient: a **massive amount of high-quality training data**.  
Training an AI to recognize an object in any condition (rotation, scale, lighting, etc.) requires **thousands** of varied images.

### The Solution: Multiply Your Reality

**Image AI Dataset Augmenter** is your shortcut. This Photoshop script takes a single source image and generates **hundreds of realistic variations** through random but controlled transformations.

It helps your AI model **generalize** and perform better in real-world scenarios.

Perfect for:
- AI Developers
- Computer Vision Researchers
- Students & Educators
- Makers & Hobbyists

---

## ⚙️ 60-Second Installation

1. **Copy the Code:** Get the full source of the `.jsx` script from this repository.
2. **Create the File:**
   - Open any text editor (Notepad++, TextEdit, VS Code, etc.)
   - Paste the code.
   - Save the file as `Image_AI_Dataset_Augmenter.jsx`

⚠️ **Important:** Ensure the file extension is `.jsx`, *not* `.txt`.

You’re done! Ready to go.

---

## ✨ Quickstart Guide: Your First Augmented Dataset

Create your first dataset in under **5 minutes**.

### Step 1: Prepare Your Environment
- Open **Adobe Photoshop**
- Close all open documents to avoid script interference.

### Step 2: Run the Script
- Go to `File > Scripts > Browse...`
- Select `Image_AI_Dataset_Augmenter.jsx`

### Step 3: Configure the Generation

The script interface will appear with the following options:

![Script Interface](https://i.imgur.com/g0a1s3c.png)

- **Source File:** Choose your input image.  
  💡 *Tip: Use a centered square image (1:1 aspect ratio) for best results.*

- **Output Options:**
  - `Prefix`: e.g., `bolt_v1_`
  - `Number of Versions`: e.g., `100`
  - `Format`: PNG (preserves transparency) or JPG (smaller size)

- **Random Transformations:**
  - `Rotation`: e.g., `-15° to +15°`
  - `Zoom`: e.g., `90% to 110%`
  - `Flip`: Optional horizontal/vertical mirroring

### Step 4: Execute and Relax

- Click **Execute**
- Choose the destination folder
- The script will generate your augmented dataset automatically.

When finished, you’ll have a full folder of AI-ready training images!

---

## 💡 Use Cases: From Idea to Implementation

### Case 1: Industrial Robotic Vision
Train robots to recognize tools, bolts, parts, or machinery from varied angles.

### Case 2: Advanced Symbol Recognition (OCR+)
Improve OCR systems by training them with varied fonts, distortions, and symbol styles.

---

## 🧠 Pro-Tips & Frequently Asked Questions (FAQ)

- **What image format should I use?**  
  PNG for transparency, JPG for space-saving.

- **How many variations should I generate?**  
  Start with 100. Increase based on model performance.

- **Does this work for all Photoshop versions?**  
  Compatible with most modern versions supporting `.jsx` scripting.

- **Can I automate batch runs?**  
  Not natively, but the script can be integrated into larger Photoshop automation workflows.

---

## 📩 Feedback & Contributions

Have suggestions or found a bug?  
Feel free to [open an issue](https://github.com/yourusername/ImageAI-Augmenter/issues) or submit a pull request!

---

## 📄 License

This project is licensed under the MIT License.
