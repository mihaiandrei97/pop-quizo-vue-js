const API_URL = 'https://opentdb.com/api.php?amount=';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default async function getQuestions(amount) {
  const response = await fetch(`${API_URL}${amount}`);
  const json = await response.json();
  const result = json.results[0];
  return json.results.map((res) => ({
    question: res.question,
    answers: shuffleArray([...res.incorrect_answers, res.correct_answer]),
    correct_answer: res.correct_answer,
  }));
}
