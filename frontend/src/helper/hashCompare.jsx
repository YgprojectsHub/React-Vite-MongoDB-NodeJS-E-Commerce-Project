import bcrypt from 'bcryptjs';

export const compareHash = async(value, hashedValue) => {
  try {
    const match = await bcrypt.compare(value, hashedValue);
    return match;
  } catch (err) {
    console.error('Doğrulama hatası:', err);
    throw err;
  }
}