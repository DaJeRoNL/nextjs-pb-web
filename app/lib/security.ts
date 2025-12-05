export async function validateTurnstile(token: string | undefined) {
  if (!token) {
    return { success: false, message: "Security check missing. Please refresh and try again." };
  }

  try {
    const verifyResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    const verifyOutcome = await verifyResult.json();

    if (!verifyOutcome.success) {
      console.error("Turnstile verification failed:", verifyOutcome);
      return { success: false, message: "Security check failed. Please reload and try again." };
    }

    return { success: true };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, message: 'Security check failed due to a system error.' };
  }
}