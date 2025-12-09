/**
 * Port interface for reading CLI metadata.
 * Provides access to build-time metadata about the CLI itself.
 */

export interface CliMetadataView {
  version: string;
}

export interface ICliMetadataReader {
  /**
   * Retrieves the CLI metadata including version.
   */
  getMetadata(): CliMetadataView;
}
