import { GoalContextView } from "../get-context/GoalContextView.js";

/**
 * CompleteGoalResponse
 *
 * Unified response model for goal completion requests.
 * - QA mode (commit=false): Returns full criteria context for verification
 * - Commit mode (commit=true): Returns minimal data to save tokens
 */
export interface CompleteGoalResponse {
  readonly goalId: string;
  readonly objective: string;
  readonly status: string;
  readonly llmPrompt: string;
  readonly criteria?: GoalContextView; // Present in QA mode only (token optimization)
  readonly nextGoal?: {
    readonly goalId: string;
    readonly objective: string;
    readonly status: string;
  };
  readonly autoCommittedDueToTurnLimit?: boolean; // True if auto-committed due to turn limit
  readonly remainingTurns?: number; // Number of remaining QA turns (only in QA mode)
}
