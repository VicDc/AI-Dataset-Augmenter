# GIMP Python-Fu Scripts
# File: gimp_batch_and_dataset.py
# Contains two registered procedures:
# 1) python-fu-image-batch-processor
# 2) python-fu-dataset-creator

from gimpfu import *
import os
import glob

# ---------------------------
# 1) Image Batch Processor
# ---------------------------

def batch_processor(img, layer, src_folder, include_subfolders,
                    dst_folder, keep_structure,
                    out_formats, jpg_quality,
                    resize_bool, resize_val, ratio_preset,
                    rotate_angle, flip_h, flip_v,
                    zoom_pct, center_content,
                    rename_mode, rename_text):
    """
    Batch process images in a directory tree:
      - Resize (percent or WxH or ratio preset)
      - Zoom
      - Rotate + auto-crop transparent areas
      - Flip H/V
      - Center content
      - Export to multiple formats
      - Rename: keep, prefix, suffix, sequential
    """
    # Build file list
    patterns = ['*.jpg', '*.jpeg', '*.png', '*.tif', '*.tiff', '*.psd']
    files = []
    for pat in patterns:
        if include_subfolders:
            for root, dirs, _ in os.walk(src_folder):
                files.extend(glob.glob(os.path.join(root, pat)))
        else:
            files.extend(glob.glob(os.path.join(src_folder, pat)))

    def mkdir_p(path):
        if not os.path.exists(path):
            os.makedirs(path)

    def build_name(base, idx):
        if rename_mode == 0:
            return base
        elif rename_mode == 1:
            return rename_text + base
        elif rename_mode == 2:
            return base + rename_text
        elif rename_mode == 3:
            n = idx + (int(rename_text) if rename_text.isdigit() else 1)
            return "%03d_%s" % (n, base)

    # Iterate files
    for idx, fpath in enumerate(files):
        # Determine relative path
        rel = os.path.relpath(os.path.dirname(fpath), src_folder) if keep_structure else ''
        out_dir = os.path.join(dst_folder, rel)
        mkdir_p(out_dir)

        # Load image
        img = pdb.gimp_file_load(fpath, fpath)
        drw = img.active_layer

        # Zoom and resize
        w, h = img.width, img.height
        if zoom_pct != 100:
            pdb.gimp_image_scale(img, int(w * zoom_pct / 100.0), int(h * zoom_pct / 100.0))
            w, h = img.width, img.height
        if resize_bool:
            if isinstance(resize_val, tuple):
                new_w, new_h = resize_val
            else:
                if isinstance(resize_val, str) and resize_val.endswith('%'):
                    p = float(resize_val[:-1]) / 100.0
n                    new_w, new_h = int(w * p), int(h * p)
                else:
                    new_w, new_h = w, h
            # Ratio presets override
            presets = {
                '1:1':(min(w,h), min(w,h)),
                '4:3':(int(h*4/3.0), h),
                '3:2':(int(h*3/2.0), h),
                '16:9':(int(h*16/9.0), h),
                '2:3':(w, int(w*3/2.0)),
                '3:4':(w, int(w*4/3.0))
            }
            if ratio_preset in presets:
                new_w, new_h = presets[ratio_preset]
            pdb.gimp_image_scale(img, new_w, new_h)

        # Rotate + auto-crop (using layer extents)
        if rotate_angle != 0:
            pdb.gimp_item_transform_rotate(drw, rotate_angle * (3.1415926/180.0), TRUE,
                                           w/2, h/2)
            # Auto-crop transparent
            pdb.plug_in_autocrop(img, drw)

        # Flip
        if flip_h:
            pdb.gimp_item_transform_flip_simple(drw, ORIENTATION_HORIZONTAL, TRUE, 0)
        if flip_v:
            pdb.gimp_item_transform_flip_simple(drw, ORIENTATION_VERTICAL, TRUE, 0)

        # Center content: trim and center
        if center_content:
            pdb.plug_in_autocrop(img, drw)
            img.resize(img.width, img.height, TRUE, TRUE)

        # Prepare name
        base = os.path.splitext(os.path.basename(fpath))[0]
        new_base = build_name(base, idx)

        # Export
        if 'JPEG' in out_formats:
            pdb.gimp_file_save(img, drw,
                os.path.join(out_dir, new_base + '.jpg'), '')
        if 'PNG' in out_formats:
            pdb.file_png_save_defaults(img, drw,
                os.path.join(out_dir, new_base + '.png'), '')
        if 'TIFF' in out_formats:
            pdb.file_tiff_save(img, drw,
                os.path.join(out_dir, new_base + '.tif'), '')
        # PSD not supported natively in Python-fu

        # Clean up
        pdb.gimp_image_delete(img)

    gimp.message("Batch completo: %d file elaborati" % len(files))

register(
    "python-fu-image-batch-processor",
    "Batch process images in a folder",
    "Batch processing with resize, rotate, flip, zoom, centering, rename and multi-format export",
    "You",
    "You",
    "2025",
    "Batch Processor...",
    "*",
    [
        (PF_DIRNAME, "src_folder", "Cartella sorgente", None),
        (PF_TOGGLE, "include_subfolders", "Includi subfolders", True),
        (PF_DIRNAME, "dst_folder", "Cartella destinazione", None),
        (PF_TOGGLE, "keep_structure", "Mantieni struttura subfolders", True),
        (PF_STRING, "out_formats", "Formati (comma-separated e.g. JPEG,PNG)", "JPEG,PNG"),
        (PF_SLIDER, "jpg_quality", "JPEG Quality", 8, (0, 12, 1)),
        (PF_TOGGLE, "resize_bool", "Ridimensiona", False),
        (PF_STRING, "resize_val", "Resize value (50% or WxH)", "50%"),
        (PF_OPTION, "ratio_preset", "Ratio preset", 0, ['Auto','1:1','4:3','3:2','16:9','2:3','3:4']),
        (PF_SLIDER, "rotate_angle", "Ruota (°)", 0, (-360,360,1)),
        (PF_TOGGLE, "flip_h", "Specchia Orizz.", False),
        (PF_TOGGLE, "flip_v", "Specchia Vert.", False),
        (PF_SLIDER, "zoom_pct", "Zoom (%)", 100, (10,500,1)),
        (PF_TOGGLE, "center_content", "Centra contenuto",
            True),
        (PF_OPTION, "rename_mode", "Modalità nome", 0,
            ['Mantieni','Prefisso','Suffisso','Numerazione']),
        (PF_STRING, "rename_text", "Testo prefisso/suffisso o numero iniziale", "1"),
    ],
    [],
    batch_processor,
    menu="Python-Fu/Batch"
)

# ---------------------------
# 2) Dataset Creator
# ---------------------------

def dataset_creator(img, layer, src_file, dst_folder,
                    prefix, count, out_format,
                    min_zoom, max_zoom,
                    min_rot, max_rot,
                    mirror_h, mirror_v):
    """
    Generate multiple augmented variants of a single image:
      - Random zoom and rotation within ranges
      - Optional horizontal/vertical mirroring
      - Save with prefix + zero-padded index
    """
    # Prepare output
    if not os.path.exists(dst_folder): os.makedirs(dst_folder)
    base = os.path.splitext(os.path.basename(src_file))[0]

    for i in range(count):
        img2 = pdb.gimp_file_load(src_file, src_file)
        drw2 = img2.active_layer
        w, h = img2.width, img2.height
        
        # Random zoom
        z = min_zoom + (max_zoom-min_zoom)*pdb.gimp_random()/32767.0
        pdb.gimp_image_scale(img2, int(w*z/100.0), int(h*z/100.0))
        
        # Random rotation
        ang = min_rot + (max_rot-min_rot)*pdb.gimp_random()/32767.0
        pdb.gimp_item_transform_rotate(drw2, ang*(3.14159/180.0), TRUE, w/2, h/2)
        
        # Mirror
        if mirror_h and pdb.gimp_random()%2 == 0:
            pdb.gimp_item_transform_flip_simple(drw2, ORIENTATION_HORIZONTAL, TRUE, 0)
        if mirror_v and pdb.gimp_random()%2 == 0:
            pdb.gimp_item_transform_flip_simple(drw2, ORIENTATION_VERTICAL, TRUE, 0)
        
        # Save
        idx = str(i+1).zfill(4)
        fname = "%s_%s.%s" % (prefix, idx, out_format.lower())
        fpath = os.path.join(dst_folder, fname)
        if out_format == 'JPEG':
            pdb.gimp_file_save(img2, drw2, fpath, '')
        elif out_format == 'PNG':
            pdb.file_png_save_defaults(img2, drw2, fpath, '')
        elif out_format == 'TIFF':
            pdb.file_tiff_save(img2, drw2, fpath, '')
        
        pdb.gimp_image_delete(img2)
    
    gimp.message("Dataset creato: %d immagini salvate" % count)

register(
    "python-fu-dataset-creator",
    "Crea immagini augmentate da un singolo file",
    "Genera versioni random di zoom, rotazione e mirror",
    "You","You","2025",
    "Dataset Creator...","*",
    [
        (PF_FILE, "src_file", "File sorgente", None),
        (PF_DIRNAME, "dst_folder", "Cartella destinazione", None),
        (PF_STRING, "prefix", "Prefisso nome", "img"),
        (PF_SPINNER, "count", "Numero immagini", 10, (1,1000,1)),
        (PF_OPTION, "out_format", "Formato output", 0, ['JPEG','PNG','TIFF']),
        (PF_SPINNER, "min_zoom", "Zoom minimo (%)", 80, (10,500,1)),
        (PF_SPINNER, "max_zoom", "Zoom massimo (%)", 120, (10,500,1)),
        (PF_SLIDER, "min_rot", "Rotazione minima (°)", -10, (-360,360,1)),
        (PF_SLIDER, "max_rot", "Rotazione massima (°)", 10, (-360,360,1)),
        (PF_TOGGLE, "mirror_h", "Mirror Orizzontale", False),
        (PF_TOGGLE, "mirror_v", "Mirror Verticale", False),
    ],
    [],
    dataset_creator,
    menu="Python-Fu/Augmentation"
)

main()
