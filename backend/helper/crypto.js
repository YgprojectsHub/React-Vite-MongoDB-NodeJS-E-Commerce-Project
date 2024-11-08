import bcrypt from "bcrypt"

const saltRounds = 10;

export const hashValue = async (value, isParam=false) => {
  try {
    const hashedValue = await bcrypt.hash(value, saltRounds);
    return !isParam ? hashedValue : encodeURIComponent(hashedValue)
  } catch (err) {
    console.error('Hashleme hatası:', err);
    throw err;
  }
}

export const compareValue = async(value, hashedValue) => {
  try {
    const match = await bcrypt.compare(value, hashedValue);
    return match;
  } catch (err) {
    console.error('Doğrulama hatası:', err);
    throw err;
  }
}
