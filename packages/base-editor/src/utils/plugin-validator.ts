import type { EditorPlugin } from '../interface/plugin';

/**
 * Validates that plugins don't have circular dependencies
 * @param plugins - Array of plugins to validate
 * @returns Object with isValid flag and error message if invalid
 */
export const validatePluginDependencies = (
  plugins: EditorPlugin[],
): { isValid: boolean; error?: string } => {
  const pluginIds = new Set<string>();
  const duplicates: string[] = [];

  // Check for duplicate plugin IDs
  for (const plugin of plugins) {
    if (pluginIds.has(plugin.id)) {
      duplicates.push(plugin.id);
    }
    pluginIds.add(plugin.id);
  }

  if (duplicates.length > 0) {
    return {
      isValid: false,
      error: `Duplicate plugin IDs found: ${duplicates.join(', ')}.`,
    };
  }

  return { isValid: true };
};

/**
 * @deprecated Use PluginManager for validation and execution
 */
export const applyPluginsWithValidation = (
  plugins: EditorPlugin[],
  onError?: (error: string) => void,
): EditorPlugin[] => {
  const validation = validatePluginDependencies(plugins);

  if (!validation.isValid) {
    const errorMsg = validation.error || 'Unknown plugin validation error';
    console.error('[Plugin Validation]', errorMsg);
    if (onError) {
      onError(errorMsg);
    }
    return [];
  }

  return plugins;
};
