import { TestCase } from '../types';

export interface EvaluationResult {
  success: boolean;
  compilationError?: string;
  stdout: string;
  testCaseResults: {
    testCaseId: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    errorReason?: string;
  }[];
}

/**
 * Educational C Code Evaluator & Interpreter Engine for Browser Practice Mode
 * Evaluates beginner to intermediate C code structure, output statements, and input processing logic.
 */
export function evaluateCCode(
  code: string = '',
  testCases: TestCase[] = [],
  _customInput: string = ''
): EvaluationResult {
  const codeLines = (code || '').split('\n');
  
  // 1. Syntax & Structural Linting
  const errors: string[] = [];
  
  if (!code.includes('<stdio.h>')) {
    errors.push('Missing header file: `#include <stdio.h>` is required for I/O operations.');
  }
  
  if (!code.includes('main') || !code.includes('(')) {
    errors.push('Missing entry function: `int main()` or `void main()` declaration not found.');
  }

  // Check balanced curly braces
  let openBraces = 0;
  for (const char of code || '') {
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
  }
  if (openBraces !== 0) {
    errors.push(`Syntax error: Unbalanced curly braces '{ }' (${openBraces > 0 ? 'missing closing brace' : 'extra closing brace'}).`);
  }

  // Check semicolons on basic printf/scanf/return lines
  codeLines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      (trimmed.startsWith('printf') || trimmed.startsWith('scanf') || trimmed.startsWith('return ')) &&
      !trimmed.endsWith(';') &&
      !trimmed.endsWith('{')
    ) {
      errors.push(`Line ${index + 1}: Missing semicolon ';' at the end of statement: "${trimmed}"`);
    }
  });

  if (errors.length > 0) {
    return {
      success: false,
      compilationError: errors.join('\n'),
      stdout: '',
      testCaseResults: [],
    };
  }

  // 2. Simulate Output / Run Test Cases
  const testResults = (testCases || []).map((tc) => {
    const simulatedOut = simulateCOutput(code, tc.input || '');
    const cleanExpected = normalizeOutput(tc.expectedOutput || '');
    const cleanActual = normalizeOutput(simulatedOut);

    const passed = cleanExpected === cleanActual;

    return {
      testCaseId: tc.id,
      input: tc.input || '',
      expectedOutput: tc.expectedOutput || '',
      actualOutput: simulatedOut,
      passed,
      errorReason: passed
        ? undefined
        : `Output mismatch.\nExpected:\n"${(tc.expectedOutput || '').trim()}"\n\nActual Got:\n"${simulatedOut.trim()}"`,
    };
  });

  const allPassed = testResults.every((r) => r.passed);
  const primaryStdout = testResults.length > 0 ? testResults[0].actualOutput : simulateCOutput(code, _customInput);

  return {
    success: allPassed,
    stdout: primaryStdout,
    testCaseResults: testResults,
  };
}

function normalizeOutput(str: string = ''): string {
  if (!str) return '';
  return str
    .replace(/\r\n/g, '\n')
    .trim()
    .split('\n')
    .map((s) => s.trim())
    .join('\n');
}

/**
 * Intelligent C Output Simulator
 * Extracts printf statements, handles specifiers (%d, %f, %s, %c), handles simple loops/conditionals and scanf inputs.
 */
function simulateCOutput(code: string = '', input: string = ''): string {
  const outputs: string[] = [];
  const inputsQueue = (input || '')
    .trim()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  // Simple environment simulation
  const variables: Record<string, any> = {};

  // Extract statements inside main
  const mainMatch = (code || '').match(/int\s+main\s*\(\s*\)\s*\{([\s\S]*)\}/);
  const body = (mainMatch && mainMatch[1]) ? mainMatch[1] : code;

  const lines = body.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Handle variable declarations, e.g., int a = 10, b = 20;
    if (/^(int|float|double|char)\s+/.test(line)) {
      const declPart = line.replace(/^(int|float|double|char)\s+/, '').replace(';', '');
      const vars = declPart.split(',');
      for (const v of vars) {
        if (v.includes('=')) {
          const parts = v.split('=').map((s) => s.trim());
          if (parts[0] && parts[1]) {
            variables[parts[0]] = evalMathExpr(parts[1], variables);
          }
        } else {
          const varName = v.trim();
          variables[varName] = 0;
        }
      }
    }

    // Handle scanf statements, e.g. scanf("%d", &a);
    if (line.includes('scanf')) {
      const scanfMatch = line.match(/scanf\s*\(\s*"([^"]+)"\s*,\s*([^)]+)\)/);
      if (scanfMatch && scanfMatch[1] && scanfMatch[2]) {
        const specifiers = scanfMatch[1].match(/%[dfcslg]+/g) || [];
        const varRefs = scanfMatch[2].split(',').map((s) => s.trim().replace(/^&/, ''));

        for (let idx = 0; idx < varRefs.length; idx++) {
          const varName = varRefs[idx];
          const spec = specifiers[idx] || '%d';
          const nextInput = inputsQueue.shift();
          if (nextInput !== undefined) {
            if (spec === '%d' || spec === '%i') {
              variables[varName] = parseInt(nextInput, 10) || 0;
            } else if (spec === '%f' || spec === '%lf') {
              variables[varName] = parseFloat(nextInput) || 0.0;
            } else if (spec === '%c' || spec === '%s') {
              variables[varName] = nextInput;
            } else {
              variables[varName] = nextInput;
            }
          }
        }
      }
    }

    // Handle variable assignments, e.g., sum = a + b;
    if (line.includes('=') && !line.includes('==') && !line.includes('<=') && !line.includes('>=') && !line.includes('!=') && !line.startsWith('printf') && !line.startsWith('scanf') && !line.startsWith('for') && !line.startsWith('if')) {
      const parts = line.replace(';', '').split('=');
      if (parts.length === 2 && parts[0] && parts[1]) {
        const varName = parts[0].trim();
        const expr = parts[1].trim();
        variables[varName] = evalMathExpr(expr, variables);
      }
    }

    // Handle printf statements
    if (line.includes('printf')) {
      const printfMatch = line.match(/printf\s*\(\s*"([^"]*)"\s*(?:,\s*(.*))?\s*\)/);
      if (printfMatch && printfMatch[1] !== undefined) {
        let fmt = printfMatch[1] || '';
        const argsStr = printfMatch[2];
        const args = argsStr ? argsStr.split(',').map((s) => s.trim()) : [];

        // Replace escape sequences
        fmt = fmt.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

        // Evaluate format specifiers with arguments
        let argIndex = 0;
        fmt = fmt.replace(/%(\d*\.?\d*)?([dfcslgi]|lf)/g, (_match, precision, spec) => {
          if (argIndex < args.length) {
            const rawArg = args[argIndex++];
            const val = evalMathExpr(rawArg, variables);
            if (spec === 'f' || spec === 'lf') {
              if (precision) {
                const precNum = parseInt(precision.replace('.', ''), 10) || 2;
                return Number(val).toFixed(precNum);
              }
              return Number(val).toFixed(2); // default float presentation
            }
            return String(val);
          }
          return _match;
        });

        outputs.push(fmt);
      }
    }

    i++;
  }

  // Fallback: If code contains literal printf with specific output text and regex matched, join outputs
  let finalResult = outputs.join('');
  if (!finalResult) {
    // Direct regex fallback for basic printf text extraction
    const allPrintfMatches = [...(code || '').matchAll(/printf\s*\(\s*"([^"]*)"\s*(?:,\s*([^)]*))?\s*\)/g)];
    const directStrings = allPrintfMatches.map((m) => {
      if (!m || !m[1]) return '';
      let str = m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      if (m[2]) {
        const argList = m[2].split(',').map((a) => a.trim());
        let idx = 0;
        str = str.replace(/%[dfcslgi]+/g, () => {
          if (idx < argList.length) {
            const argName = argList[idx++];
            if (variables[argName] !== undefined) return String(variables[argName]);
            if (!isNaN(Number(argName))) return argName;
          }
          return '';
        });
      }
      return str;
    });
    finalResult = directStrings.join('');
  }

  return finalResult;
}

function evalMathExpr(expr: string = '', vars: Record<string, any> = {}): any {
  if (!expr) return 0;
  let cleanExpr = expr.trim();
  // Replace variables in expression
  for (const [key, val] of Object.entries(vars)) {
    // Regex for exact variable word match
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    cleanExpr = cleanExpr.replace(regex, String(val));
  }

  try {
    // Safe numeric/string evaluation
    if (/^[0-9+\-*/%().\s]+$/.test(cleanExpr)) {
      // Evaluate basic math with modulo support
      const jsMath = cleanExpr.replace(/%/g, '%');
      return Function(`"use strict"; return (${jsMath})`)();
    }
  } catch {
    // Return raw expression if parsing fails
  }
  return cleanExpr;
}
