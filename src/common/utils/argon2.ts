import argon2 from 'argon2';

const argon2Options = {
  memoryCost: 64 * 1024,
  timeCost: 3,
  parallelism: 1,
};

const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password, argon2Options);
};

const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> => {
  return await argon2.verify(hashedPassword, plainPassword);
};

export const Argon2Utils = {
  hashPassword,
  verifyPassword,
};
