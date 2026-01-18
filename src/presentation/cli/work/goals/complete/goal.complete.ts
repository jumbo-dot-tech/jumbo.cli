/**
 * CLI Command: jumbo goal complete
 *
 * Handles goal completion requests.
 * - Without --commit: Triggers QA verification against goal criteria
 * - With --commit: Completes the goal and prompts for learnings
 */

import { CommandMetadata } from "../../../shared/registry/CommandMetadata.js";
import { ApplicationContainer } from "../../../composition/bootstrap.js";
import { Renderer } from "../../../shared/rendering/Renderer.js";
import { CompleteGoalController } from "../../../../../application/work/goals/complete/CompleteGoalController.js";
import { CompleteGoalRequest } from "../../../../../application/work/goals/complete/CompleteGoalRequest.js";
import { GoalContextFormatter } from "../start/GoalContextFormatter.js";

/**
 * Command metadata for auto-registration
 */
export const metadata: CommandMetadata = {
  description: "Mark a goal as completed",
  category: "work",
  requiredOptions: [
    {
      flags: "--goal-id <goalId>",
      description: "ID of the goal to complete"
    }
  ],
  options: [
    {
      flags: "--commit",
      description: "Commit the completion (without this flag, triggers Quality Assurance check)"
    }
  ],
  examples: [
    {
      command: "jumbo goal complete --goal-id goal_abc123",
      description: "Verify work against goal criteria"
    },
    {
      command: "jumbo goal complete --goal-id goal_abc123 --commit",
      description: "Complete the goal after QA verification"
    }
  ],
  related: ["goal add", "goal start", "goal block"]
};

/**
 * Command handler
 * Called by Commander with parsed options
 */
export async function goalComplete(
  options: { goalId: string; commit?: boolean },
  container: ApplicationContainer
) {
  const renderer = Renderer.getInstance();

  try {
    // 1. Get controller from container
    const controller = container.completeGoalController;

    // 2. Create request
    const request: CompleteGoalRequest = {
      goalId: options.goalId,
      commit: options.commit || false,
    };

    // 3. Handle request
    const response = await controller.handle(request);

    // 4. Render response

    // Render criteria if present (QA mode)
    if (response.criteria) {
      const formatter = new GoalContextFormatter();
      const contextYaml = formatter.format(response.criteria);
      renderer.info("\n" + contextYaml);
    }

    // Render LLM prompt
    renderer.info("---\n");
    renderer.info(response.llmPrompt + "\n");

    // Render goal status
    const statusMessage = response.criteria ? "Goal verification ready" : "Goal completed";
    renderer.success(statusMessage, {
      goalId: response.goalId,
      objective: response.objective,
      status: response.status,
    });

    // Render next goal if present
    if (response.nextGoal) {
      renderer.info("\n---\n");
      renderer.info("Next goal in chain:");
      renderer.success("Suggested next goal", {
        goalId: response.nextGoal.goalId,
        objective: response.nextGoal.objective,
        status: response.nextGoal.status,
      });
      renderer.info("\nTo start this goal, run:");
      renderer.info(`  jumbo goal start --goal-id ${response.nextGoal.goalId}`);
    }
  } catch (error) {
    renderer.error("Failed to process goal completion", error instanceof Error ? error : String(error));
    process.exit(1);
  }
  // NO CLEANUP - infrastructure manages itself!
}
