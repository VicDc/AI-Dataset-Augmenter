#!/usr/bin/env python
# -*- coding: utf-8 -*-

# ##############################################################################
# Processore di Aumentazione Immagini per GIMP (Conversione da script Photoshop)
#
# Descrizione:
# Questo plug-in per GIMP replica le funzionalità di uno script di
# automazione per Photoshop. Permette di processare in batch le immagini
# da una cartella sorgente, applicare una serie di trasformazioni e
# "aumentazioni" (es. rumore, sfocatura, ritaglio), e salvare i risultati
# in una cartella di destinazione, con opzioni avanzate per la
# nomenclatura e il formato dei file.
#
# Come installarlo:
# 1. Assicurati di avere GIMP installato.
# 2. Trova la cartella dei plug-in di GIMP. Di solito si trova in:
#    - Windows: C:\Utenti\[TUO_NOME_UTENTE]\AppData\Roaming\GIMP\[VERSIONE]\plug-ins
#    - macOS: ~/Library/Application Support/GIMP/[VERSIONE]/plug-ins
#    - Linux: ~/.config/GIMP/[VERSIONE]/plug-ins
# 3. Copia questo file "image_augmentation_processor.py" in quella cartella.
# 4. Riavvia GIMP.
#
# Come usarlo:
# 1. Apri GIMP.
# 2. Troverai il nuovo strumento nel menu: File > Batch > Processore e Aumentatore Immagini...
# 3. Si aprirà una finestra di dialogo con tutte le opzioni. Configurala secondo
#    le tue necessità e clicca su "OK" per avviare il processo.
#
# ##############################################################################

import os
import random
from gimpfu import *

def python_image_augmentor(
    # Parametri UI (corrispondono all'interfaccia dello script originale)
    src_dir,
    dst_dir,
    include_subfolders,
    keep_structure,
    
    do_resize,
    resize_percent,
    aspect_ratio_index,
    
    rotation_angle,
    flip_h,
    flip_v,
    
    do_blur,
    blur_radius,
    
    do_noise,
    noise_amount,
    
    do_cutout,
    cutout_max_size,
    
    do_shear,
    shear_h_angle,
    shear_v_angle,
    
    do_brightness,
    brightness_value,
    
    do_exposure,
    exposure_value,
    
    num_copies,
    prefix,
    suffix,
    
    save_jpg,
    save_png,
    save_tif,
    save_psd,
    jpg_quality
):
    
    # Dizionario per le proporzioni
    aspect_ratios = {
        1: 1.0,     # 1:1
        2: 4.0/3.0, # 4:3
        3: 3.0/2.0, # 3:2
        4: 16.0/9.0 # 16:9
    }

    # --- 1. Raccolta dei file ---
    image_files = []
    valid_extensions = ('.jpg', '.jpeg', '.png', '.tif', '.tiff', '.psd', '.bmp', '.gif')
    
    if include_subfolders:
        for root, _, files in os.walk(src_dir):
            for f in files:
                if f.lower().endswith(valid_extensions):
                    image_files.append(os.path.join(root, f))
    else:
        for f in os.listdir(src_dir):
            if f.lower().endswith(valid_extensions):
                image_files.append(os.path.join(src_dir, f))

    if not image_files:
        gimp.message("Nessun file immagine trovato nella cartella di origine.")
        return

    total_files_to_process = len(image_files) * num_copies
    files_processed = 0
    
    gimp.progress_init("Elaborazione immagini in corso...")

    # --- 2. Logica di elaborazione principale ---
    for filepath in image_files:
        for i in range(num_copies):
            try:
                # Apre l'immagine originale per ogni copia
                image = pdb.gimp_file_load(filepath, filepath)
                drawable = pdb.gimp_image_get_active_layer(image)
                
                # Appiattisce le immagini con più livelli per semplicità
                if len(pdb.gimp_image_get_layers(image)[1]) > 1:
                    drawable = pdb.gimp_image_flatten(image)

                # --- 3. Applicazione delle trasformazioni ---

                # Ridimensionamento
                if do_resize:
                    width = image.width
                    height = image.height
                    new_width = int(width * (resize_percent / 100.0))
                    new_height = int(height * (resize_percent / 100.0))
                    pdb.gimp_image_scale(image, new_width, new_height)
                    drawable = pdb.gimp_image_get_active_layer(image)
                
                # Ritaglio per proporzioni
                if aspect_ratio_index > 0:
                    target_ratio = aspect_ratios[aspect_ratio_index]
                    w, h = image.width, image.height
                    current_ratio = float(w) / h
                    
                    if current_ratio > target_ratio:
                        new_w = int(h * target_ratio)
                        x_offset = int((w - new_w) / 2)
                        pdb.gimp_image_crop(image, new_w, h, x_offset, 0)
                    else:
                        new_h = int(w / target_ratio)
                        y_offset = int((h - new_h) / 2)
                        pdb.gimp_image_crop(image, w, new_h, 0, y_offset)
                    drawable = pdb.gimp_image_get_active_layer(image)
                
                # Rotazione e capovolgimento
                if rotation_angle != 0:
                    pdb.gimp_image_rotate(image, rotation_angle)
                    drawable = pdb.gimp_image_get_active_layer(image)
                if flip_h:
                    pdb.gimp_image_flip(image, 0) # 0 per orizzontale
                if flip_v:
                    pdb.gimp_image_flip(image, 1) # 1 per verticale
                
                # Distorsione (Shear)
                if do_shear:
                    # In GIMP, la distorsione è separata per orizzontale e verticale
                    if shear_h_angle != 0:
                         pdb.gimp_item_transform_shear(drawable, 0, shear_h_angle) # 0 = orizzontale
                    if shear_v_angle != 0:
                         pdb.gimp_item_transform_shear(drawable, 1, shear_v_angle) # 1 = verticale

                # Sfocatura
                if do_blur and blur_radius > 0:
                    pdb.plug_in_gauss(image, drawable, blur_radius, blur_radius, 0)

                # Rumore
                if do_noise and noise_amount > 0:
                    # GIMP non ha un rumore gaussiano diretto come Photoshop. Usiamo il rumore HSV.
                    # Il valore viene scalato da 0-100 a 0-1.
                    pdb.plug_in_hsv_noise(image, drawable, 0, 0, 0, noise_amount / 100.0)

                # Luminosità
                if do_brightness:
                    # GIMP usa un range da -1 a 1, Photoshop da -150 a 150. Scaliamo.
                    scaled_brightness = brightness_value / 150.0
                    pdb.gimp_brightness_contrast(drawable, scaled_brightness, 0)

                # Esposizione
                if do_exposure and exposure_value != 0:
                    # Il valore di esposizione in GIMP è in "stop" (potenze di 2)
                    pdb.gimp_exposure(drawable, exposure_value, 0)

                # Cutout
                if do_cutout and cutout_max_size > 0:
                    w, h = drawable.width, drawable.height
                    cut_w = int(w * (random.uniform(0, cutout_max_size) / 100.0))
                    cut_h = int(h * (random.uniform(0, cutout_max_size) / 100.0))
                    x1 = random.randint(0, w - cut_w)
                    y1 = random.randint(0, h - cut_h)
                    pdb.gimp_context_set_foreground((0, 0, 0))
                    pdb.gimp_image_select_rectangle(image, 2, x1, y1, cut_w, cut_h) # 2 = REPLACE
                    pdb.gimp_edit_fill(drawable, 0) # 0 = FOREGROUND
                    pdb.gimp_selection_none(image)

                # --- 4. Salvataggio ---
                # Costruisce il percorso di destinazione
                dest_path = dst_dir
                if keep_structure:
                    relative_path = os.path.relpath(os.path.dirname(filepath), src_dir)
                    dest_path = os.path.join(dst_dir, relative_path)
                    if not os.path.exists(dest_path):
                        os.makedirs(dest_path)

                base_name = os.path.splitext(os.path.basename(filepath))[0]
                copy_suffix = '_' + str(i + 1) if num_copies > 1 else ''
                new_name = prefix + base_name + suffix + copy_suffix
                
                # Salva nei formati richiesti
                # Assicura che l'immagine sia in modalità RGB per la massima compatibilità
                pdb.gimp_image_convert_rgb(image)
                # Unisce i livelli prima di salvare
                final_drawable = pdb.gimp_image_flatten(image)

                if save_jpg:
                    save_path = os.path.join(dest_path, new_name + '.jpg')
                    pdb.file_jpeg_save(image, final_drawable, save_path, save_path, jpg_quality/12.0, 0, 1, 1, "", 0, 1, 0, 0)
                if save_png:
                    save_path = os.path.join(dest_path, new_name + '.png')
                    pdb.file_png_save(image, final_drawable, save_path, save_path, 0, 9, 1, 1, 1, 1, 1)
                if save_tif:
                    save_path = os.path.join(dest_path, new_name + '.tif')
                    pdb.file_tiff_save(image, final_drawable, save_path, save_path, 0) # 0 = no compression
                if save_psd:
                    save_path = os.path.join(dest_path, new_name + '.psd')
                    pdb.file_psd_save(image, final_drawable, save_path, save_path, 0)
                
                pdb.gimp_image_delete(image)
                
            except Exception as e:
                # In caso di errore, lo notifica e va avanti
                gimp.message("Errore durante l'elaborazione del file: " + filepath + "\n" + str(e))
                # Se un'immagine è ancora aperta in caso di errore, la chiude
                if 'image' in locals() and pdb.gimp_image_is_valid(image):
                    pdb.gimp_image_delete(image)

            files_processed += 1
            progress_percent = float(files_processed) / total_files_to_process
            gimp.progress_update(progress_percent)
            pdb.gimp_progress_set_text("Elaborato: " + os.path.basename(filepath) + " (copia " + str(i+1) + ")")

    gimp.progress_end()
    gimp.message("Elaborazione completata!\nCreati " + str(files_processed) + " file.")


# --- 5. Registrazione del plug-in in GIMP ---
register(
    "python_fu_image_augmentor", # Nome univoco del processo
    "Processore e Aumentatore Immagini", # Titolo per l'interfaccia
    """Elabora in batch le immagini applicando varie trasformazioni e aumentazioni.
Conversione di uno script per Photoshop.""", # Descrizione
    "Autore Convertito", # Autore
    "Copyright 2024", # Copyright
    "2024", # Data
    "Processore e Aumentatore Immagini...", # Etichetta nel menu
    "*", # Tipi di immagine supportati
    [
        # --- Sezione 1 & 2: Sorgente e Destinazione ---
        (PF_DIRNAME, "src_dir", "1. Cartella Sorgente:", os.path.expanduser("~")),
        (PF_DIRNAME, "dst_dir", "2. Cartella Destinazione:", os.path.expanduser("~")),
        (PF_BOOL, "include_subfolders", "Includi sottocartelle", True),
        (PF_BOOL, "keep_structure", "Mantieni struttura cartelle", True),
        
        # --- Sezione 3: Trasformazioni Base ---
        (PF_SPACER, "spacer1", "--- 3. Trasformazioni Base ---", None),
        (PF_BOOL, "do_resize", "Ridimensiona", False),
        (PF_SLIDER, "resize_percent", "Percentuale:", 50, (1, 200, 1)),
        (PF_OPTION, "aspect_ratio_index", "Proporzioni (dopo ridim.):", 0, ["Mantieni", "1:1", "4:3", "3:2", "16:9"]),
        (PF_SPINNER, "rotation_angle", "Rotazione (gradi):", 0, (-360, 360, 1)),
        (PF_BOOL, "flip_h", "Capovolgi Orizzontalmente", False),
        (PF_BOOL, "flip_v", "Capovolgi Verticalmente", False),

        # --- Sezione 4: Aumentazione ---
        (PF_SPACER, "spacer2", "--- 4. Opzioni di Aumentazione ---", None),
        (PF_BOOL, "do_blur", "Applica Sfocatura Gaussiana", False),
        (PF_FLOAT, "blur_radius", "Raggio Sfocatura (px):", 1.5, (0, 100, 0.1)),
        (PF_BOOL, "do_noise", "Aggiungi Rumore", False),
        (PF_SLIDER, "noise_amount", "Quantità Rumore (%):", 5, (0, 100, 1)),
        (PF_BOOL, "do_cutout", "Applica Cutout (area nera)", False),
        (PF_SLIDER, "cutout_max_size", "Dimensione Max Cutout (%):", 25, (0, 100, 1)),
        (PF_BOOL, "do_shear", "Applica Distorsione (Shear)", False),
        (PF_FLOAT, "shear_h_angle", "Angolo Orizz. (px):", 5, (-100, 100, 1)),
        (PF_FLOAT, "shear_v_angle", "Angolo Vert. (px):", 0, (-100, 100, 1)),
        (PF_BOOL, "do_brightness", "Regola Luminosità", False),
        (PF_SLIDER, "brightness_value", "Luminosità:", 0, (-150, 150, 1)),
        (PF_BOOL, "do_exposure", "Regola Esposizione", False),
        (PF_FLOAT, "exposure_value", "Esposizione (stop):", 0, (-5, 5, 0.1)),

        # --- Sezione 5: Output ---
        (PF_SPACER, "spacer3", "--- 5. Impostazioni di Output ---", None),
        (PF_SPINNER, "num_copies", "Copie aumentate per immagine:", 1, (1, 100, 1)),
        (PF_STRING, "prefix", "Prefisso nome file:", ""),
        (PF_STRING, "suffix", "Suffisso nome file:", "_aug"),
        
        # Formati di salvataggio
        (PF_BOOL, "save_jpg", "Salva come JPEG", True),
        (PF_BOOL, "save_png", "Salva come PNG", False),
        (PF_BOOL, "save_tif", "Salva come TIFF", False),
        (PF_BOOL, "save_psd", "Salva come PSD", False),
        (PF_SLIDER, "jpg_quality", "Qualità JPEG (1-12):", 10, (1, 12, 1)),
    ],
    [], # Risultati (nessuno)
    python_image_augmentor, # Funzione da eseguire
    menu="<Image>/File/Batch" # Posizione nel menu
)

if __name__ == "__main__":
    main()
