(function () {
    if (!window.QUIZ) {
        document.getElementById("quiz-title").textContent =
            "Не найдены данные теста. Сначала запустите QuizBackend.";
        return;
    }

    var quiz = window.QUIZ;
    var title = document.getElementById("quiz-title");
    var form = document.getElementById("quiz-form");

    document.title = quiz.title || "Quiz";
    title.textContent = quiz.heading || quiz.title || "Quiz";

    // ==========================================
    // ДОБАВЛЕНО: Логика переключения темной темы
    // ==========================================
    var themeBtn = document.getElementById("theme-toggle");
    
    // Если бэкенд передал "Style dark", сразу включаем темную тему
    if (quiz.style === "dark") {
        document.body.classList.add("dark");
        themeBtn.textContent = "☀️ Светлая тема";
    }

    // Обработчик клика по кнопке
    themeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            themeBtn.textContent = "☀️ Светлая тема";
        } else {
            themeBtn.textContent = "🌙 Темная тема";
        }
    });
    // ==========================================

    quiz.questions.forEach(function (question, questionIndex) {
        var section = document.createElement("section");
        section.className = "question";
        section.dataset.type = question.type;

        var heading = document.createElement("h2");
        heading.textContent = (questionIndex + 1) + ". " + question.text;
        section.appendChild(heading);

        if (question.type === "t") {
            var textInput = document.createElement("input");
            textInput.type = "text";
            textInput.className = "text-answer";
            section.appendChild(textInput);
        } else {
            question.options.forEach(function (option, optionIndex) {
                var label = document.createElement("label");
                label.className = "option";

                var input = document.createElement("input");
                input.type = question.type === "r" ? "radio" : "checkbox";
                input.name = "question-" + questionIndex;
                input.value = optionIndex;

                label.appendChild(input);
                label.appendChild(document.createTextNode(" " + option.text));
                section.appendChild(label);
            });
        }

        form.appendChild(section);
    });

    document.getElementById("check-button").addEventListener("click", function () {
        var score = 0;

        quiz.questions.forEach(function (question, questionIndex) {
            var section = form.children[questionIndex];
            var correct;

            if (question.type === "t") {
                var input = section.querySelector(".text-answer");
                correct = normalize(input.value) === normalize(question.answer);
            } else {
                var inputs = section.querySelectorAll("input");
                correct = true;

                question.options.forEach(function (option, optionIndex) {
                    var selected = inputs[optionIndex].checked;
                    if (selected !== option.correct) {
                        correct = false;
                    }
                });
            }

            if (correct) {
                score++;
            }
        });

        document.getElementById("result").textContent =
            "Результат: " + score + " из " + quiz.questions.length;
    });

    function normalize(value) {
        return value.trim().replace(/\s+/g, " ").toLowerCase();
    }
})();
