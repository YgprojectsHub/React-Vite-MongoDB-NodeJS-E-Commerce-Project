export const generateSeoLink = (text, haveRandomNumber = true) => {
  const turkishMap = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };

  let seoLink = text
    .split("")
    .map((char) => turkishMap[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  return !haveRandomNumber ? seoLink : `${seoLink}-${randomNumber}`;
};
