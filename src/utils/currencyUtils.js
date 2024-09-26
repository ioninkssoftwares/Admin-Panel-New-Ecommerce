// src/utils/currencyUtils.js

export function formatCurrency(value) {
  // Check if value has a decimal part
  if (value && value % 1 !== 0) {
    return `${value.toFixed(2)}`; // Format to 2 decimal places if it has a decimal part
  }
  return value ? `${value}` : "0"; // Return as-is if no decimal, or "₹0" if falsy
}
