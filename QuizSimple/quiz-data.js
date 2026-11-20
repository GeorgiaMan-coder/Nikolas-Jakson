window.QUIZ = {
  title: "My quiz",
  heading: "Super Test",
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
      text: "Choose prime numbers",
      type: "c",
      options: [
        { text: "2", correct: true },
        { text: "4", correct: false },
        { text: "5", correct: true },
        { text: "9", correct: false }
      ]
    },
    {
      text: "What is the capital of France?",
      type: "t",
      answer: "Paris"
    }
  ]
};
