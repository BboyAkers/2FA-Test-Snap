import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { authenticator } from 'otplib';
// import toDataURL from 'qrcode';

// Random not important test secret
const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';

const token = authenticator.generate(secret);
/**
 * Generate a secret code for 2FA.
 */
async function generateSecretCode() {
  try {
    const isValid = await authenticator.verify({ token, secret });
    return isValid;
  } catch (err) {
    console.error(err);
    return err;
  }
}

// const generateImage = async () => {
//   const dataURL = await toDataURL(secret.otpauth_url);
//   return dataURL;
// };

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return generateSecretCode().then((testToken) => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Confirmation',
            content: panel([
              text(`Hello, **${origin}**!`),
              text(`${testToken}`),
            ]),
          },
        });
      });
    default:
      throw new Error('Method not found.');
  }
};
