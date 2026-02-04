export const detectPatterns = (code) => {
    const patterns = {
        hasRecursion: false,
        hasBaseCase: false,
        hasLoopBreak: false,
        hasAsyncAwait: false,
        hasListComp: false,
        hasTryExcept: false,
        hasWhileLoop: false
    };

    if (!code) return patterns;

    // Detect Recursion: Function calling itself
    // Regex looks for "def funcName" and then "funcName(" inside body
    const functionDefRegex = /def\s+(\w+)\s*\(/g;
    let match;
    while ((match = functionDefRegex.exec(code)) !== null) {
        const funcName = match[1];
        // Simple check: does funcName appear again? 
        // This is a naive check; a real AST parser is better but Regex is fast for now.
        // We ensure it's a call by looking for funcName(
        const callRegex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
        const matches = code.match(callRegex);
        if (matches && matches.length > 1) { // 1 for def, >1 for calls
            patterns.hasRecursion = true;
        }
    }

    // Detect Base Case: "if ... return"
    // Looks for 'if' followed by 'return' on same or subsequent lines (simplified)
    const baseCaseRegex = /if\s+.*:[\s\n\r]*.*return/s;
    patterns.hasBaseCase = baseCaseRegex.test(code);

    // Detect Loop Break: "for/while ... break"
    const loopBreakRegex = /(for|while)\s+.*:[\s\S]*?break/g;
    patterns.hasLoopBreak = loopBreakRegex.test(code);

    // Detect List Comprehension: "[x for x in ...]"
    // Regex looks for brackets containing "for ... in"
    const listCompRegex = /\[.*for\s+.*\s+in\s+.*\]/;
    patterns.hasListComp = listCompRegex.test(code);

    // Detect Try/Except: "try: ... except:"
    const tryExceptRegex = /try\s*:[\s\S]+except\s*:/;
    patterns.hasTryExcept = tryExceptRegex.test(code);

    // Detect While Loop: "while ...:"
    const whileLoopRegex = /while\s+.*:/;
    patterns.hasWhileLoop = whileLoopRegex.test(code);

    return patterns;
};
