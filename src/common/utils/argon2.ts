import argon2, { Options } from 'argon2';

const getArgon2Options = (): Options => {
  const salt = process.env.ARGON2_SALT
    ? Buffer.from(process.env.ARGON2_SALT, 'base64')
    : undefined; // Let argon2 generate a random salt if not provided

  return {
    memoryCost: 64 * 1024,
    timeCost: 3,
    parallelism: 1,
    ...(salt && { salt }),
  };
};

const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password, getArgon2Options());
};

export const Argon2Utils = {
  hashPassword,
};
