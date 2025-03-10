import bcrypt from "bcrypt";
const saltRounds = 10;

const compare = async ({
  data,
  encrypted,
}: {
  data: string;
  encrypted: string;
}) => {
  const result = await bcrypt.compareSync(data, encrypted);
  return result;
};

const hash = async ({ data }: { data: string }) => {
  const hashed = await bcrypt.hashSync(data, saltRounds);
  return hashed;
};

export const BcryptLib = {
  compare,
  hash,
};
