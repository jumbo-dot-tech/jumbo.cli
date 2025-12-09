/**
 * Infrastructure implementation of ICliMetadataReader.
 * Reads CLI metadata from build-time generated constants.
 */

import {
  CliMetadataView,
  ICliMetadataReader,
} from "../../../application/cli-metadata/query/ICliMetadataReader.js";
import { CLI_VERSION } from "./version.generated.js";

export class BuildTimeCliMetadataReader implements ICliMetadataReader {
  getMetadata(): CliMetadataView {
    return {
      version: CLI_VERSION,
    };
  }
}
