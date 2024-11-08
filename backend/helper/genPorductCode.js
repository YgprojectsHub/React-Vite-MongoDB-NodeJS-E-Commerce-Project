export const generateProductCode = (name) => {
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

  let processedName = name
    .replace(/\s+/g, "")
    .split("")
    .map((char) => turkishMap[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  let randomChars = processedName;
  while (randomChars.length < 4) {
    const randomIndex = Math.floor(Math.random() * processedName.length);
    randomChars += processedName[randomIndex] || "";
  }

  const randomNumbers = Math.floor(100000 + Math.random() * 900000);

  return `PD${randomChars}${randomNumbers}`;
};
