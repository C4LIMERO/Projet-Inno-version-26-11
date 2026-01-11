import ideasData from '../data/ideas.json';
import { v4 as uuidv4 } from 'uuid';
import { Idea, User, Contributor, ParticipationType } from '../types';

export interface NewIdea {
  title: string;
  description: string;
  author: User;
  isAnonymous: boolean;
  tags: string[];
  participationType: ParticipationType;
}

export type SortOption = 'date' | 'title' | 'date_asc';

class IdeaService {
  private ideas: Idea[] = this.initializeIdeas();

  private initializeIdeas(): Idea[] {
    const rawIdeas: any[] = (ideasData as any).ideas;

    return rawIdeas.map(idea => {
      // Create a dummy user for existing data
      const authorUser: User = {
        id: 'legacy-user-' + Math.random().toString(36).substr(2, 9),
        firstName: idea.author || 'Unknown',
        lastName: '',
        status: 'Student'
      };

      return {
        id: String(idea.id),
        title: idea.title,
        description: idea.description,
        author: authorUser,
        isAnonymous: false, // Default for legacy
        tags: idea.tags || [],
        createdAt: idea.submissionDate || new Date().toISOString(),
        contributors: [],
        status: 'Proposed'
      } as Idea;
    });
  }

  getAllIdeas(): Idea[] {
    return this.ideas;
  }

  getIdeaById(id: string): Idea | undefined {
    return this.ideas.find(idea => idea.id === id);
  }

  getSortedIdeas(sortBy: SortOption = 'date'): Idea[] {
    const ideasToSort = [...this.ideas];
    switch (sortBy) {
      case 'date':
        return ideasToSort.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'title':
        return ideasToSort.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return ideasToSort;
    }
  }

  getIdeasByTag(tag: string): Idea[] {
    return this.ideas.filter(idea =>
      idea.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  searchIdeas(searchTerm: string): Idea[] {
    const term = searchTerm.toLowerCase();
    return this.ideas.filter(idea =>
      idea.title.toLowerCase().includes(term) ||
      idea.description.toLowerCase().includes(term) ||
      idea.author.firstName.toLowerCase().includes(term) ||
      idea.author.lastName.toLowerCase().includes(term) ||
      idea.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  getAllTags(): string[] {
    const allTags = this.ideas.flatMap(idea => idea.tags);
    return Array.from(new Set(allTags));
  }

  getFilteredAndSortedIdeas(
    searchTerm: string = '',
    filterTag: string | null = null,
    sortBy: SortOption = 'date'
  ): Idea[] {
    let filtered = [...this.ideas];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(term) ||
        idea.description.toLowerCase().includes(term) ||
        idea.author.firstName.toLowerCase().includes(term) ||
        idea.author.lastName.toLowerCase().includes(term) ||
        idea.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (filterTag) {
      filtered = filtered.filter(idea =>
        idea.tags.some(tag => tag === filterTag)
      );
    }

    switch (sortBy) {
      case 'date':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }

  addIdea(newIdea: NewIdea): Idea {
    const idea: Idea = {
      id: uuidv4(),
      title: newIdea.title,
      description: newIdea.description,
      author: newIdea.author,
      isAnonymous: newIdea.isAnonymous,
      tags: newIdea.tags,
      createdAt: new Date().toISOString(),
      contributors: [{ user: newIdea.author, role: newIdea.participationType }],
      status: 'Proposed'
    };

    this.ideas.push(idea);
    return idea;
  }

  addContributor(ideaId: string, user: User, role: ParticipationType): void {
    const idea = this.getIdeaById(ideaId);
    if (idea) {
      const existingContributor = idea.contributors.find(c => c.user.id === user.id);
      if (existingContributor) {
        existingContributor.role = role;
      } else {
        idea.contributors.push({ user, role });
      }
    }
  }
}

const ideaService = new IdeaService();

export default ideaService;