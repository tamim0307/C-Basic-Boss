import { Topic, Problem, Difficulty } from '../types';
import { TOPICS as RAW_TOPICS } from './topicsData';

// Generate 10-15 Structured Missions for a Topic if not present
function generateMissionsForTopic(topic: Topic): Problem[] {
  const existing = topic.problems || [];
  if (existing.length >= 10) return existing;

  const missions: Problem[] = [...existing];
  const targetCount = 12; // 12 missions per topic

  for (let m = existing.length + 1; m <= targetCount; m++) {
    const diff: Difficulty = m <= 4 ? 'Easy' : m <= 8 ? 'Medium' : 'Hard';
    const isInputTopic = topic.name.toLowerCase().includes('scanf') || topic.categoryId >= 2;

    let title = `Mission ${m}: ${topic.name.replace(/^\d+\.\s*/, '')} Level ${m}`;
    let statement = `Write a C program to solve the Level ${m} task for ${topic.name}. `;
    let inputVal = '';
    let expectedVal = '';
    let starter = `#include <stdio.h>\n\nint main() {\n    // Write your code here for Mission ${m}\n    \n    return 0;\n}`;
    let solution = `#include <stdio.h>\n\nint main() {\n    printf("Mission ${m} Solved\\n");\n    return 0;\n}`;

    if (m === 2) {
      statement += 'Print the calculated value formatted with exact precision.';
      expectedVal = 'Result: 100';
      solution = `#include <stdio.h>\n\nint main() {\n    printf("Result: 100\\n");\n    return 0;\n}`;
    } else if (m === 3) {
      statement += 'Take an integer input and print its square value.';
      inputVal = '5';
      expectedVal = '25';
      solution = `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%d", n * n);\n    return 0;\n}`;
    } else if (m === 4) {
      statement += 'Check if the given number is positive, zero, or negative.';
      inputVal = '10';
      expectedVal = 'Positive';
      solution = `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    if (n > 0) printf("Positive");\n    else if (n < 0) printf("Negative");\n    else printf("Zero");\n    return 0;\n}`;
    } else if (m === 5) {
      statement += 'Calculate the sum of digits or formula result for the given input.';
      inputVal = '123';
      expectedVal = '6';
      solution = `#include <stdio.h>\n\nint main() {\n    int n, sum = 0;\n    scanf("%d", &n);\n    while (n > 0) { sum += n % 10; n /= 10; }\n    printf("%d", sum);\n    return 0;\n}`;
    } else if (m === 6) {
      statement += 'Print the sequence from 1 up to N separated by space.';
      inputVal = '5';
      expectedVal = '1 2 3 4 5';
      solution = `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        printf("%d%s", i, (i == n) ? "" : " ");\n    }\n    return 0;\n}`;
    } else if (m === 7) {
      statement += 'Find the maximum value among the given inputs.';
      inputVal = '15 42 28';
      expectedVal = '42';
      solution = `#include <stdio.h>\n\nint main() {\n    int a, b, c;\n    scanf("%d %d %d", &a, &b, &c);\n    int max = a;\n    if (b > max) max = b;\n    if (c > max) max = c;\n    printf("%d", max);\n    return 0;\n}`;
    } else if (m === 8) {
      statement += 'Demonstrate edge case handling and correct output formatting.';
      inputVal = '0';
      expectedVal = 'Valid 0';
      solution = `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("Valid %d", n);\n    return 0;\n}`;
    } else if (m === 9) {
      statement += 'Process an array or multi-value sequence accurately.';
      inputVal = '4\n10 20 30 40';
      expectedVal = 'Sum = 100';
      solution = `#include <stdio.h>\n\nint main() {\n    int n, sum = 0, val;\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &val);\n        sum += val;\n    }\n    printf("Sum = %d", sum);\n    return 0;\n}`;
    } else if (m === 10) {
      statement += 'Implement complex decision logic or pattern output.';
      inputVal = '3';
      expectedVal = '***';
      solution = `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++) printf("*");\n    return 0;\n}`;
    } else if (m === 11) {
      statement += 'Advanced Challenge Mission: Validate logic with strict efficiency.';
      inputVal = '7';
      expectedVal = 'Prime';
      solution = `#include <stdio.h>\n\nint main() {\n    int n, isP = 1;\n    scanf("%d", &n);\n    if (n < 2) isP = 0;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) { isP = 0; break; }\n    }\n    printf("%s", isP ? "Prime" : "Not Prime");\n    return 0;\n}`;
    } else {
      statement += 'Boss Level Mission: Combine multiple C concepts to master this topic!';
      inputVal = '100';
      expectedVal = 'Mastered';
      solution = `#include <stdio.h>\n\nint main() {\n    int score;\n    scanf("%d", &score);\n    if (score >= 80) printf("Mastered");\n    else printf("Keep Practicing");\n    return 0;\n}`;
    }

    missions.push({
      id: `p${topic.id}_${m}`,
      topicId: topic.id,
      missionNumber: m,
      title,
      difficulty: diff,
      statement,
      exampleInput: inputVal || undefined,
      exampleOutput: expectedVal,
      starterCode: starter,
      testCases: [{ id: `tc_${topic.id}_${m}`, input: inputVal, expectedOutput: expectedVal }],
      hints: [
        `Hint 1: Review the core concept of ${topic.name}.`,
        `Hint 2: Pay close attention to input format specifiers and variable types.`,
        `Hint 3: Ensure syntax like semicolons and return 0; are properly formatted.`,
      ],
      solutionCode: solution,
      explanationBangla: `এই মিশনে ${topic.name} সম্পর্কিত সমস্যাটি সমাধান করা হয়েছে। C ল্যাঙ্গুয়েজের নির্দিষ্ট নিয়মানুযায়ী কোডটি চালনা করা হয়েছে।`,
      lineByLineExplanation: [
        { line: 'Include Header', code: '#include <stdio.h>', explanation: 'Includes standard IO library.' },
        { line: 'Main Entry', code: 'int main()', explanation: 'Program execution start point.' },
        { line: 'Return Status', code: 'return 0;', explanation: 'Exits program safely.' },
      ],
      commonMistakes: ['Forgetting semicolons', 'Wrong format specifiers in scanf/printf'],
      keyConceptSummary: `Mastering ${topic.name} requires consistent practice and attention to C syntax rules.`,
    });
  }

  return missions;
}

// Generate exactly 30 MCQs for Topic Expert Test
function generate30SkillCheckQuestions(topic: Topic) {
  const questions = [];
  const name = topic.name.replace(/^\d+\.\s*/, '');

  const questionTemplates = [
    {
      q: `What is the primary purpose of ${name} in C programming?`,
      opts: [
        'To structure and execute logic according to C specifications',
        'To increase hardware CPU clock frequency directly',
        'To convert C code into HTML elements',
        'To format hard drives automatically',
      ],
      ans: 0,
      exp: `${name} is a fundamental concept in C used to structure and execute program logic.`,
    },
    {
      q: `Which header file is most frequently required when working with ${name}?`,
      opts: ['<stdlib.h>', '<stdio.h>', '<math.h>', '<string.h>'],
      ans: 1,
      exp: '<stdio.h> provides essential standard input/output functions in C.',
    },
    {
      q: `What happens if a required semicolon is missing at the end of a statement in ${name}?`,
      opts: [
        'Compiler error is generated at compile time',
        'The program executes with a warning',
        'The variable is deleted automatically',
        'The CPU restarts instantly',
      ],
      ans: 0,
      exp: 'C syntax strictly requires a semicolon at the end of every statement; missing it results in a syntax compilation error.',
    },
    {
      q: `Is C programming case-sensitive when writing keywords for ${name}?`,
      opts: [
        'Yes, C is strictly case-sensitive',
        'No, INT and int are identical',
        'Only in comments',
        'Only on Windows systems',
      ],
      ans: 0,
      exp: 'C is case-sensitive: int, INT, and Int are treated as completely different symbols.',
    },
    {
      q: `What is the return value of main() indicating a successful execution in standard C?`,
      opts: ['return -1;', 'return 1;', 'return 0;', 'return 100;'],
      ans: 2,
      exp: 'return 0; signals to the operating system that the program executed and terminated successfully.',
    },
    {
      q: `Which symbol is used for single-line comments in C code?`,
      opts: ['#', '//', '/*', '--'],
      ans: 1,
      exp: '// is used for single-line comments, while /* */ is used for multi-line comments.',
    },
    {
      q: `Which format specifier is used for printing integer variables in printf?`,
      opts: ['%f', '%c', '%d', '%s'],
      ans: 2,
      exp: '%d (or %i) is the standard format specifier for signed integers in C.',
    },
    {
      q: `Which format specifier is used for float variables in C?`,
      opts: ['%f', '%d', '%c', '%lf'],
      ans: 0,
      exp: '%f is used for float data types.',
    },
    {
      q: `Which symbol MUST be placed before a numeric variable in scanf()?`,
      opts: ['*', '&', '#', '$'],
      ans: 1,
      exp: 'The ampersand (&) address-of operator passes the memory location of the variable to scanf.',
    },
    {
      q: `What is the result of integer division 7 / 2 in C?`,
      opts: ['3.5', '3', '4', '3.0'],
      ans: 1,
      exp: 'In C, dividing two integers produces an integer by truncating the fractional part (7 / 2 = 3).',
    },
    {
      q: `What does the modulo operator % return in C?`,
      opts: ['Quotient', 'Remainder of integer division', 'Percentage', 'Exponent'],
      ans: 1,
      exp: 'The modulo operator % calculates the remainder after integer division.',
    },
    {
      q: `Which operator is used to compare if two values are equal in C?`,
      opts: ['=', '==', '===', 'equals'],
      ans: 1,
      exp: '== is the relational equality operator, whereas = is the assignment operator.',
    },
    {
      q: `What is the output of printf("%d", 5 == 5); in C?`,
      opts: ['true', '1', '5', '0'],
      ans: 1,
      exp: 'In C, true relational expressions evaluate to integer 1.',
    },
    {
      q: `What is the logical AND operator in C?`,
      opts: ['AND', '&', '&&', 'and'],
      ans: 2,
      exp: '&& is the logical AND operator in C.',
    },
    {
      q: `What is the logical OR operator in C?`,
      opts: ['||', 'OR', '|', 'or'],
      ans: 0,
      exp: '|| is the logical OR operator in C.',
    },
    {
      q: `Which statement is used to execute code conditionally in C?`,
      opts: ['if', 'loop', 'select', 'check'],
      ans: 0,
      exp: 'The if statement allows conditional branching.',
    },
    {
      q: `Which keyword is used as a default branch in switch statements?`,
      opts: ['else', 'default:', 'otherwise', 'finally'],
      ans: 1,
      exp: 'default: executes if no case matches in a switch statement.',
    },
    {
      q: `Which loop guarantees executing its code block AT LEAST ONCE in C?`,
      opts: ['for loop', 'while loop', 'do-while loop', 'foreach loop'],
      ans: 2,
      exp: 'The do-while loop evaluates its condition after executing the body, guaranteeing at least one execution.',
    },
    {
      q: `Which keyword exits a loop prematurely in C?`,
      opts: ['stop', 'exit', 'break', 'continue'],
      ans: 2,
      exp: 'break immediately terminates the loop execution.',
    },
    {
      q: `Which keyword skips the rest of the current loop iteration and proceeds to the next?`,
      opts: ['skip', 'continue', 'next', 'pass'],
      ans: 1,
      exp: 'continue skips the rest of the current loop iteration and moves to the next cycle.',
    },
    {
      q: `What is the index of the first element in a C array?`,
      opts: ['1', '0', '-1', 'Any index'],
      ans: 1,
      exp: 'C arrays are zero-indexed; the first element is at index 0.',
    },
    {
      q: `If an array is declared as int arr[5];, what is the valid index range?`,
      opts: ['1 to 5', '0 to 4', '0 to 5', '1 to 4'],
      ans: 1,
      exp: 'For size 5, valid indices are 0, 1, 2, 3, 4.',
    },
    {
      q: `Which null character marks the end of a string in C?`,
      opts: ['\\0', '\\n', 'NULL', '\\t'],
      ans: 0,
      exp: 'Strings in C are null-terminated character arrays ending with \\0.',
    },
    {
      q: `Which string function in <string.h> calculates string length?`,
      opts: ['length()', 'strlen()', 'size()', 'strcount()'],
      ans: 1,
      exp: 'strlen() returns the number of characters in a string excluding the null terminator.',
    },
    {
      q: `Which string function copies one string into another?`,
      opts: ['strcpy()', 'strcat()', 'strcmp()', 'strcopy()'],
      ans: 0,
      exp: 'strcpy(dest, src) copies src string into dest.',
    },
    {
      q: `Which string function compares two strings alphabetically?`,
      opts: ['strcompare()', 'strcmp()', 'strequal()', 'match()'],
      ans: 1,
      exp: 'strcmp() compares two strings and returns 0 if they are identical.',
    },
    {
      q: `What keyword is used when a function does NOT return any value in C?`,
      opts: ['null', 'empty', 'void', 'none'],
      ans: 2,
      exp: 'void specifies that a function returns no value.',
    },
    {
      q: `What is a parameter in a C function declaration?`,
      opts: [
        'A variable that receives an argument when function is called',
        'A compiler directive',
        'A global constant',
        'A memory allocation function',
      ],
      ans: 0,
      exp: 'Parameters are variables listed in the function definition that receive argument values when invoked.',
    },
    {
      q: `What is the purpose of return statement in a C function?`,
      opts: [
        'To send a value back to the caller and exit the function',
        'To print text on screen',
        'To restart the function',
        'To clear RAM memory',
      ],
      ans: 0,
      exp: 'return terminates function execution and returns a result to the calling function.',
    },
    {
      q: `What is the golden rule for mastering ${name} and C programming?`,
      opts: [
        'Practice coding regularly and analyze errors',
        'Memorize code without typing',
        'Avoid reading error messages',
        'Only watch videos without writing code',
      ],
      ans: 0,
      exp: 'Active coding, solving problems, and analyzing errors builds true programming mastery!',
    },
  ];

  for (let i = 0; i < 30; i++) {
    const tmpl = questionTemplates[i % questionTemplates.length];
    questions.push({
      id: `sc_${topic.id}_${i + 1}`,
      question: `Q${i + 1}: ${tmpl.q}`,
      options: tmpl.opts,
      correctOptionIndex: tmpl.ans,
      explanation: tmpl.exp,
    });
  }

  return questions;
}

// Export fully enriched topics dataset with 12 missions and 30 MCQs per topic
export const ENRICHED_TOPICS: Topic[] = RAW_TOPICS.map((topic) => {
  const problems = generateMissionsForTopic(topic);
  const skillCheckQuestions = generate30SkillCheckQuestions(topic);

  return {
    ...topic,
    totalProblems: problems.length,
    problems,
    skillCheckQuestions,
  };
});
