import { ProjectView } from "../../../../../application/project-knowledge/project/ProjectView.js";
import { AudienceView } from "../../../../../application/project-knowledge/audiences/AudienceView.js";
import { AudiencePainView } from "../../../../../application/project-knowledge/audience-pains/AudiencePainView.js";
import { YamlFormatter } from "../../../shared/formatting/YamlFormatter.js";

/**
 * ProjectContextFormatter - Formats project context for LLM orientation
 *
 * Renders the project context for session start:
 * - Project name and purpose
 * - Target audiences
 * - Active audience pains
 *
 * Output Format: YAML (more LLM-friendly than JSON)
 *
 * Usage:
 *   const formatter = new ProjectContextFormatter();
 *   const contextYaml = formatter.format(project, audiences, audiencePains);
 */
export class ProjectContextFormatter {
  private readonly yamlFormatter: YamlFormatter;

  constructor() {
    this.yamlFormatter = new YamlFormatter();
  }

  /**
   * Format project context as pure YAML
   *
   * @param project - ProjectView to format (or null if not initialized)
   * @param audiences - Active audiences
   * @param audiencePains - Active audience pains
   * @returns YAML string with project context
   */
  format(
    project: ProjectView | null,
    audiences: AudienceView[],
    audiencePains: AudiencePainView[]
  ): string {
    if (!project) {
      return ""; // No project context to render
    }

    const contextData: Record<string, unknown> = {
      projectContext: {
        name: project.name,
        purpose: project.purpose || "Not defined",
      },
    };

    // Add audiences if any exist
    if (audiences.length > 0) {
      (contextData.projectContext as Record<string, unknown>).audiences = audiences.map((a) => ({
        name: a.name,
        description: a.description,
        priority: a.priority,
      }));
    }

    // Add audience pains if any exist
    if (audiencePains.length > 0) {
      (contextData.projectContext as Record<string, unknown>).audiencePains = audiencePains.map((p) => ({
        title: p.title,
        description: p.description,
      }));
    }

    return this.yamlFormatter.toYaml(contextData);
  }
}
