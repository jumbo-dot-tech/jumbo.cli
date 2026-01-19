/**
 * FsGoalReviewedEventStore - File system event store for GoalReviewedEvent.
 *
 * Implements IGoalReviewedEventWriter and IGoalReviewedEventReader for
 * persisting and reading goal reviewed events.
 * Extends the base FsEventStore implementation.
 * Reuses the goal's event stream storage.
 */

import { FsEventStore } from "../../../shared/persistence/FsEventStore.js";
import { IGoalReviewedEventWriter } from "../../../../application/work/goals/complete/IGoalReviewedEventWriter.js";
import { IGoalReviewedEventReader } from "../../../../application/work/goals/complete/IGoalReviewedEventReader.js";

export class FsGoalReviewedEventStore
  extends FsEventStore
  implements IGoalReviewedEventWriter, IGoalReviewedEventReader
{
  constructor(rootDir: string) {
    super(rootDir);
  }
}
