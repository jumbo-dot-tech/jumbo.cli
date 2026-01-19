import { BaseEvent } from "../../../../domain/shared/BaseEvent.js";
import { AppendResult } from "../../../shared/persistence/IEventStore.js";

/**
 * Port interface for writing GoalReviewedEvent to the event store.
 * Used by CompleteGoalController to record completion reviews.
 */
export interface IGoalReviewedEventWriter {
  append(event: BaseEvent & Record<string, any>): Promise<AppendResult>;
}
