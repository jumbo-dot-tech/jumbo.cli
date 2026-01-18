import { CompleteGoalRequest } from "./CompleteGoalRequest.js";
import { CompleteGoalResponse } from "./CompleteGoalResponse.js";
import { CompleteGoalPromptService } from "./CompleteGoalPromptService.js";
import { CompleteGoalCommandHandler } from "./CompleteGoalCommandHandler.js";
import { GetGoalContextQueryHandler } from "../get-context/GetGoalContextQueryHandler.js";
import { IGoalCompleteReader } from "./IGoalCompleteReader.js";

/**
 * CompleteGoalController
 *
 * Controller for goal completion requests (similar to HTTP request controller).
 * Routes requests based on policy (commit flag) and returns structured responses.
 *
 * - QA Mode (commit=false): Returns criteria and QA prompt for verification
 * - Commit Mode (commit=true): Delegates to CompleteGoalCommandHandler and returns learnings prompt
 */
export class CompleteGoalController {
  constructor(
    private readonly completeGoalCommandHandler: CompleteGoalCommandHandler,
    private readonly getGoalContextQueryHandler: GetGoalContextQueryHandler,
    private readonly goalReader: IGoalCompleteReader,
    private readonly promptService: CompleteGoalPromptService
  ) {}

  async handle(request: CompleteGoalRequest): Promise<CompleteGoalResponse> {
    if (request.commit) {
      return this.handleCommit(request.goalId);
    } else {
      return this.handleQA(request.goalId);
    }
  }

  /**
   * Handle QA mode: Return criteria and QA prompt without changing goal state
   */
  private async handleQA(goalId: string): Promise<CompleteGoalResponse> {
    // Get current goal view
    const goalView = await this.goalReader.findById(goalId);
    if (!goalView) {
      throw new Error(`Goal not found: ${goalId}`);
    }

    // Get full goal context (criteria, components, invariants, etc.)
    const goalContext = await this.getGoalContextQueryHandler.execute(goalId);

    // Generate QA prompt
    const llmPrompt = this.promptService.generateQAPrompt(goalId);

    return {
      goalId,
      objective: goalView.objective,
      status: goalView.status,
      llmPrompt,
      criteria: goalContext,
    };
  }

  /**
   * Handle Commit mode: Delegate to CompleteGoalCommandHandler and return learnings prompt
   */
  private async handleCommit(goalId: string): Promise<CompleteGoalResponse> {
    // Delegate to command handler (state change)
    await this.completeGoalCommandHandler.execute({ goalId });

    // Get updated goal view
    const goalView = await this.goalReader.findById(goalId);
    if (!goalView) {
      throw new Error(`Goal not found after completion: ${goalId}`);
    }

    // Generate learnings prompt
    const llmPrompt = this.promptService.generateLearningsPrompt();

    // Check for next goal
    let nextGoal;
    if (goalView.nextGoalId) {
      const nextGoalView = await this.goalReader.findById(goalView.nextGoalId);
      if (nextGoalView) {
        nextGoal = {
          goalId: nextGoalView.goalId,
          objective: nextGoalView.objective,
          status: nextGoalView.status,
        };
      }
    }

    return {
      goalId,
      objective: goalView.objective,
      status: goalView.status,
      llmPrompt,
      // No criteria in commit mode (token optimization)
      nextGoal,
    };
  }
}
