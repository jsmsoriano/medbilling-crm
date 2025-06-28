
// Utility function for generating mock dates for demonstration
export const generateMockDate = (index: number): string => {
  const today = new Date();
  const date = new Date(today);
  date.setDate(today.getDate() - index);
  return date.toLocaleDateString();
};
