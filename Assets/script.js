
$fpContainer = document.getElementById("fp-container");
$fpContainer.style.backgroundColor = "#" + rawData["FP"]["Color"];
if (rawData["FP"]["Image"] === "") {
    $fpContainer.innerHTML = "Front Panel is empty";
} else {
    $fpContainer.innerHTML = `<img src="${rawData["FP"]["Image"]}" style="display:block;min-height:${rawData["FP"]["Bounds"]["Height"]}px;min-width:${rawData["FP"]["Bounds"]["Width"]}px" />`;
}

let structureMap = {};
rawData["Structure to Diagram"].forEach(item => {
    structureMap[item.UID] = item["Diagram Group"];
});
let diagramMap = {};
rawData["Diagram to Structure"].forEach(item => {
    diagramMap[item["Diagram UID"]] = item["Diagram Children"];
});

let structures = [];
function traverseDiagram(diagramUID, parentPosition) {
    if (diagramUID in diagramMap) {
        return diagramMap[diagramUID].map(structureUID => traverseStructure(structureUID, parentPosition));
    } else {
        return [];
    }
}
function traverseStructure(structureUID, parentPosition) {
    let structureData = structureMap[structureUID];
    let diagrams = [];
    let currentPosition = {
        "top": structureData["Position"]["Top"],
        "left": structureData["Position"]["Left"]
    };
    structureData["Diagram Data"].forEach(diagram => {
        diagrams.push({
            "image": diagram["Diagram Image"],
            "structures": traverseDiagram(diagram["UID"], currentPosition)
        });
    });
    return {
        "top": structureData["Position"]["Top"] - parentPosition["top"],
        "left": structureData["Position"]["Left"] - parentPosition["left"],
        "width": structureData["Bounds"]["Width"],
        "height": structureData["Bounds"]["Height"],
        "diagrams": diagrams,
        "defaultFrame": structureData["Default Frame"]
    };
}
rawData["Structure to Diagram"].forEach(item => {
    let structureUID = item["UID"];
    if (item["Diagram Group"]["Is on TLD?"]) {
        structures.push(traverseStructure(structureUID, { "top": 0, "left": 0 }));
    }
});

function printStructures(structures) {
    let output = "";
    structures.forEach((structure) => {
        let defaultFrame = structure["defaultFrame"];
        output += `<div class="structure" 
                style="top:${structure.top}px; left:${structure.left}px; width:${structure.width}px; height:${structure.height}px" 
                data-diagrams="${structure.diagrams.length}"
                data-index="${defaultFrame}">`;
        structure.diagrams.forEach((diagram, index) => {
            output += `<div class="diagram${(index === defaultFrame) ? ' visible' : ''}" 
                    style="background-image:url(${diagram.image}); width:${structure.width}px; height:${structure.height}px">`;
            output += printStructures(diagram.structures);
            output += '</div>';
        });
        output += `</div>`;
    });
    return output;
}

$bdContainer = document.getElementById("bd-container");
if (rawData["BD"]["Image"] === "") {
    let output = "Block Diagram is empty";
    $bdContainer.innerHTML = output;

} else {
    let bgLeft = rawData["BD"]["Position"]["Left"];
    let bgTop = rawData["BD"]["Position"]["Top"];
    let bgWidth = rawData["BD"]["Bounds"]["Width"];
    let bgHeight = rawData["BD"]["Bounds"]["Height"];
    let output = `<div style="left:${bgLeft}px;top:${bgTop}px;width:${bgWidth}px;height:${bgHeight}px;background-image:url(${rawData["BD"]["Image"]})"></div>` + printStructures(structures);
    document.getElementById("top-level-diagram").innerHTML = output;
    if (bgLeft < 0) {
        $bdContainer.style.left = (bgLeft * -1) + "px";
    }
    if (bgTop < 0) {
        $bdContainer.style.top = (bgTop * -1) + "px";
    }
}
document.body.style.backgroundColor = "#" + rawData["BD"]["Color"];


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

let metadata = rawData["Metadata"];
let infoOutput = `<h2>${metadata["VI Name"]}</h2>`;
if (metadata["Image"] !== "") {
    infoOutput += `<img src="${metadata["Image"]}">`;
}
infoOutput += `<h3>Description</h3>`;
infoOutput += `<p>"${metadata["Description"].replace(/(\r\n|\n)/g, "<br />")}"</p>`;
$viInfoContainer.innerHTML = infoOutput;

let $tabContainer = document.getElementById("tab-container");
document.querySelectorAll("#switcher button").forEach($btn => {
    $btn.addEventListener("click", () => {
        let tabSelect = $btn.getAttribute("data-tab-select");
        console.log($btn);
        $tabContainer.setAttribute("data-tab", tabSelect);
    });
});