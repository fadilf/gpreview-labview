# GPreview LabVIEW

Allows you to "print" VI files into interactive HTML files with browsable multi-frame structures like case structures and event structures.

Examples of interactive previews:
- [Almost Blank.vi](https://htmlpreview.github.io/?https://github.com/fadilf/gpreview-labview/blob/main/Test%20Cases/Almost%20Blank.html)
- [ControllerWorkerPattern 1.vi](https://htmlpreview.github.io/?https://github.com/fadilf/gpreview-labview/blob/main/Test%20Cases/ControllerWorkerPattern%201.html)
- [Many Nested Cases.vi](https://htmlpreview.github.io/?https://github.com/fadilf/gpreview-labview/blob/main/Test%20Cases/Many%20Nested%20Cases.html)

## Usage
`LabVIEWCLI -OperationName RunVI -PortNumber <port number> -VIPath <path to CLI.vi> <path to target VI file> <name of output HTML file>`

Example usage:

`LabVIEWCLI -OperationName RunVI -PortNumber 3364 -VIPath .\CLI.vi "C:\...\Test Cases\ControllerWorkerPattern 1.vi" "C:\...\Test Cases\ControllerWorkerPattern 1.html"`