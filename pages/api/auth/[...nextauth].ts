
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

export default NextAuth({
  providers: [
    EmailProvider({
      server: "",
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // Minimal email via Resend REST
        const apiKey = process.env.RESEND_API_KEY;
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to: identifier,
            subject: "Your sign-in link",
            html: `<p>Sign in:</p><p><a href="${url}">${url}</a></p>`
          })
        });
        if (!res.ok) console.error("Email send failed", await res.text());
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
