/**
 * Converts an object of style properties to an inline style string
 * @param {} inlineObj - object of styles properties
 * @returns {string} - inline style string
 */
function inlineStyleDict(inlineObj) {
    return Object.entries(inlineObj).reduce((acc, [key, value]) => {
        return `${acc}${key}:${value};`;
    }, "");
}

/**
 * Returns a VIData object parsed from raw data
 * @param {any} rawData - Raw data from either default-data.js or injected
 * @returns {VIData}
 */
function parseRawData(rawData) {
    let fp = rawData["FP"];
    let bd = rawData["BD"];
    let options = rawData["Options"];
    let metadata = rawData["Metadata"];
    return {
        fp: {
            color: fp["Color"],
            image: fp["Image"],
            bounds: {
                width: fp["Bounds"]["Width"],
                height: fp["Bounds"]["Height"],
            },
            position: {
                left: fp["Position"]["Left"],
                top: fp["Position"]["Top"],
            },
            tldUID: "-1-0",
            structureToDiagrams: fp["PageSelector to Pages"].reduce((acc, item) => {
                const pgData = item["PageSelector Data"];
                acc[item["UID"]] = {
                    position: {
                        left: pgData["Position"]["Left"],
                        top: pgData["Position"]["Top"],
                    },
                    bounds: {
                        width: pgData["Bounds"]["Width"],
                        height: pgData["Bounds"]["Height"],
                    },
                    defaultFrame: pgData["Default Page"],
                    diagramData: pgData["Page Images"].map((page, index) => ({
                        uid: item["UID"] + "-" + index,
                        diagramImage: page,
                    })),
                };
                return acc;
            }, {}),
            diagramToStructures: fp["Page to PageSelectors"].reduce((acc, item) => {
                const pageUID = item["PageSelector"]["UID"] + "-" + item["PageSelector"]["Page Index"];
                acc[pageUID] = item["PageSelector UID"];
                return acc;
            }, {}),
        },
        bd: {
            color: bd["Color"],
            image: bd["Image"],
            bounds: {
                width: bd["Bounds"]["Width"],
                height: bd["Bounds"]["Height"],
            },
            position: {
                left: bd["Position"]["Left"],
                top: bd["Position"]["Top"],
            },
            tldUID: bd["TLD UID"],
            structureToDiagrams: bd["Structure to Diagram"].reduce((acc, item) => {
                const diagramGroup = item["Diagram Group"];
                acc[item["UID"]] = {
                    position: {
                        top: diagramGroup["Position"]["Top"],
                        left: diagramGroup["Position"]["Left"],
                    },
                    bounds: {
                        width: diagramGroup["Bounds"]["Width"],
                        height: diagramGroup["Bounds"]["Height"],
                    },
                    defaultFrame: diagramGroup["Default Frame"],
                    diagramData: diagramGroup["Diagram Data"].map(diagram => ({
                        uid: diagram["UID"],
                        diagramImage: diagram["Diagram Image"],
                    })),
                };
                return acc;
            }, {}),
            diagramToStructures: bd["Diagram to Structure"].reduce((acc, item) => {
                acc[item["Diagram UID"]] = item["Diagram Children"];
                return acc;
            }, {}),
        },
        metadata: {
            name: metadata["VI Name"],
            description: metadata["Description"],
            image: metadata["Image"],
        },
        options: {
            defaultTab: options["Default Tab"],
            disabledTabs: options["Disabled Tabs"],
        }
    };
}

/**
 * Traverses the diagram and structure data to build a nested structure
 * @param {Object} structureToDiagrams - Mapping of structure UIDs to their data
 * @param {Object} diagramToStructures - Mapping of diagram UIDs to their child structures
 * @param {string} diagramUID - The UID of the current diagram to traverse
 * @param {Object} parentPosition - The position of the parent structure for relative positioning
 * @returns {Array} - Array of nested structures
 */
function traverseDiagram(structureToDiagrams, diagramToStructures, diagramUID, parentPosition) {
    if (diagramUID in diagramToStructures) {
        return diagramToStructures[diagramUID].map(structureUID => traverseStructure(structureToDiagrams, diagramToStructures, structureUID, parentPosition));
    } else {
        return [];
    }
}

/**
 * Traverses a structure and its associated diagrams recursively
 * @param {Object} structureToDiagrams - Mapping of structure UIDs to their data
 * @param {Object} diagramToStructures - Mapping of diagram UIDs to their child structures
 * @param {string} structureUID - The UID of the current structure to traverse
 * @param {Object} parentPosition - The position of the parent structure for relative positioning
 * @returns {Object} - The nested structure with its diagrams and child structures
 */
function traverseStructure(structureToDiagrams, diagramToStructures, structureUID, parentPosition) {
    let structureData = structureToDiagrams[structureUID];
    let diagrams = [];
    let currentPosition = {
        top: structureData.position.top,
        left: structureData.position.left
    };
    structureData.diagramData.forEach(diagram => {
        diagrams.push({
            image: diagram.diagramImage,
            structures: traverseDiagram(structureToDiagrams, diagramToStructures, diagram.uid, currentPosition)
        });
    });
    return {
        top: structureData.position.top - parentPosition.top,
        left: structureData.position.left - parentPosition.left,
        width: structureData.bounds.width,
        height: structureData.bounds.height,
        diagrams: diagrams,
        defaultFrame: structureData.defaultFrame
    };
}

/**
 * Renders the nested structures and diagrams into HTML
 * @param {Array} structures - Array of structures to render
 * @returns {string} - HTML string representing the structures and diagrams
 */
function printStructures(structures) {
    let output = "";
    structures.forEach((structure) => {
        let defaultFrame = structure.defaultFrame;
        const structureStyle = {
            top: structure.top + "px",
            left: structure.left + "px",
            width: structure.width + "px",
            height: structure.height + "px",
        };
        output += `<div 
            class="structure" style="${inlineStyleDict(structureStyle)}" 
            data-diagrams="${structure.diagrams.length}"
            data-index="${defaultFrame}"
        >`;
        structure.diagrams.forEach((diagram, index) => {
            const diagramStyle = {
                width: structure.width + "px",
                height: structure.height + "px",
                background: `url(${diagram.image})`,
            };
            output += `<div 
                class="diagram${(index === defaultFrame) ? ' visible' : ''}" 
                style="${inlineStyleDict(diagramStyle)}"
            >`;
            output += printStructures(diagram.structures);
            output += '</div>';
        });
        output += `</div>`;
    });
    return output;
}

// Get raw data from injected script or default
const data = parseRawData(rawData);

/**
 * If Front Panel is not disabled, render it
 */
if (!data.options.disabledTabs.includes("FP")) {
    let structures = [];
    if (data.fp.tldUID in data.fp.diagramToStructures) {
        data.fp.diagramToStructures[data.fp.tldUID].forEach(structureUID => {
            structures.push(traverseStructure(data.fp.structureToDiagrams, data.fp.diagramToStructures, structureUID, { top: 0, left: 0 }));
        });
    }

    let $fpContainer = document.getElementById("fp-container");
    if (data.fp.image === "") {
        let output = `<div class="empty-msg">Front Panel is empty</div>`;
        $fpContainer.innerHTML = output;
    } else {
        let bgLeft = data.fp.position.left;
        let bgTop = data.fp.position.top;
        let bgWidth = data.fp.bounds.width;
        let bgHeight = data.fp.bounds.height;
        const fpStyle = {
            left: bgLeft + "px",
            top: bgTop + "px",
            width: bgWidth + "px",
            height: bgHeight + "px",
            background: `url(${data.fp.image})`,
        };
        let output = `<div style="${inlineStyleDict(fpStyle)}"></div>` + printStructures(structures);
        document.getElementById("top-level-fp").innerHTML = output;
        if (bgLeft < 0) {
            $fpContainer.style.left = (bgLeft * -1) + "px";
        }
        if (bgTop < 0) {
            $fpContainer.style.top = (bgTop * -1) + "px";
        }
    }
    $fpContainer.style.backgroundColor = "#" + data.fp.color;
}
/**
 * If Block Diagram is not disabled, render it
 */
if (!data.options.disabledTabs.includes("BD")) {
    let structures = [];
    if (data.bd.tldUID in data.bd.diagramToStructures) {
        data.bd.diagramToStructures[data.bd.tldUID].forEach(structureUID => {
            structures.push(traverseStructure(data.bd.structureToDiagrams, data.bd.diagramToStructures, structureUID, { top: 0, left: 0 }));
        });
    }

    let $bdContainer = document.getElementById("bd-container");
    if (data.bd.image === "") {
        let output = `<div class="empty-msg">Block Diagram is empty</div>`;
        $bdContainer.innerHTML = output;

    } else {
        let bgLeft = data.bd.position.left;
        let bgTop = data.bd.position.top;
        let bgWidth = data.bd.bounds.width;
        let bgHeight = data.bd.bounds.height;
        const bdStyle = {
            left: bgLeft + "px",
            top: bgTop + "px",
            width: bgWidth + "px",
            height: bgHeight + "px",
            background: `url(${data.bd.image})`,
        };
        let output = `<div style="${inlineStyleDict(bdStyle)}"></div>` + printStructures(structures);
        document.getElementById("top-level-diagram").innerHTML = output;
        if (bgLeft < 0) {
            $bdContainer.style.left = (bgLeft * -1) + "px";
        }
        if (bgTop < 0) {
            $bdContainer.style.top = (bgTop * -1) + "px";
        }
    }
    $bdContainer.style.backgroundColor = "#" + data.bd.color;
}

document.querySelectorAll(".structure").forEach(structureElem => {
    structureElem.addEventListener("click", (event) => {
        event.stopPropagation();
        let diagrams = parseInt(structureElem.getAttribute("data-diagrams"));
        let oldIndex = parseInt(structureElem.getAttribute("data-index"));
        let newIndex = (oldIndex + 1) % diagrams;
        structureElem.children[oldIndex].classList.remove("visible");
        structureElem.children[newIndex].classList.add("visible");
        structureElem.setAttribute("data-index", newIndex);
    });
});

let $viInfoContainer = document.getElementById("vi-info-container");

document.title = data.metadata.name;
let infoOutput = `<h2>${data.metadata.name}</h2>`;
if (data.metadata.image !== "") {
    infoOutput += `<img src="${data.metadata.image}">`;
}
infoOutput += `<h3>Description</h3>`;
infoOutput += `<p>"${data.metadata.description.replace(/(\r\n|\n)/g, "<br />")}"</p>`;
$viInfoContainer.innerHTML = infoOutput;

let $tabContainer = document.getElementById("tab-container");
document.querySelectorAll("#switcher button").forEach($btn => {
    let tabSelect = $btn.getAttribute("data-tab-select");
    if (data.options.disabledTabs.includes(tabSelect)) {
        $btn.setAttribute("disabled", true);
    }
    $btn.addEventListener("click", () => {
        $tabContainer.setAttribute("data-tab", tabSelect);
    });
});

let defaultTab = data.options.defaultTab;
if (data.options.disabledTabs.includes(defaultTab)) {
    defaultTab = "Info";
}
$tabContainer.setAttribute("data-tab", defaultTab);
