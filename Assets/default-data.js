/**
 * @typedef {Object} Bounds
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Position
 * @property {number} left
 * @property {number} top
 */

/**
 * @typedef {Object} PageSelectorData
 * @property {string[]} pageImages
 * @property {string} defaultPage
 * @property {Position} position
 * @property {Bounds} bounds
 */

/**
 * @typedef {Object} Diagram
 * @property {string} uid
 * @property {string} diagramImage
 */

/**
 * @typedef {Object} DiagramGroup
 * @property {Position} position
 * @property {Bounds} bounds
 * @property {number} defaultFrame
 * @property {Diagram[]} diagramData
 */

/**
 * @typedef {Object} FP
 * @property {string} color
 * @property {string} image
 * @property {Bounds} bounds
 * @property {Position} position
 * @property {Object.<{uid: string, pageIndex: number}, string>} pageToPageSelector
 * @property {Object.<string, PageSelectorData>} pageSelectorToPage
 */

/**
 * @typedef {Object} BD
 * @property {string} color
 * @property {string} image
 * @property {Bounds} bounds
 * @property {Position} position
 * @property {string} tldUID
 * @property {Object.<string, DiagramGroup>} structureToDiagram
 * @property {Object.<string, string[]>} diagramToStructure
 */

/**
 * @typedef {Object} Metadata
 * @property {string} name
 * @property {string} description
 * @property {string} image
 */

/**
 * @typedef {Object} Options
 * @property {string} defaultTab
 * @property {string[]} disabledTabs
 */

/**
 * @typedef {Object} VIData
 * @property {FP} fp
 * @property {BD} bd
 * @property {Metadata} metadata
 * @property {Options} options
 */
let rawData;

rawData = {
    FP: {
        Bounds: {
            Width: 0,
            Height: 0,
        },
        Position: {
            Left: 0,
            Top: 0,
        },
        Color: "E2E2E2",
        Image: "",
        "Page to PageSelector": [],
        "PageSelector to Pages": [],
    },
    BD: {
        Bounds: {
            Width: 0,
            Height: 0,
        },
        Position: {
            Left: 0,
            Top: 0,
        },
        Color: "FFFFFF",
        Image: "",
        "Structure to Diagram": [],
        "Diagram to Structure": [],
    },
    Metadata: {
        Image: "",
        Description: "",
        "VI Name": "",
    },
    Options: {
        "Disabled Tabs": [],
        "Default Tab": "BD",
    },
};