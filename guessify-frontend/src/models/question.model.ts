export type QuestionBaseData = {
   id: string;
   answerOptions: string[];
   previewUrl: string;
};

export type Question = {
   question: QuestionBaseData;
   sendTime: number;
   duration: number;
};

export type QuestionWithAnswer = Question & {
   correctAnswer: string;
};
