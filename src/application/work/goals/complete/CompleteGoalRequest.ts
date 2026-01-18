/**
 * CompleteGoalRequest
 *
 * Request model for goal completion endpoint.
 * Supports both QA verification and actual completion based on commit flag.
 */
export interface CompleteGoalRequest {
  readonly goalId: string;
  readonly commit: boolean;
}
