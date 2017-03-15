const answer1 = {
  id: 'ghj123',
  text: '12',
  correct: true,
}

const answer2 = {
  id: 'ghj124',
  text: '13',
  correct: false,
}

const answer3 = {
  id: 'rty123',
  text: 'expected answer',
  correct: true, // ALWAYS true
}

const questions = [
  {
    id: 'bnm123',
    text: 'How many ... ?',
    type: 'singlechoice',
    explanation: 'NO',
    answers: [
      answer1,
      answer2,
    ],
  },
  {
    id: 'iop123',
    text: 'content question',
    type: 'textInput',
    explanation: 'TEXT',
    answers: [
      answer3,
    ],
  },
]

module.exports = {
  test: {
    id: '1bc123',
    author_id: 'def123',
    model_created_at: 'created',
    model_updated_at: 'updated',
    name: 'Hello Test',
    description: 'hello desc',
    questionsCount: 1,
    timeLimit: 300000, // ms -> 5 minut
    questions,
  },
}
