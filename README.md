# 🇬🇧 # **🖼️ Image Augmentation Scripts for Photoshop & GIMP**

A collection of scripts for **image dataset augmentation** through batch processing. These tools mirror each other's functionality, offering a powerful workflow for users of both **Adobe Photoshop** and **GIMP**.

The goal is to apply a series of transformations and filters to entire folders of images, generating multiple unique copies to prepare datasets for machine learning tasks or creative purposes.

## **✨ Main Features**

* **Intuitive Graphical Interface:** Easy to use without writing code or commands.
* **Batch Processing:** Processes all images in a source folder, including subfolders.
* **Available Augmentations:**
  + **📐 Geometric:** Resize, Crop (by aspect ratio), Rotate, Flip (Horizontal/Vertical), Shear.
  + **🎨 Filters:** Blur, Noise, Brightness, Exposure.
  + **🎭 Other:** Cutout (applies a random black area).
* **Multiple Outputs:** Generates a chosen number of augmented copies for each source image.
* **Flexible Naming:** Add custom prefixes and suffixes to the output filenames.
* **Multiple Formats:** Save the processed images as JPEG, PNG, TIFF, or PSD.

## **Adobe Photoshop (.jsx)**

A version for users of the Adobe ecosystem, written in ExtendScript (.jsx).

### **📋 Prerequisites**

* Photoshop.

### **🚀 How to Use**

The script does not require installation. To run it:

1. Open Adobe Photoshop.
2. Go to the menu **File > Scripts > Browse...**.
3. Select the \_Photoshop Image\_Augmentation Processor.jsx file and click **Open**.
4. The script's dialog window will open, ready to be configured.
![Script Interface](https://github.com/VicDc/AI-Dataset-Augmenter/blob/3fa61bdd20172d9171b3d8a7e4ad52ff4757d1fc/Image%20Augmentation%20Scripts%20for%20Photoshop%20%26%20GIMP.png)

## **GIMP (.py)**

An open-source version for GIMP users, written in Python.

### **📋 Prerequisites**

* GIMP.

### **🚀 Installation and Use**

#### **1. Install the Plug-in**

1. Find the GIMP plug-ins folder on your system:
   * **Windows:** C:\Users\[YOUR\_USERNAME]\AppData\Roaming\GIMP\[VERSION]\plug-ins
   * **macOS:** ~/Library/Application Support/GIMP/[VERSION]/plug-ins
   * **Linux:** ~/.config/GIMP/[VERSION]/plug-ins
2. Copy the image\_augmentation\_processor.py file into this folder.
3. Restart GIMP. The plug-in will be loaded automatically.

#### **2. Run the Plug-in**

1. Open GIMP.
2. Go to the menu **File > Batch > Image Processor and Augmenter...**
3. The plug-in's dialog window will open, ready to be configured.

## **⚙️ Configuration Guide (Identical for Both Versions)**

The interface is divided into 5 sections:

### **1. Source Folder**

* **Browse...:** Select the folder containing the original images.
* **Include subfolders:** Check this box to also process images in subfolders.

### **2. Destination Folder**

* **Browse...:** Select the folder where the processed images will be saved.
* **Keep folder structure:** If checked, the source's subfolder structure will be replicated in the destination.

### **3. Basic Transformations**

Set the geometric transformations to be applied to all images:

* **Resize:** Enable and set a resize percentage.
* **Aspect Ratio:** Crop the image to a fixed ratio (e.g., 1:1, 16:9) after resizing.
* **Rotation and Flipping:** Enter a rotation angle and/or choose to flip the image.

### **4. Augmentation Options**

These effects are applied to make each copy unique.

* Check the box for an effect to activate it.
* Set the parameters (e.g., blur radius, noise amount, etc.).

**Note:** Unlike other scripts that use Min/Max ranges, here most values are fixed. Randomness is primarily introduced by the **Cutout** effect, which generates a crop of ever-changing size and position.

### **5. Output Settings**

* **Augmented copies per image:** Enter the number of copies to create for each source file.
* **Filename Prefix/Suffix:** Define a prefix and/or suffix to be added to the generated filenames (e.g., IMG\_01.jpg -> prefix\_IMG\_01\_suffix.jpg).
* **Save as:** Choose one or more output formats. For JPEG, you can specify the quality.

Once everything is configured, click **Run** (in Photoshop) or **OK** (in GIMP) to start the process. A progress bar will keep you updated, and a final notification will alert you upon completion.

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
