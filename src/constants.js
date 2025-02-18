/**
 * Symbol for joining coordinates.
 * Earlier, a hyphen (-) was used. But that caused problems when
 * object keys had hyphen in them. So, we're switching to a less
 * commonly used symbol.
*/
export const JOIN_SYMBOL = '§';

/**
 * Symbol for replacing whitespace for generating HTML IDs.
 * Useful for accessibility (aria, label for, inputs, etc).
 *
 * We can't use a common symbol here e.g. "_" (underscore) to replace whitespace
 * because it may cause conflicts.
 * E.g.:if the data has two keys like 'a b' and 'a_b'. If we use underscore, the
 * first 'a b' becomes 'a_b' which is the same as the second key.
 * So we use a rarely used symbol.
 */
export const ID_WHITESPACE_SYMBOL = '‡';

/**
 * HTML field name prefix 
 */
export const FIELD_NAME_PREFIX = 'tsf';

/**
 * HTML/CSS class name prefix 
 */
export const CLASS_NAME_PREFIX = 'tsf';

/**
 * Filler item for arrays to make them at least minItems long 
 */
export const FILLER = '__TSF_FILLER__';
