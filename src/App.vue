<template>
  <div
    id="app"
    class="w-full h-full flex flex-col items-center justify-center bg-blue-100"
  >
    <h1 v-if="!gameStarted || isFinished" class="text-4xl text-gray-700 mb-5">
      Pop Quizo: Explore & Play Fun Quizzes
    </h1>
    <form
      v-if="!gameStarted"
      @submit.prevent="loadQuestion()"
      class="flex flex-col items-center"
    >
      <label for="numberOfQuestions" class="text-2xl text-gray-700 mb-5"
        >How many questions would you like to try?</label
      >
      <input
        v-model="numberOfQuestions"
        class="p-5 center"
        type="text"
        id="numberOfQuestions"
        name="numberOfQuestions"
      />
      <button
        type="submit"
        class="mt-5 p-5 bg-blue-600 text-white hover:bg-blue-500  w-full"
      >
        Start
      </button>
    </form>
    <img
      v-if="loading"
      id="loadingImage"
      src="https://i.imgur.com/LVHmLnb.gif"
    />
    <section
      v-if="gameStarted && !loading"
      class="score bg-blue-600 p-10 mb-4 w-full flex justify-center items-center text-white"
    >
      <div class="mr-6 flex items-center justify-center content-center p-4">
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="css-i6dzq1"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="text-xl">{{ nbOfCorectAnswers }} correct</span>
      </div>
      <div class="mr-6 flex items-center justify-center content-center p-4">
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="css-i6dzq1"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="text-xl">{{ nbOfWrongAnswers }} wrong</span>
      </div>
    </section>
    <section
      v-if="gameStarted && !loading && !isFinished"
      class="quiz border-solid border-2 border-gray-100 p-5 relative bg-white rounded"
    >
      <span class="text-xl text-gray-400"
        >Question {{ currentQuestion }} (
        {{ numberOfQuestions - currentQuestion }} remaining )</span
      >
      <h2 class="text-2xl mt-4 mb-4 text-gray-700" v-html="question"></h2>
      <ul class="answers">
        <li
          class="cursor-pointer text-xl text-red-900 rounded p-2 hover:bg-blue-700 hover:text-white "
          :class="[
            index == indexOfAnswer && index != indexOfCorectAnswer
              ? 'bg-red-300'
              : '',
            index == indexOfCorectAnswer ? 'bg-green-300' : '',
          ]"
          v-for="(answer, index) in answers"
          @click="checkAnswer(answer, index)"
          :key="answer"
        >
          <p v-html="answer"></p>
        </li>
      </ul>
      <button
        v-if="isResponded"
        class="mt-5 p-5 bg-indigo-700 text-white hover:bg-indigo-600"
        @click="nextQuestion"
      >
        Next
      </button>
    </section>
  </div>
</template>

<script>
import getQuestions from './api';

export default {
  name: 'App',
  data: () => ({
    gameStarted: false,
    loading: false,
    answers: [],
    question: '',
    correct_answer: '',
    isResponded: false,
    currentQuestion: 1,
    numberOfQuestions: null,
    indexOfCorectAnswer: null,
    indexOfAnswer: null,
    isFinished: false,
    nbOfCorectAnswers: 0,
    nbOfWrongAnswers: 0,
  }),
  methods: {
    async loadQuestion() {
      this.loading = true;
      this.gameStarted = true;
      const response = await getQuestions(1);
      this.answers = response[0].answers;
      this.question = response[0].question;
      this.correct_answer = response[0].correct_answer;
      this.loading = false;
      console.log(this.question);
    },
    checkAnswer(answer, index) {
      if (this.isResponded) {
        return;
      }

      this.isResponded = true;
      if (answer === this.correct_answer) {
        this.indexOfCorectAnswer = index;
        this.indexOfAnswer = index;
        this.nbOfCorectAnswers = this.nbOfCorectAnswers + 1;
      } else {
        this.indexOfCorectAnswer = this.answers.indexOf(this.correct_answer);
        this.indexOfAnswer = index;
        this.nbOfWrongAnswers = this.nbOfWrongAnswers + 1;
      }
    },
    async nextQuestion() {
      this.resetState();

      if (this.numberOfQuestions - this.currentQuestion === 0) {
        this.isFinished = true;
      } else {
        await this.loadQuestion();
        this.currentQuestion = this.currentQuestion + 1;
      }
    },
    resetState() {
      this.isResponded = false;
      this.question = '';
      this.answers = '';
      this.correct_answer = '';
      this.message = '';
      this.indexOfAnswer = null;
      this.indexOfCorectAnswer = null;
    },
  },
};
</script>

<style>
body {
  width: 100vw;
  height: 100vh;
}
.quiz {
  top: -40px;
}
</style>
