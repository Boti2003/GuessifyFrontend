export type Question = {
   id: string;
   answerOptions: string[];
   previewUrl: string;
};

export type QuestionWithAnswer = Question & {
   correctAnswer: string;
};
