import { v4 as uuidv4 } from 'uuid';
import { Question, User } from '../types';

class QuestionService {
    private questions: Question[] = [];

    constructor() {
        // Mock data
        this.questions = [
            {
                id: 'q1',
                content: "Quand seront affichés les résultats des partiels ?",
                reformulatedContent: "Quand seront publiés les résultats des examens du premier semestre ?",
                author: { id: 'u1', firstName: 'Jean', lastName: 'Dupont', status: 'Student' },
                isAnonymous: false,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                isAnswered: true,
                isPublic: true,
                answer: {
                    content: "Les résultats seront disponibles le 15 janvier sur l'intranet.",
                    answeredAt: new Date().toISOString(),
                    answeredBy: "Administration"
                }
            },
            {
                id: 'q2',
                content: "Est-il possible d'organiser un événement dans le hall ?",
                author: { id: 'u2', firstName: 'Marie', lastName: 'Curie', status: 'Student' },
                isAnonymous: true,
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                isAnswered: false,
                isPublic: false
            }
        ];
    }

    getAllQuestions(): Question[] {
        return this.questions;
    }

    getAnsweredQuestions(): Question[] {
        return this.questions.filter(q => q.isAnswered && q.isPublic).sort((a, b) =>
            new Date(b.answer?.answeredAt || 0).getTime() - new Date(a.answer?.answeredAt || 0).getTime()
        );
    }

    addQuestion(content: string, author: User, isAnonymous: boolean): Question {
        const newQuestion: Question = {
            id: uuidv4(),
            content,
            author,
            isAnonymous,
            createdAt: new Date().toISOString(),
            isAnswered: false,
            isPublic: false
        };
        this.questions.push(newQuestion);
        return newQuestion;
    }

    answerQuestion(id: string, answerContent: string, answeredBy: string, reformulatedContent?: string, publish: boolean = false): Question | undefined {
        const question = this.questions.find(q => q.id === id);
        if (question) {
            question.answer = {
                content: answerContent,
                answeredAt: new Date().toISOString(),
                answeredBy
            };
            question.isAnswered = true;
            if (reformulatedContent) {
                question.reformulatedContent = reformulatedContent;
            }
            if (publish) {
                question.isPublic = true;
            }
        }
        return question;
    }
}

const questionService = new QuestionService();
export default questionService;
