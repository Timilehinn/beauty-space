/** @type {import('next-i18next').UserConfig} */
module.exports = {
  debug: process.env.NODE_ENV === "development",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  localeDetection: false,
  defaultNS: "common",
  localeExtension: "json",
  react: { useSuspense: false }
};
