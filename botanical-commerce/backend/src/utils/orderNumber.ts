export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AB-${year}${month}${day}-${randomSuffix}`;
};

export const generateQuotationNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `AB-B2B-${year}-${randomSuffix}`;
};
