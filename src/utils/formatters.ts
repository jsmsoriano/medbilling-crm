/**
 * Formats currency amounts with abbreviations for large numbers
 * @param amount - The amount to format
 * @param showFullAmount - Whether to show full amount on hover/tooltip
 * @returns Formatted string with abbreviation if needed
 */
export const formatCurrencyAbbreviated = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(2)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

/**
 * Formats percentage values
 * @param value - The percentage value
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Formats numbers with abbreviations
 * @param value - The number to format
 * @returns Formatted string with abbreviation if needed
 */
export const formatNumberAbbreviated = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

/**
 * Gets the full formatted amount for tooltips
 * @param amount - The amount to format
 * @returns Full formatted currency string
 */
export const getFullCurrencyAmount = (amount: number): string => {
  return `$${amount.toLocaleString()}`;
};