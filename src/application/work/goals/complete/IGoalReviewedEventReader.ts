import { BaseEvent } from "../../../../domain/shared/BaseEvent.js";

/**
 * Port interface for reading goal reviewed events from event stream.
 * Used by QATurnTracker to count reviews.
 */
export interface IGoalReviewedEventReader {
  readStream(streamId: string): Promise<BaseEvent[]>;
}
