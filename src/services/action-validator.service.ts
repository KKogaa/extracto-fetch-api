import type { Action } from '../types/actions';

export class ActionValidator {
  static validate(actions: Action[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(actions)) {
      errors.push('Actions must be an array');
      return { valid: false, errors };
    }

    if (actions.length === 0) {
      errors.push('Actions array cannot be empty');
      return { valid: false, errors };
    }

    if (actions.length > 100) {
      errors.push('Actions array cannot exceed 100 actions');
      return { valid: false, errors };
    }

    actions.forEach((action, index) => {
      if (!action.type) {
        errors.push(`Action at index ${index}: missing type`);
        return;
      }

      switch (action.type) {
        case 'navigate':
          if (!action.url) {
            errors.push(`Action at index ${index}: navigate requires url`);
          }
          break;

        case 'click':
        case 'hover':
        case 'check':
        case 'uncheck':
          if (!action.selector) {
            errors.push(`Action at index ${index}: ${action.type} requires selector`);
          }
          break;

        case 'type':
        case 'fill':
          if (!action.selector) {
            errors.push(`Action at index ${index}: ${action.type} requires selector`);
          }
          if (action.value === undefined || action.value === null) {
            errors.push(`Action at index ${index}: ${action.type} requires value`);
          }
          break;

        case 'select':
          if (!action.selector) {
            errors.push(`Action at index ${index}: select requires selector`);
          }
          if (!action.value) {
            errors.push(`Action at index ${index}: select requires value`);
          }
          break;

        case 'waitForSelector':
          if (!action.selector) {
            errors.push(`Action at index ${index}: waitForSelector requires selector`);
          }
          break;

        case 'waitForTimeout':
          if (!action.timeout || action.timeout <= 0) {
            errors.push(`Action at index ${index}: waitForTimeout requires positive timeout`);
          }
          if (action.timeout > 60000) {
            errors.push(`Action at index ${index}: waitForTimeout cannot exceed 60 seconds`);
          }
          break;

        case 'getAttribute':
          if (!action.selector) {
            errors.push(`Action at index ${index}: getAttribute requires selector`);
          }
          if (!action.attribute) {
            errors.push(`Action at index ${index}: getAttribute requires attribute`);
          }
          break;

        case 'getText':
          if (!action.selector) {
            errors.push(`Action at index ${index}: getText requires selector`);
          }
          break;

        case 'evaluate':
          if (!action.expression) {
            errors.push(`Action at index ${index}: evaluate requires expression`);
          }
          // Security check: only allow safe expressions
          if (action.expression && !/^[a-zA-Z0-9._\[\]"'\s]+$/.test(action.expression)) {
            errors.push(
              `Action at index ${index}: evaluate expression contains invalid characters (only property access allowed)`
            );
          }
          break;

        case 'press':
          if (!action.selector) {
            errors.push(`Action at index ${index}: press requires selector`);
          }
          if (!action.key) {
            errors.push(`Action at index ${index}: press requires key`);
          }
          break;

        case 'setCookies':
          if (!action.cookies || !Array.isArray(action.cookies)) {
            errors.push(`Action at index ${index}: setCookies requires cookies array`);
          } else {
            action.cookies.forEach((cookie, cookieIndex) => {
              if (!cookie.name || !cookie.value) {
                errors.push(
                  `Action at index ${index}: cookie at index ${cookieIndex} requires name and value`
                );
              }
            });
          }
          break;

        case 'navigate':
        case 'waitForNavigation':
        case 'screenshot':
        case 'getContent':
        case 'scroll':
          // These actions have optional parameters, no strict validation needed
          break;

        default:
          errors.push(`Action at index ${index}: unknown action type '${(action as any).type}'`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
