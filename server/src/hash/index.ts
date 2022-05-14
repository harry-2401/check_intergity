import hashMethod from "js-sha256";

export const hashData = (message: string, secret: string): string => {
  const result = hashMethod.sha256.hmac.create(secret);
  result.update(message);

  return result.hex();
};

export const checkIntegrityMessage = (
  des: string,
  secret: string,
  message: string
): boolean => {
  return des === hashData(message, secret);
};
