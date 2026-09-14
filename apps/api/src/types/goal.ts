export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface CreateGoalInput {
  userId: string;
  title: string;
  description?: string;
}

export interface GetGoalsQuery {
  userId: string;
  status?: GoalStatus;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string | null;
  status?: GoalStatus;
}

export interface GoalResponse {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}
