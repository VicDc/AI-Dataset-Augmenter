#target photoshop
app.bringToFront();

/**
 * Funzione Principale (Main)
 * Si auto-esegue all'avvio dello script.
 */
(function main() {
    // Controlla se ci sono documenti aperti per evitare conflitti
    if (app.documents.length > 0) {
        alert("Per favore, chiudi tutti i documenti aperti in Photoshop prima di eseguire lo script.");
        return;
    }

    // Valori di default per l'interfaccia utente
    var defaults = {
        versions: 10,
        prefix: "versione_",
        minRot: -15,
        maxRot: 15,
        minZoom: 100, // Default a 100% per non ridurre l'immagine di base
        maxZoom: 110,
        formatIndex: 0 // 0=JPG, 1=PNG, 2=TIFF
    };

    // Crea e mostra l'interfaccia utente
    var ui = createUI(defaults);
    var dialogResult = ui.show();

    // Se l'utente clicca "Esegui" (valore 1), avvia l'elaborazione
    if (dialogResult === 1) {
        var params = getUIParameters(ui);
        
        // Validazione dell'input prima di procedere
        if (!params.inputFile || !params.inputFile.exists) {
            alert("File di input non valido. Operazione annullata.");
            return;
        }
        if (!params.outputFolder) {
            alert("Nessuna cartella di destinazione selezionata. Operazione annullata.");
            return;
        }

        // Avvia l'elaborazione vera e propria
        runProcessing(params, ui.statusLabel);
    }
})();


// --- FUNZIONI DELLO SCRIPT ---

/**
 * Crea e configura la finestra dell'interfaccia utente.
 * @param {object} defaults - Oggetto con i valori di default per i campi.
 * @returns {Window} L'oggetto finestra (dialog) creato.
 */
function createUI(defaults) {
    var dlg = new Window("dialog", "Augment Image Pro");
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.spacing = 10;
    dlg.margins = 15;

    // --- Pannello File Input ---
    var filePanel = dlg.add("panel", undefined, "1. File Sorgente");
    filePanel.alignChildren = "left";
    filePanel.margins = 15;
    var fileGroup = filePanel.add("group");
    fileGroup.orientation = "row";
    dlg.filePath = fileGroup.add("edittext", [0, 0, 320, 25], "");
    dlg.filePath.active = true;
    var browseBtn = fileGroup.add("button", undefined, "Sfoglia...");

    // --- Pannello Opzioni di Output ---
    var outputPanel = dlg.add("panel", undefined, "2. Opzioni di Output");
    outputPanel.alignChildren = "left";
    outputPanel.margins = 15;
    
    var prefixGroup = outputPanel.add("group");
    prefixGroup.add("statictext", undefined, "Prefisso nome file:");
    dlg.prefix = prefixGroup.add("edittext", [0, 0, 150, 20], defaults.prefix);

    var versionsGroup = outputPanel.add("group");
    versionsGroup.add("statictext", undefined, "Numero di versioni:");
    dlg.numVersions = versionsGroup.add("edittext", [0, 0, 80, 20], defaults.versions);
    
    var formatGroup = outputPanel.add("group");
    formatGroup.add("statictext", undefined, "Formato di salvataggio:");
    dlg.format = formatGroup.add("dropdownlist", undefined, ["JPG", "PNG", "TIFF"]);
    dlg.format.selection = defaults.formatIndex;

    // --- Pannello Trasformazioni ---
    var transformPanel = dlg.add("panel", undefined, "3. Trasformazioni Casuali");
    transformPanel.alignChildren = "left";
    transformPanel.margins = 15;
    
    var rotationGroup = transformPanel.add("group");
    rotationGroup.add("statictext", undefined, "Rotazione (gradi):  Min");
    dlg.minRotation = rotationGroup.add("edittext", [0, 0, 50, 20], defaults.minRot);
    rotationGroup.add("statictext", undefined, "Max");
    dlg.maxRotation = rotationGroup.add("edittext", [0, 0, 50, 20], defaults.maxRot);
    
    var zoomGroup = transformPanel.add("group");
    zoomGroup.add("statictext", undefined, "Zoom (%):                 Min");
    dlg.minZoom = zoomGroup.add("edittext", [0, 0, 50, 20], defaults.minZoom);
    zoomGroup.add("statictext", undefined, "Max");
    dlg.maxZoom = zoomGroup.add("edittext", [0, 0, 50, 20], defaults.maxZoom);

    var mirrorGroup = transformPanel.add("group");
    mirrorGroup.add("statictext", undefined, "Applica effetto specchio (casuale):");
    dlg.mirrorH = mirrorGroup.add("checkbox", undefined, "Orizzontale");
    dlg.mirrorV = mirrorGroup.add("checkbox", undefined, "Verticale");
    
    // --- Status & Pulsanti ---
    dlg.statusLabel = dlg.add("statictext", [0, 0, 380, 20], "Pronto per iniziare...");
    dlg.statusLabel.justify = "center";
    
    var btnGroup = dlg.add("group");
    btnGroup.alignment = "right";
    btnGroup.add("button", undefined, "Esegui", { name: "ok" });
    btnGroup.add("button", undefined, "Annulla", { name: "cancel" });

    // --- Gestori di Eventi ---
    browseBtn.onClick = function() {
        var file = File.openDialog("Seleziona un'immagine");
        if (file) {
            dlg.filePath.text = file.fsName;
        }
    };

    return dlg;
}

/**
 * Raccoglie i parametri dall'interfaccia utente dopo che l'utente ha cliccato "Esegui".
 * @param {Window} ui - L'oggetto finestra (dialog).
 * @returns {object} Un oggetto contenente tutti i parametri necessari per l'elaborazione.
 */
function getUIParameters(ui) {
    return {
        inputFile: File(ui.filePath.text),
        outputFolder: Folder.selectDialog("Seleziona la cartella di destinazione"),
        numVersions: parseInt(ui.numVersions.text) || 1, // Default a 1 se l'input non è valido
        prefix: ui.prefix.text,
        format: ui.format.selection.text,
        minRot: parseFloat(ui.minRotation.text),
        maxRot: parseFloat(ui.maxRotation.text),
        minZoom: parseFloat(ui.minZoom.text),
        maxZoom: parseFloat(ui.maxZoom.text),
        applyMirrorH: ui.mirrorH.value,
        applyMirrorV: ui.mirrorV.value
    };
}

/**
 * Esegue il ciclo di elaborazione principale: apre, trasforma e salva le immagini.
 * @param {object} params - I parametri di configurazione raccolti dall'UI.
 * @param {StaticText} statusLabel - Il campo di testo dell'UI per aggiornare lo stato.
 */
function runProcessing(params, statusLabel) {
    var originalDoc = app.open(params.inputFile);
    
    unlockLayerIfNeeded(originalDoc);

    for (var i = 1; i <= params.numVersions; i++) {
        statusLabel.text = "Elaborazione in corso: " + i + " di " + params.numVersions + "...";
        app.refresh(); 

        var newDoc = originalDoc.duplicate();
        var newLayer = newDoc.activeLayer;

        // 1. Ottieni i valori casuali per le trasformazioni
        var rotationDegrees = getRandom(params.minRot, params.maxRot);
        var userZoomPercent = getRandom(params.minZoom, params.maxZoom);

        // 2. [NUOVA LOGICA] Calcola il fattore di scala geometrico per riempire l'area di lavoro.
        // Questa formula assicura che dopo la rotazione non ci siano angoli vuoti.
        // Funziona per immagini quadrate (1:1), come specificato nella richiesta originale.
        var rotationRadians = Math.abs(rotationDegrees * Math.PI / 180);
        var scaleToFill = Math.abs(Math.cos(rotationRadians)) + Math.abs(Math.sin(rotationRadians));

        // 3. Combina lo zoom dell'utente con il fattore di scala geometrico per ottenere lo zoom finale.
        var finalZoomPercent = userZoomPercent * scaleToFill;

        // 4. Applica le trasformazioni calcolate.
        // Applichiamo prima lo zoom e poi la rotazione. L'ordine qui non è critico
        // perché entrambe le operazioni sono relative al centro del livello.
        newLayer.resize(finalZoomPercent, finalZoomPercent, AnchorPosition.MIDDLECENTER);
        newLayer.rotate(rotationDegrees, AnchorPosition.MIDDLECENTER);
        
        // 5. Applica Effetto Specchio (con 50% di probabilità se l'opzione è attiva)
        if (params.applyMirrorH && Math.random() < 0.5) {
            newLayer.flip(Direction.HORIZONTAL);
        }
        if (params.applyMirrorV && Math.random() < 0.5) {
            newLayer.flip(Direction.VERTICAL);
        }

        // La funzione di crop è stata rimossa perché non più necessaria con questa nuova logica.

        // 6. Salva il file
        var fileName = params.prefix + pad(i, 4); 
        saveFile(newDoc, params.outputFolder, fileName, params.format);

        newDoc.close(SaveOptions.DONOTSAVECHANGES);
    }

    originalDoc.close(SaveOptions.DONOTSAVECHANGES);
    alert("Elaborazione completata!\n" + params.numVersions + " versioni create con successo nella cartella:\n" + params.outputFolder.fsName);
}

/**
 * Controlla se il livello attivo è un livello di sfondo bloccato e, in caso affermativo, lo sblocca.
 * @param {Document} doc - Il documento di Photoshop.
 */
function unlockLayerIfNeeded(doc) {
    if (doc.activeLayer.isBackgroundLayer) {
        doc.activeLayer.name = "Livello 0"; 
        doc.activeLayer.opacity = 100;
    }
}

/**
 * Salva il documento nel formato specificato dall'utente.
 * @param {Document} doc - Il documento da salvare.
 * @param {Folder} folder - La cartella di destinazione.
 * @param {string} fileName - Il nome del file senza estensione.
 * @param {string} format - Il formato di salvataggio ('JPG', 'PNG', 'TIFF').
 */
function saveFile(doc, folder, fileName, format) {
    var savePath = new File(folder.fsName + "/" + fileName);
    
    switch (format.toUpperCase()) {
        case 'JPG':
            var jpgOptions = new JPEGSaveOptions();
            jpgOptions.quality = 12; 
            jpgOptions.formatOptions = FormatOptions.STANDARDBASELINE;
            doc.saveAs(savePath, jpgOptions, true, Extension.LOWERCASE);
            break;
        case 'PNG':
            var pngOptions = new PNGSaveOptions();
            pngOptions.compression = 6; 
            pngOptions.interlaced = false;
            doc.saveAs(savePath, pngOptions, true, Extension.LOWERCASE);
            break;
        case 'TIFF':
            var tiffOptions = new TiffSaveOptions();
            tiffOptions.imageCompression = TIFFEncoding.TIFFLZW; 
            tiffOptions.saveLayers = false;
            doc.saveAs(savePath, tiffOptions, true, Extension.LOWERCASE);
            break;
    }
}

// --- FUNZIONI DI UTILITÀ ---

/**
 * Genera un numero casuale in un intervallo specificato.
 * @param {number} min - Il valore minimo dell'intervallo.
 * @param {number} max - Il valore massimo dell'intervallo.
 * @returns {number} Un numero casuale.
 */
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Aggiunge zeri iniziali a un numero per mantenere l'ordine dei file (padding).
 * @param {number} num - Il numero da formattare.
 * @param {number} size - La lunghezza totale desiderata per la stringa.
 * @returns {string} Il numero formattato come stringa con zeri iniziali.
 */
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}
