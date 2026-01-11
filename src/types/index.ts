export type UserStatus = 'Student' | 'Staff' | 'Teacher';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    status: UserStatus;
    email?: string;
}

export type ParticipationType = 'Actor' | 'Proposer' | 'Moteur';

export interface Contributor {
    user: User;
    role: ParticipationType;
}

export interface Idea {
    id: string;
    title: string;
    description: string;
    author: User;
    isAnonymous: boolean;
    tags: string[];
    createdAt: string;
    contributors: Contributor[];
    status: 'Proposed' | 'In Progress' | 'Completed';
}

export interface Question {
    id: string;
    content: string;
    reformulatedContent?: string;
    author: User;
    isAnonymous: boolean;
    createdAt: string;
    isPublic: boolean;
    answer?: Answer;
    isAnswered: boolean;
}

export interface Answer {
    content: string;
    answeredAt: string;
    answeredBy: string;
}
