/**
 * Settings type definitions for application-wide configuration.
 * Settings are stored in .jumbo/settings.jsonc file.
 */

export interface QASettings {
  /**
   * Default turn limit for QA iterations on goal completion.
   * When this limit is reached, the goal is automatically completed.
   * Default: 3
   */
  defaultTurnLimit: number;

  /**
   * Optional: Warn user when approaching turn limit.
   * If set, shows a warning at this turn number.
   * Example: Setting to 2 warns at turn 2 of 3.
   */
  warnAtTurn?: number;
}

export interface Settings {
  /**
   * QA (Quality Assurance) settings for goal completion
   */
  qa: QASettings;
}
