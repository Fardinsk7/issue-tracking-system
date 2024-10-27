export const sendOtpOnWhatsapp = async (otp: number, phone: number) => {
  const obj = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: {
      preview_url: false,
      body: `To log in to your AutoWhat Account use One Time Password *${otp}*.\nMake sure you do not share it with anyone.`,
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${process.env.Meta_WA_SenderPhoneNumberId}/messages`,
    {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en_US",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.Meta_WA_accessToken}`,
      },
    }
  );
};
