export const months = [
    { short: "Jan", full: "Janeiro" },
    { short: "Feb", full: "Fevereiro" },
    { short: "Mar", full: "Março" },
    { short: "Abr", full: "Abril" },
    { short: "Mai", full: "Maio" },
    { short: "Jun", full: "Junho" },
    { short: "Jul", full: "Julho" },
    { short: "Aug", full: "Agosto" },
    { short: "Set", full: "Setembro" },
    { short: "Out", full: "Outubro" },
    { short: "Nov", full: "Novembro" },
    { short: "Dez", full: "Dezembro" }
];

/**
 *
 * @param {number} month
 * @param {number} year
 *
 */
export const firstDay = (month, year) => new Date(year, month).getDay();

/**
 *
 * @param {number} month
 * @param {number} year
 *
 */
export const daysInMonth = (month, year) =>
    32 - new Date(year, month, 32).getDate();
