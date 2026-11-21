window.QUIZ = {
  title: "Мой тест",
  heading: "Проверка знаний",
  questions: [
    {
      text: "2+2=",
      type: "r",
      options: [
        { text: "4", correct: true },
        { text: "5", correct: false },
        { text: "6", correct: false }
      ]
    },
    {
      text: "Столица Франции?",
      type: "t",
      answer: "Париж"
    },
    {
      text: "Соотнесите столицы и страны",
      type: "m",
      leftColumn: ["Россия", "Франция"],
      rightColumn: ["Москва", "Париж"]
    }
  ]
};
