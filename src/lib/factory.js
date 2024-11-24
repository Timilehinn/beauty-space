/**
 * Truncate
 * returns the truncated text with "..." or any specified ending character
 * @param {String} str
 * @param {Number} length
 * @param {String} ending
 * */
export const truncate = (str = "", length = 20, ending = "...") =>
  str.length > length
    ? `${str.substring(0, length - ending.length)} ${ending}`
    : str;

/**
 * Capitalize
 * returns a capitalized sentence
 * @param {String} sentence
 * */
export const capitalizeWords = (sentence) => {
  if (!sentence) return;

  if (sentence.length === 1) return sentence.toUpperCase();

  return sentence
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * extractCityCountry
 * returns the state and country in the address
 * @param {String} address
 * */

export const extractCityCountry = (address) => {
  const parts = address.split(",");
  const city = parts[parts.length - 2].trim();
  const country = parts[parts.length - 1].trim();
  return city + ", " + country;
};

/**
 * ScrollToTop
 * scrolls to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const extractPath = (path, idx) => {
  const parts = path.split("%3F");
  return parts[idx];
};
// export const extractPath = (path, idx) => {
//   const parts = path.split("%3F");
//   return parts[idx];
// };

// export const getUserType = () => {
//   switch (accountType) {
//     case "Admin" || "User" || "Owner":
//       return "/dashboard";
//     case "Sales":
//       return "/dashboard/sales";
//     default:
//       return "/dashboard";
//   }
// };
