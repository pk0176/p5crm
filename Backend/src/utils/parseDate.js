export const parseDate = (dateStr) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return null;

    const [_, day, month, year] = match;
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    // Ensure date is valid (e.g., not 31-02-2025)
    return isNaN(date.getTime()) ? null : date;
};
