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
        } else if (question.type === "m") {
            // ДОБАВЛЕНО: отрисовка таблицы
            var table = document.createElement("table");
            table.className = "matching-table";

            // Перемешиваем правую колонку для усложнения
            var shuffledRight = question.rightColumn.slice().sort(function() { return 0.5 - Math.random(); });

            question.leftColumn.forEach(function(leftText) {
                var tr = document.createElement("tr");
                var tdLeft = document.createElement("td");
                tdLeft.textContent = leftText;

                var tdRight = document.createElement("td");
                var select = document.createElement("select");
                select.className = "matching-select";

                var defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "-- Выберите --";
                select.appendChild(defaultOption);

                shuffledRight.forEach(function(rightText) {
                    var option = document.createElement("option");
                    option.value = rightText;
                    option.textContent = rightText;
                    select.appendChild(option);
                });

                tdRight.appendChild(select);
                tr.appendChild(tdLeft);
                tr.appendChild(tdRight);
                table.appendChild(tr);
            });
            section.appendChild(table);
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
            } else if (question.type === "m") {
                // ДОБАВЛЕНО: проверка таблицы
                var selects = section.querySelectorAll(".matching-select");
                correct = true;
                question.leftColumn.forEach(function(leftText, index) {
                    var expectedAnswer = question.rightColumn[index];
                    if (selects[index].value !== expectedAnswer) {
                        correct = false;
                    }
                });
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