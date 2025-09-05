// Image Augmentation Processor.jsx
// Version 2.1 - UI translated to English. Added option for multiple augmented outputs per source image.

#target photoshop
app.bringToFront();

(function () {
    // =================================================================================
    // ===== USER INTERFACE (UI) SETUP =====
    // =================================================================================
    var dlg = new Window('dialog', 'Image Processor and Augmenter');
    dlg.orientation = 'column';
    dlg.alignChildren = ['fill', 'top'];

    // --- Panel 1: Source ---
    var srcPanel = dlg.add('panel', undefined, '1. Source Folder');
    srcPanel.alignChildren = 'fill';
    srcPanel.orientation = 'row';
    var srcFld = srcPanel.add('edittext', undefined, ''); srcFld.enabled = false; srcFld.preferredSize.width = 250;
    var btnSrc = srcPanel.add('button', undefined, 'Browse...');
    var chkSub = srcPanel.add('checkbox', undefined, 'Include subfolders'); chkSub.value = true;
    btnSrc.onClick = function() {
        var f = Folder.selectDialog('Select the folder containing images to process');
        if (f) srcFld.text = f.fsName;
    };

    // --- Panel 2: Destination ---
    var dstPanel = dlg.add('panel', undefined, '2. Destination Folder');
    dstPanel.alignChildren = 'fill';
    dstPanel.orientation = 'row';
    var dstFld = dstPanel.add('edittext', undefined, ''); dstFld.enabled = false; dstFld.preferredSize.width = 250;
    var btnDst = dstPanel.add('button', undefined, 'Browse...');
    var chkStruct = dstPanel.add('checkbox', undefined, 'Keep folder structure'); chkStruct.value = true;
    btnDst.onClick = function() {
        var f = Folder.selectDialog('Select the folder to save the results');
        if (f) dstFld.text = f.fsName;
    };

    // --- Panel 3: Basic Transformations ---
    var transformPanel = dlg.add('panel', undefined, '3. Basic Transformations');
    transformPanel.alignChildren = 'fill';
    
    var resizeGroup = transformPanel.add('group');
    resizeGroup.orientation = 'row';
    var chkResize = resizeGroup.add('checkbox', undefined, 'Resize:');
    var edtResize = resizeGroup.add('edittext', undefined, '50%'); edtResize.characters = 8;
    resizeGroup.add('statictext', undefined, 'Aspect Ratio:');
    var ratioList = ['Keep', '1:1', '4:3', '3:2', '16:9'];
    var ddRatio = resizeGroup.add('dropdownlist', undefined, ratioList); ddRatio.selection = 0;

    var rotGroup = transformPanel.add('group');
    rotGroup.orientation = 'row';
    rotGroup.add('statictext', undefined, 'Rotate (deg):');
    var edtRot = rotGroup.add('edittext', undefined, '0'); edtRot.characters = 4;
    var chkFlipH = rotGroup.add('checkbox', undefined, 'Flip Horizontal');
    var chkFlipV = rotGroup.add('checkbox', undefined, 'Flip Vertical');
    
    // --- Panel 4: Augmentation Options ---
    var augPanel = dlg.add('panel', undefined, '4. Augmentation Options');
    augPanel.alignChildren = 'fill';

    // Blur
    var blurGroup = augPanel.add('group');
    blurGroup.orientation = 'row';
    var chkBlur = blurGroup.add('checkbox', undefined, 'Blur:');
    blurGroup.add('statictext', undefined, 'Radius (px):');
    var edtBlur = blurGroup.add('edittext', undefined, '1.5'); edtBlur.characters = 4;

    // Noise
    var noiseGroup = augPanel.add('group');
    noiseGroup.orientation = 'row';
    var chkNoise = noiseGroup.add('checkbox', undefined, 'Noise:');
    noiseGroup.add('statictext', undefined, 'Amount (%):');
    var edtNoise = noiseGroup.add('edittext', undefined, '5'); edtNoise.characters = 4;

    // Cutout
    var cutoutGroup = augPanel.add('group');
    cutoutGroup.orientation = 'row';
    var chkCutout = cutoutGroup.add('checkbox', undefined, 'Cutout:');
    cutoutGroup.add('statictext', undefined, 'Max Size (%):');
    var edtCutout = cutoutGroup.add('edittext', undefined, '25'); edtCutout.characters = 4;

    // Shear
    var shearGroup = augPanel.add('group');
    shearGroup.orientation = 'row';
    var chkShear = shearGroup.add('checkbox', undefined, 'Shear:');
    shearGroup.add('statictext', undefined, 'Angle (H/V):');
    var edtShearH = shearGroup.add('edittext', undefined, '5'); edtShearH.characters = 4;
    var edtShearV = shearGroup.add('edittext', undefined, '0'); edtShearV.characters = 4;

    // Brightness & Exposure
    var brightGroup = augPanel.add('group');
    brightGroup.orientation = 'row';
    var chkBright = brightGroup.add('checkbox', undefined, 'Brightness:');
    var edtBright = brightGroup.add('edittext', undefined, '10'); edtBright.characters = 4;
    var chkExposure = brightGroup.add('checkbox', undefined, 'Exposure:');
    var edtExposure = brightGroup.add('edittext', undefined, '0.2'); edtExposure.characters = 4;

    // --- Panel 5: File Naming & Output Format ---
    var outputPanel = dlg.add('panel', undefined, '5. Output Settings');
    outputPanel.alignChildren = 'fill';
    
    // NEW: Number of copies to generate
    var copiesGroup = outputPanel.add('group');
    copiesGroup.orientation = 'row';
    copiesGroup.add('statictext', undefined, 'Augmented copies per source image:');
    var edtCopies = copiesGroup.add('edittext', undefined, '1'); edtCopies.characters = 4;

    var renameGroup = outputPanel.add('group');
    renameGroup.add('statictext', undefined, 'Filename:');
    var edtPrefix = renameGroup.add('edittext', undefined, ''); edtPrefix.characters = 12;
    renameGroup.add('statictext', undefined, '(prefix)');
    var edtSuffix = renameGroup.add('edittext', undefined, '_aug'); edtSuffix.characters = 12;
    renameGroup.add('statictext', undefined, '(suffix)');
    
    var fmtGroup = outputPanel.add('group');
    fmtGroup.orientation = 'row';
    fmtGroup.add('statictext', undefined, 'Save as:');
    var chkJpg = fmtGroup.add('checkbox', undefined, 'JPEG'); chkJpg.value = true;
    var chkPng = fmtGroup.add('checkbox', undefined, 'PNG');
    var chkTif = fmtGroup.add('checkbox', undefined, 'TIFF');
    var chkPsd = fmtGroup.add('checkbox', undefined, 'PSD');
    var edtJpgQ = fmtGroup.add('edittext', undefined, '10'); edtJpgQ.characters = 3;
    fmtGroup.add('statictext', undefined, 'JPG Quality (1-12)');

    // --- Run / Cancel Buttons ---
    var btnGroup = dlg.add('group');
    btnGroup.alignment = 'right';
    btnGroup.add('button', undefined, 'Run', { name: 'ok' });
    btnGroup.add('button', undefined, 'Cancel', { name: 'cancel' });

    if (dlg.show() != 1) return; // Exit if user cancels

    // =================================================================================
    // ===== IMAGE PROCESSING FUNCTIONS =====
    // =================================================================================

    function collectFiles(folder, includeSubfolders) {
        var fileList = [];
        var items = folder.getFiles();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item instanceof File && item.name.match(/\.(jpg|jpeg|png|tif|tiff|psd)$/i)) {
                fileList.push(item);
            } else if (item instanceof Folder && includeSubfolders) {
                fileList = fileList.concat(collectFiles(item, includeSubfolders));
            }
        }
        return fileList;
    }

    function createDestinationFolder(sourceFile) {
        var rootDst = Folder(dstFld.text);
        if (!chkStruct.value) return rootDst;

        var rootSrc = Folder(srcFld.text);
        var relativePath = sourceFile.parent.fsName.replace(rootSrc.fsName, '');
        var targetFolder = new Folder(rootDst.fsName + relativePath);
        if (!targetFolder.exists) targetFolder.create();
        return targetFolder;
    }
    
    function applyBlur(doc, radius) {
        if (radius > 0) doc.activeLayer.applyGaussianBlur(radius);
    }

    function applyNoise(doc, amount) {
        if (amount > 0) doc.activeLayer.addNoise(amount, NoiseDistribution.GAUSSIAN, false);
    }

    function applyCutout(doc, maxPercentage) {
        if (maxPercentage <= 0) return;
        var docW = doc.width.as('px');
        var docH = doc.height.as('px');
        
        var cutoutW = docW * (Math.random() * maxPercentage / 100);
        var cutoutH = docH * (Math.random() * maxPercentage / 100);
        
        var x1 = Math.random() * (docW - cutoutW);
        var y1 = Math.random() * (docH - cutoutH);
        var x2 = x1 + cutoutW;
        var y2 = y1 + cutoutH;

        doc.selection.select([[x1, y1], [x2, y1], [x2, y2], [x1, y2]], SelectionType.REPLACE, 0, false);
        var black = new SolidColor();
        black.rgb.hexValue = '000000';
        doc.selection.fill(black);
        doc.selection.deselect();
    }

    function applyShear(doc, hAngle, vAngle) {
        if (hAngle == 0 && vAngle == 0) return;
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putEnumerated(charIDToTypeID("FTcs"), charIDToTypeID("QCSt"), charIDToTypeID("Qcsa"));
        var transformDesc = new ActionDescriptor();
        transformDesc.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Ang"), hAngle);
        transformDesc.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Ang"), vAngle);
        desc.putObject(charIDToTypeID("Tf  "), charIDToTypeID("Trnf"), transformDesc);
        executeAction(charIDToTypeID("Trnf"), desc, DialogModes.NO);
    }
    
    function applyBrightness(doc, value) {
        if (value != 0) doc.activeLayer.adjustBrightnessContrast(value, 0);
    }

    function applyExposure(doc, value) {
        if (value == 0) return;
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putClass(stringIDToTypeID("adjustmentLayer"));
        desc.putReference(charIDToTypeID("null"), ref);
        var adjDesc = new ActionDescriptor();
        var expDesc = new ActionDescriptor();
        expDesc.putDouble(charIDToTypeID("Exps"), value);
        expDesc.putDouble(charIDToTypeID("Ofst"), 0.0);
        expDesc.putDouble(charIDToTypeID("Gmmc"), 1.0);
        adjDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("exposure"), expDesc);
        desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("adjustmentLayer"), adjDesc);
        executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
        doc.activeLayer.merge();
    }

    function cropToRatio(doc, ratioStr) {
        var w = doc.width.as('px');
        var h = doc.height.as('px');
        var parts = ratioStr.split(':');
        var r = parseFloat(parts[0]) / parseFloat(parts[1]);

        var currentRatio = w / h;
        var newW, newH, cropRect;

        if (currentRatio > r) {
            newW = h * r;
            var x_offset = (w - newW) / 2;
            cropRect = [x_offset, 0, x_offset + newW, h];
        } else {
            newH = w / r;
            var y_offset = (h - newH) / 2;
            cropRect = [0, y_offset, w, y_offset + newH];
        }
        doc.crop(cropRect);
    }

    // =================================================================================
    // ===== MAIN BATCH LOGIC =====
    // =================================================================================
    
    var files = collectFiles(Folder(srcFld.text), chkSub.value);
    if (files.length === 0) {
        alert("No image files found in the source folder.");
        return;
    }

    var numCopies = parseInt(edtCopies.text);
    if (isNaN(numCopies) || numCopies < 1) {
        numCopies = 1;
    }
    
    var totalFilesCreated = 0;

    // Outer loop: iterates through each source file
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        
        // Inner loop: creates the specified number of augmented copies
        for (var j = 0; j < numCopies; j++) {
            try {
                // IMPORTANT: Re-open the original file for each copy to start fresh
                var doc = open(file);

                // --- Apply transformations in a logical order ---

                if (chkResize.value && edtResize.text) {
                    var resizeVal = edtResize.text;
                    if (resizeVal.match(/%$/)) {
                        var percent = parseFloat(resizeVal) / 100;
                        doc.resizeImage(UnitValue(doc.width * percent, 'px'), null, null, ResampleMethod.BICUBIC);
                    } else if (resizeVal.match(/x/i)) {
                        var dims = resizeVal.split('x');
                        doc.resizeImage(UnitValue(dims[0], 'px'), UnitValue(dims[1], 'px'), null, ResampleMethod.BICUBIC);
                    }
                }
                
                if (ddRatio.selection.index > 0) {
                    cropToRatio(doc, ddRatio.selection.text);
                }

                var angle = parseFloat(edtRot.text);
                if (angle !== 0) doc.rotateCanvas(angle);
                if (chkFlipH.value) doc.flipCanvas(Direction.HORIZONTAL);
                if (chkFlipV.value) doc.flipCanvas(Direction.VERTICAL);

                // Augmentations
                if (chkShear.value) applyShear(doc, parseFloat(edtShearH.text), parseFloat(edtShearV.text));
                if (chkBlur.value) applyBlur(doc, parseFloat(edtBlur.text));
                if (chkNoise.value) applyNoise(doc, parseFloat(edtNoise.text));
                if (chkBright.value) applyBrightness(doc, parseInt(edtBright.text));
                if (chkExposure.value) applyExposure(doc, parseFloat(edtExposure.text));
                if (chkCutout.value) applyCutout(doc, parseFloat(edtCutout.text));

                // --- Saving ---
                var outFolder = createDestinationFolder(file);
                var baseName = file.name.replace(/\.[^.]+$/, '');
                // Add copy number to the filename if creating more than one copy
                var copySuffix = (numCopies > 1) ? '_' + (j + 1) : '';
                var newName = edtPrefix.text + baseName + edtSuffix.text + copySuffix;

                if (chkJpg.value) {
                    var jpgFile = new File(outFolder + '/' + newName + '.jpg');
                    var jpgOpts = new JPEGSaveOptions();
                    jpgOpts.quality = parseInt(edtJpgQ.text);
                    doc.saveAs(jpgFile, jpgOpts, true, Extension.LOWERCASE);
                }
                if (chkPng.value) {
                    var pngFile = new File(outFolder + '/' + newName + '.png');
                    doc.saveAs(pngFile, new PNGSaveOptions(), true, Extension.LOWERCASE);
                }
                if (chkTif.value) {
                    var tifFile = new File(outFolder + '/' + newName + '.tif');
                    doc.saveAs(tifFile, new TiffSaveOptions(), true, Extension.LOWERCASE);
                }
                if (chkPsd.value) {
                    var psdFile = new File(outFolder + '/' + newName + '.psd');
                    doc.saveAs(psdFile, new PhotoshopSaveOptions(), true, Extension.LOWERCASE);
                }

                doc.close(SaveOptions.DONOTSAVECHANGES);
                totalFilesCreated++;

            } catch (e) {
                // Log the error and continue with the next file/copy
                $.writeln("Error processing file: " + file.name + " (Copy " + (j+1) + ") - " + e.message);
                if(doc) doc.close(SaveOptions.DONOTSAVECHANGES);
            }
        } // End of inner loop (copies)
    } // End of outer loop (files)

    alert('Processing complete!\n' + totalFilesCreated + ' files created from ' + files.length + ' source images.');

})();
