import { loadPyodide } from "pyodide";

let pyodideInstance = null;
let pyodideLoadingPromise = null;

export const initPyodide = async () => {
    if (pyodideInstance) return pyodideInstance;

    if (!pyodideLoadingPromise) {
        pyodideLoadingPromise = loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
        }).then(async (pyodide) => {
            // Pre-load common packages if needed here
            // await pyodide.loadPackage("micropip"); 
            pyodideInstance = pyodide;
            console.log("Pyodide Ready");
            return pyodide;
        });
    }

    return pyodideLoadingPromise;
};

export const executePython = async (code) => {
    try {
        const pyodide = await initPyodide();

        // Capture stdout
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);

        // Execute user code
        await pyodide.runPythonAsync(code); // Using runPythonAsync for async support

        // Retrieve stdout
        const output = pyodide.runPython("sys.stdout.getvalue()");

        return {
            success: true,
            output: output.trim(),
            error: null
        };
    } catch (error) {
        console.error("Pyodide Error:", error);
        return {
            success: false,
            output: "",
            error: error.message || String(error)
        };
    }
};
