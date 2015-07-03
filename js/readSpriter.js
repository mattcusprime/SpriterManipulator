/*var abar = require('address_bar');
var folder_view = require('folder_view');
var nwGui = require('nw.gui');
var fs = require('fs');*/
function processFolders(spriterObject, strUrlPrepend) {
    var arrFolderArray = [];
    if (typeof (strUrlPrepend) == 'undefined') {
        strUrlPrepend = '';
    };
    for (var i = 0; i < spriterObject.folder.length; i++) {

        for (var j = 0; j < spriterObject.folder[i].file.length; j++) {
            var objRow = {};
            objRow.Folder_id = spriterObject.folder[i].id;
            objRow.Folder_Name = spriterObject.folder[i].file[j].name;

            objRow.File_id = spriterObject.folder[i].file[j].id;
            objRow.File_Name = spriterObject.folder[i].file[j].name;
            objRow.Pivot_x = spriterObject.folder[i].file[j].pivot_x;
            objRow.Pivot_y = spriterObject.folder[i].file[j].pivot_y;
            objRow.Height = spriterObject.folder[i].file[j].height;
            objRow.Width = spriterObject.folder[i].file[j].width;
            for (var props in objRow) {
                var value = objRow[props];
                if (typeof (value) == 'undefined') {
                    objRow[props] = 'null';
                };
            };
            try {
                objRow.image = '<img src="' + strUrlPrepend + objRow.Folder_Name + '"/>';
            }
            catch (e) {
                console.log(e);
                objRow.image = 'image not found, try using a prepend string?';
                arrFolderArray.push(objRow);
                continue;
            };
            arrFolderArray.push(objRow);
        };

    };
    return arrFolderArray;
};
function processCharmaps(spriterObject, strUrlPrepend) {
    var arrCharMapArray = [];
    if (typeof (strUrlPrepend) == 'undefined') {
        strUrlPrepend = '';
    };
    for (var i = 0; i < spriterObject.entity.length; i++) {

        for (var j = 0; j < spriterObject.entity[i].character_map.length; j++) {
            for (var k = 0; k < spriterObject.entity[i].character_map[j].map.length; k++) {
                var objRow = {};
                objRow.character_map_name = spriterObject.entity[i].character_map[j].name;
                objRow.character_map_id = spriterObject.entity[i].character_map[j].id;
                objRow.fromFile_id = spriterObject.entity[i].character_map[j].map[k].file;
                objRow.fromFolder_id = spriterObject.entity[i].character_map[j].map[k].folder;
                objRow.toFile_id = spriterObject.entity[i].character_map[j].map[k].target_file;
                objRow.toFolder_id = spriterObject.entity[i].character_map[j].map[k].target_folder;
                for (var props in objRow) {
                    var value = objRow[props];
                    if (typeof (value) == 'undefined') {
                        objRow[props] = 'null';
                    };
                };
                //had to scan for the above in case of null values which would break the dataTables Pull
                try {
                    objRow.fromImage = '<img src="' + strUrlPrepend + spriterObject.folder[objRow.fromFolder_id].file[objRow.fromFile_id].name + '"/>';
                    objRow.toImage = '<img src="' + strUrlPrepend + spriterObject.folder[objRow.toFolder_id].file[objRow.toFile_id].name + '"/>';
                    objRow.toFileName = spriterObject.folder[objRow.toFolder_id].file[objRow.toFile_id].name;
                    objRow.fromFileName = spriterObject.folder[objRow.fromFolder_id].file[objRow.fromFile_id].name;
                }
                catch (e) {
                    console.log(e);
                    objRow.fromImage = 'image not found, try using a prepend string?';
                    objRow.toImage = 'image not found, try using a prepend string?';
                    objRow.toFileName = 'N/A';
                    objRow.fromFileName = 'N/A';
                    arrCharMapArray.push(objRow);
                    continue;
                };
                arrCharMapArray.push(objRow);
            };
        };

    };
    return arrCharMapArray;
};

function processBothDataSets(objSpriterObject, prependStringForImages) {
    if (typeof (prependStringForImages) == 'undefined') {
        prependStringForImages = '';
    };
    arrRowArr = processFolders(objSpriterObject, prependStringForImages);
    arrEntityRowArr = processCharmaps(objSpriterObject, prependStringForImages);
    //table.draw();
    $('#Folders').DataTable({
        "dom": "pfrti",
        "data": arrRowArr,
        //"ajax": "php/table.Folders.php",
        "columns": [
            {
                data: "Folder_id"
            },
            {
                data: "Folder_Name"
            },
            {
                data: "image"
            },
            {
                data: "File_id"
            },
            {
                data: "File_Name"
            },
            {
                data: "Pivot_x"
            },
            {
                data: "Pivot_y"
            },
            {
                data: "Height"
            },
            {
                data: "Width"
            }
        ]/*,
                    "tableTools": {
                        "sRowSelect": "os",
                        "aButtons": [
                            { "sExtends": "editor_create", "editor": editor },
                            { "sExtends": "editor_edit", "editor": editor },
                            { "sExtends": "editor_remove", "editor": editor }
                        ]
                    }*/
    });
    $('#charmaps').DataTable({
        "dom": "pfrti",
        "data": arrEntityRowArr,
        //"ajax": "php/table.Folders.php",
        "columns": [
            {
                data: "character_map_name"
            },
            {
                data: "character_map_id"
            },
            {
                data: "fromFile_id"
            },
            {
                data: "fromFolder_id"
            },
            {
                data: "toFile_id"
            },
            {
                data: "toFolder_id"
            },
            {
                data: "fromImage"
            },
            {
                data: "toImage"
            },
            {
                data: "fromFileName"
            },
            {
                data: "toFileName"
            }
        ]/*,
                    "tableTools": {
                        "sRowSelect": "os",
                        "aButtons": [
                            { "sExtends": "editor_create", "editor": editor },
                            { "sExtends": "editor_edit", "editor": editor },
                            { "sExtends": "editor_remove", "editor": editor }
                        ]
                    }*/
    });
};

function getSpriterFile(spriterFileUrl, prependStringForImages) {
    //charMapImagesAndSpriterFiles/womanWithPieceCharMap.scon
    
    var strReplaceFileTable = '<divclass="col-md-10 starter-template row"><table cellpadding="0"cellspacing="0"border="0"class="display"id="Folders"width="100%"><thead><tr><th>character_map_name</th><th>character_map_id</th><th>fromFolder_id</th><th>fromFolder_Name</th><th>toFolder_id</th><th>toFolder_Name</th></tr></thead><tbody></tbody></table></div>'
    var strReplaceCharTable = '<divclass="col-md-10 starter-template row"><table cellpadding="0"cellspacing="0"border="0"class="display"id="charmaps"width="100%"><thead><tr><th>character_map_name</th><th>character_map_id</th><th>fromFolder_id</th><th>fromFolder_Name</th><th>toFolder_id</th><th>toFolder_Name</th></tr></thead><tbody></tbody></table></div>'
    $.get(spriterFileUrl, function (data) { }).done(function (data) {

        objSpriterObject = JSON.parse(data);
        processBothDataSets(objSpriterObject,'charMapImagesAndSpriterFiles/');
    });
};


function readSingleFile(evt,objSpriterObj,prependUrl) {
    //Retrieve the first (and only!) File from the FileList object
    
    /*if (typeof (prependUrl) == 'undefined') {
        prependUrl = '';
    }
    else {
        localStorage.setItem('lastUrlString', prependUrl);
    };*/
    var f = evt.target.files[0];
    //var objFunctionObject = {};
    if (f) {
        var r = new FileReader();
        r.onloadend = function (e) {
            var contents = e.target.result;
            objSpriterObj = JSON.parse(contents);
            console.log(objSpriterObj)
            processBothDataSets(objSpriterObj, prependUrl);

        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }

};
