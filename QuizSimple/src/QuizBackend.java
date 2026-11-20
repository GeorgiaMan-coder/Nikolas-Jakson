import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class QuizBackend {

    static class Question {
        String text;
        char type;
        List<String> options = new ArrayList<String>();
        List<Boolean> correct = new ArrayList<Boolean>();
        String textAnswer;

        Question(String text, char type) {
            this.text = text;
            this.type = type;
        }
    }

    public static void main(String[] args) {
        String inputFile = args.length > 0 ? args[0] : "input.txt";
        String outputFile = args.length > 1 ? args[1] : "quiz-data.js";

        try {
            List<String> lines = Files.readAllLines(
                    Paths.get(inputFile), StandardCharsets.UTF_8);

            String title = "Quiz";
            String heading = "Quiz";
            List<Question> questions = new ArrayList<Question>();
            Question current = null;

            for (int i = 0; i < lines.size(); i++) {
                String line = lines.get(i).trim();
                int lineNumber = i + 1;

                if (line.isEmpty()) {
                    continue;
                }

                if (line.startsWith("Title ")) {
                    title = line.substring(6).trim();
                    continue;
                }

                if (line.startsWith("H1 ")) {
                    heading = line.substring(3).trim();
                    continue;
                }

                // Вопрос: "? Текст вопроса r", где r, c или t — тип.
                if (line.startsWith("?")) {
                    if (current != null) {
                        questions.add(current);
                    }

                    String content = line.substring(1).trim();
                    int lastSpace = content.lastIndexOf(' ');

                    if (lastSpace < 0) {
                        throw new Exception("Строка " + lineNumber
                                + ": добавьте тип вопроса r, c или t");
                    }

                    String questionText = content.substring(0, lastSpace).trim();
                    String typeText = content.substring(lastSpace + 1).trim();

                    if (typeText.length() != 1
                            || "rct".indexOf(typeText.charAt(0)) < 0) {
                        throw new Exception("Строка " + lineNumber
                                + ": тип должен быть r, c или t");
                    }

                    current = new Question(questionText, typeText.charAt(0));
                    continue;
                }

                if (current == null) {
                    throw new Exception("Строка " + lineNumber
                            + ": сначала укажите вопрос");
                }

                if (current.type == 't') {
                    if (!line.startsWith("_")) {
                        throw new Exception("Строка " + lineNumber
                                + ": текстовый ответ должен начинаться с _");
                    }
                    current.textAnswer = line.substring(1).trim();
                    continue;
                }

                if (!line.startsWith("-")) {
                    throw new Exception("Строка " + lineNumber
                            + ": вариант ответа должен начинаться с -");
                }

                String option = line.substring(1).trim();
                boolean endOfOptions = false;

                // Поддерживаем окончания: "e", "+e" и " e".
                if (option.endsWith("+e")) {
                    option = option.substring(0, option.length() - 1).trim();
                    endOfOptions = true;
                } else if (option.equals("e")) {
                    option = "";
                    endOfOptions = true;
                } else if (option.endsWith(" e")) {
                    option = option.substring(0, option.length() - 2).trim();
                    endOfOptions = true;
                }


                boolean isCorrect = option.endsWith("+");
                if (isCorrect) {
                    option = option.substring(0, option.length() - 1).trim();
                }

                if (option.isEmpty()) {
                    throw new Exception("Строка " + lineNumber
                            + ": текст варианта ответа пустой");
                }

                current.options.add(option);
                current.correct.add(isCorrect);

                if (endOfOptions) {
                    current = finishQuestion(current, questions, lineNumber);
                }
            }

            if (current != null) {
                questions.add(current);
            }

            if (questions.isEmpty()) {
                throw new Exception("В файле нет вопросов");
            }

            String js = createJavaScript(title, heading, questions);

            Files.write(Paths.get(outputFile),
                    js.getBytes(StandardCharsets.UTF_8));

            System.out.println("Готово! Создан файл: " + outputFile);

        } catch (Exception e) {
            System.out.println("Ошибка: " + e.getMessage());
        }
    }

    private static Question finishQuestion(
            Question question, List<Question> questions, int lineNumber)
            throws Exception {

        checkQuestion(question, lineNumber);
        questions.add(question);
        return null;
    }

    private static void checkQuestion(Question question, int lineNumber)
            throws Exception {

        if (question.type == 't') {
            if (question.textAnswer == null || question.textAnswer.isEmpty()) {
                throw new Exception("Строка " + lineNumber
                        + ": не задан текстовый ответ");
            }
            return;
        }

        if (question.options.isEmpty()) {
            throw new Exception("Строка " + lineNumber
                    + ": у вопроса нет вариантов");
        }

        int correctCount = 0;
        for (Boolean value : question.correct) {
            if (value) {
                correctCount++;
            }
        }

        if (question.type == 'r' && correctCount != 1) {
            throw new Exception("Строка " + lineNumber
                    + ": у вопроса r должен быть ровно один правильный ответ");
        }

        if (question.type == 'c' && correctCount == 0) {
            throw new Exception("Строка " + lineNumber
                    + ": у вопроса c должен быть хотя бы один правильный ответ");
        }
    }

    private static String createJavaScript(
            String title, String heading, List<Question> questions)
            throws Exception {

        StringBuilder js = new StringBuilder();
        js.append("window.QUIZ = {\n");
        js.append("  title: \"").append(escape(title)).append("\",\n");
        js.append("  heading: \"").append(escape(heading)).append("\",\n");
        js.append("  questions: [\n");

        for (int i = 0; i < questions.size(); i++) {
            Question q = questions.get(i);

            // Проверяем также последний вопрос, если он не завершён новой строкой.
            checkQuestion(q, i + 1);

            js.append("    {\n");
            js.append("      text: \"").append(escape(q.text)).append("\",\n");
            js.append("      type: \"").append(q.type).append("\",\n");

            if (q.type == 't') {
                js.append("      answer: \"")
                        .append(escape(q.textAnswer)).append("\"\n");
            } else {
                js.append("      options: [\n");
                for (int j = 0; j < q.options.size(); j++) {
                    js.append("        { text: \"")
                            .append(escape(q.options.get(j)))
                            .append("\", correct: ")
                            .append(q.correct.get(j))
                            .append(" }");

                    if (j < q.options.size() - 1) {
                        js.append(",");
                    }
                    js.append("\n");
                }


                js.append("      ]\n");
            }

            js.append("    }");
            if (i < questions.size() - 1) {
                js.append(",");
            }
            js.append("\n");
        }

        js.append("  ]\n");
        js.append("};\n");
        return js.toString();
    }

    private static String escape(String text) {
        return text.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "")
                .replace("\n", "\\n");
    }
}





