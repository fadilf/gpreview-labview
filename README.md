# GPreview LabVIEW

Allows you to "print" VI files into interactive HTML files with browsable multi-frame structures like case structures and event structures.

## Usage
`LabVIEWCLI -OperationName RunVI -PortNumber <port number> -VIPath <path to CLI.vi> <path to target VI file> <name of output HTML file>`

Example:
`LabVIEWCLI -OperationName RunVI -PortNumber 3364 -VIPath .\CLI.vi "C:\...\Test Cases\ControllerWorkerPattern 1.vi" "C:\...\Test Cases\ControllerWorkerPattern 1.html"`