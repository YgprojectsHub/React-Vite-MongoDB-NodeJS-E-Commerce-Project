import currencyFormatter from "currency-formatter";

export const formatCurrency = (amount, currencyCode) => {
  const number = parseFloat(amount)
  if (isNaN(number)) {
    return "Invalid number";
  }
  return currencyFormatter.format(number, { code: currencyCode });
};
