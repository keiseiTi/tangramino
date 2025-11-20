import type { Plugin } from '../interface/plugin';

/**
 * Validates that plugins don't have circular dependencies
 * @param plugins - Array of plugins to validate
 * @returns Object with isValid flag and error message if invalid
 */
export const validatePluginDependencies = (
  plugins: Plugin[],
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
      error: `Duplicate plugin IDs found: ${duplicates.join(', ')}. This may cause circular dependencies.`,
    };
  }

  // Additional validation: Check if plugins have conflicting transformSchema hooks
  const hookConflicts = detectHookConflicts(plugins);
  if (hookConflicts.length > 0) {
    console.warn(
      '[Plugin Validation] Multiple plugins define the same hooks. Execution order matters:',
      hookConflicts,
    );
  }

  return { isValid: true };
};

/**
 * Detects if multiple plugins define the same transformation hooks
 * @param plugins - Array of plugins to check
 * @returns Array of hook names that have conflicts
 */
const detectHookConflicts = (plugins: Plugin[]): string[] => {
  const hookCounts: Record<string, number> = {};
  const conflicts: string[] = [];

  const hookNames = [
    'beforeInsertElement',
    'afterInsertElement',
    'beforeMoveElement',
    'afterMoveElement',
    'beforeRemoveElement',
    'afterRemoveElement',
    'beforeSetElementProps',
    'afterSetElementProps',
  ];

  for (const plugin of plugins) {
    if (plugin.transformSchema) {
      for (const hookName of hookNames) {
        if (plugin.transformSchema[hookName as keyof typeof plugin.transformSchema]) {
          hookCounts[hookName] = (hookCounts[hookName] || 0) + 1;
        }
      }
    }
  }

  for (const [hookName, count] of Object.entries(hookCounts)) {
    if (count > 1) {
      conflicts.push(hookName);
    }
  }

  return conflicts;
};

/**
 * Safely applies plugins with validation
 * @param plugins - Array of plugins to apply
 * @param onError - Optional callback for handling validation errors
 * @returns Validated plugins array or empty array if validation fails
 */
export const applyPluginsWithValidation = (
  plugins: Plugin[],
  onError?: (error: string) => void,
): Plugin[] => {
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
