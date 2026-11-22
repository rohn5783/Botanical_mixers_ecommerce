import { Resend } from 'resend';
import { env } from '../config/env.js';

let resendClient: Resend | null = null;

export const getResendClient = (): Resend => {
  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
};

export const sendTransactionalEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> => {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: 'Aranya Botanicals <orders@aranyabotanicals.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error: any) {
    console.log(`[Resend Email] Transactional notice to ${options.to}: "${options.subject}" (Dev fallback logged)`);
    return true;
  }
};
