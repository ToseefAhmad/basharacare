// Add globalThis polyfill for older Safari versions 12 and below
import globalThisShim from 'globalthis/shim';
globalThisShim();

// Add Object.fromEntries polyfill for older Safari versions 12 and below
import 'polyfill-object.fromentries';
