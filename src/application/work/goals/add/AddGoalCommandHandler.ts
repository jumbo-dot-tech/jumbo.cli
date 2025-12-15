import { randomUUID } from "crypto";
import { AddGoalCommand } from "./AddGoalCommand.js";
import { IGoalAddedEventWriter } from "./IGoalAddedEventWriter.js";
import { IEventBus } from "../../../shared/messaging/IEventBus.js";
import { Goal } from "../../../../domain/work/goals/Goal.js";

/**
 * Command handler for AddGoalCommand.
 * Orchestrates the creation of a new goal aggregate and event publication.
 *
 * Handler owns ID generation as part of orchestration (Clean Architecture).
 */
export class AddGoalCommandHandler {
  constructor(
    private readonly eventWriter: IGoalAddedEventWriter,
    private readonly eventBus: IEventBus
  ) {}

  async execute(command: AddGoalCommand): Promise<{ goalId: string }> {
    // Generate new goal ID (handler owns ID generation)
    const goalId = `goal_${randomUUID()}`;

    // Create new aggregate
    const goal = Goal.create(goalId);

    // Build embedded context if any fields are provided
    const embeddedContext = (
      command.relevantInvariants ||
      command.relevantGuidelines ||
      command.relevantDependencies ||
      command.relevantComponents ||
      command.architecture ||
      command.filesToBeCreated ||
      command.filesToBeChanged
    ) ? {
      relevantInvariants: command.relevantInvariants,
      relevantGuidelines: command.relevantGuidelines,
      relevantDependencies: command.relevantDependencies,
      relevantComponents: command.relevantComponents,
      architecture: command.architecture,
      filesToBeCreated: command.filesToBeCreated,
      filesToBeChanged: command.filesToBeChanged,
    } : undefined;

    // Domain logic produces event
    const event = goal.add(
      command.objective,
      command.successCriteria,
      command.scopeIn,
      command.scopeOut,
      command.boundaries,
      embeddedContext
    );

    // Persist event to file store
    await this.eventWriter.append(event);

    // Publish event to bus (projections will update via subscriptions)
    await this.eventBus.publish(event);

    return { goalId };
  }
}
