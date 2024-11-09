export class Project {
    id: number;
    title: string;
    description: string;
    goal: number;
    raised: number = 0;

    constructor(partial: Partial<Project>) {
        Object.assign(this, partial);
    }
  }
