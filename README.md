# Quiz DSL Generator 
## Project Description
This is a group project developed as part of the university coursework. The application generates an interactive HTML/JavaScript quiz form based on a custom Domain-Specific Language (DSL). 

The project is divided into two main parts:
1. **Backend (Java):** Parses the input DSL text and converts it into a structured JSON/JS data format.
2. **Frontend (HTML/JS):** Reads the generated data and renders a dynamic, interactive quiz form with answer validation and theme switching.

## Group Members
* Ригвава - Backend Development (Java, Parser, Gson)
* Девочка пони - Frontend Development (HTML, CSS, JavaScript)
* Селиванов - Testing, Documentation, GitHub Pages deployment
  
## Tech Stack
* **Backend:** Java 8, Gson, Java Collections Framework, Stream API.
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES5/ES6).
* **Deployment:** GitHub Pages.

## DSL Syntax Guide
The custom DSL supports the following syntax:
* `Title [text]` - Sets the browser tab title.
* `H1 [text]` - Sets the main heading of the quiz.
* `Style dark` - Sets the visual theme.
* `? [Question text] [r|c|t]` - Starts a new question. `r` = radio (single choice), `c` = checkbox (multiple choice), `t` = text input.
* `- [Option text] [+]` - Adds an option to the question. `+` marks the correct answer. `e` at the end of the line marks the end of the options block.
* `_ [Answer text]` - Sets the correct answer for a text input question (`t`).

### Example Input (DSL)
```text
Title My title
H1 Super Test
Style default
? 2+2= r
- 4 +
- 5
- 6 e
? Second question c
- A
- B +
- C +e
? Text question t
_ My answer
Example Output (Generated Data)
The Java backend parses the text above and generates a data file (quiz.json or quiz-data.js), which is then consumed by the frontend.
{
  "title": "My title",
  "h1": "Super Test",
  "style": "default",
  "questions": [
    {
      "text": "2+2=",
      "type": "r",
      "options": [
        { "text": "4", "isCorrect": true },
        { "text": "5", "isCorrect": false },
        { "text": "6", "isCorrect": false }
      ]
    }
  ]
}
-----ИЗМЕНИТЬ----

How to Run
1. Run the Backend (Java)
Open the project in IntelliJ IDEA.

Ensure the input.dsl file is in the root directory of the Java project.

Run the Main.java file.

The program will generate a quiz.json (or quiz-data.js) file.

2. Run the Frontend (HTML/JS)
Place the generated data file in the same folder as index.html.

Open index.html in any modern web browser.

Alternatively, use GitHub Pages link: [Вставьте вашу ссылку на GitHub Pages сюда]
Screenshots of Results
![Uploading vcCNern6fOZfrIw844dZThHjAELlM82Kak1vCnyyFcAvU4y2bT0jKk2s_uH12uCTRVTYGl63WCFM2FUebj-MTN0R.jpg…]() - Example of the generated quiz form.
![Uploading YgbHgjn2i3XaFboBaClqjJ-zFIW-9IpgNUzBWt1wwi7ZbFX_kMtsjcFIa6Hvj2zttrc3WsQI-10LGaHU3QEbaaOU.jpg…]()  - Example of the dark theme and validation result.
Known Weaknesses and Limitations
During the defense, we will demonstrate the following weaknesses of our current implementation:

Strict Parsing Rules: If the input DSL misses the block ending character e, the parser may fail to recognize the end of the options list, causing subsequent questions to be parsed incorrectly.

No Escape Characters: If a question's text or an option ends with the character + or e, the parser might mistakenly identify it as a "correct answer" marker or an "end block" marker.

Lack of Error Handling: The Java parser does not currently validate the DSL structure deeply. For instance, if a question type is unknown (e.g., x instead of r/c/t), the program might generate malformed data instead of throwing a descriptive error.
# AI Prompts and Responses

During the development of this project, we utilized Large Language Models (LLMs) to assist with code generation, architecture design, and debugging. Below is the summarized log of how we used these tools.

## 1. Initial Code Generation (Backend & Frontend)
**Tool used:** DeepSeek
**Prompt:** 
"We need to create a Java 8 backend that parses a custom DSL text file and converts it into JSON, and an HTML/JS frontend to render it. Provide the class structure, the parser using Stream API, and the frontend code."

**AI Response Summary:**
The AI generated the initial boilerplate code. It provided the Java models (`Quiz`, `Question`, `Option`), a parser, and the base HTML/CSS/JS files to render the quiz form and validate answers.

## 2. Project Setup, Maven & Debugging
**Tool used:** DeepSeek
**Prompt:** 
"We are trying to set up the generated code in IntelliJ IDEA using Java 8 and Maven. We also need to add dynamic theme switching (Dark/Light mode) to the frontend. How do we configure `pom.xml` and implement the theme logic?"

**AI Response Summary:**
DeepSeek provided the correct `pom.xml` configuration for Java 1.8 and Gson. It also helped troubleshoot IDE folder structure issues (fixing the `ru.quiz` package structure) and provided the exact JavaScript and CSS logic to toggle the `dark` class on the `<body>` tag to switch themes dynamically.

## 3. Documentation & Deployment
**Tool used:** DeepSeek
**Prompt:** 
"How do we deploy this to GitHub Pages and what should a professional README.md look like for a university group project? Also, how do we prepare the prompts log?"

**AI Response Summary:**
DeepSeek explained how to enable GitHub Pages in the repository settings. It also generated a structured README template that includes the project description, tech stack, DSL syntax examples, and a section for known weaknesses, as required by our assignment.

---
*Note: The AI tools were used as assistants for code generation and troubleshooting. All code was reviewed, integrated, tested locally by the group members, and we understand the logic behind every file.*
