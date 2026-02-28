"use client";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Font,
} from "@react-email/components";
import * as React from "react";

interface ForgotPasswordProps {
  otpCode: string;
}

export const ForgotPassword: React.FC<Readonly<ForgotPasswordProps>> = ({
  otpCode = "000000",
}) => (
  <Html>
    <Head>
      <Font
        fontFamily="Geist"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.woff2",
          format: "woff2",
        }}
        fontWeight={400}
      />
      <Font
        fontFamily="Geist"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.woff2",
          format: "woff2",
        }}
        fontWeight={700}
      />
    </Head>
    <Preview>Your password reset code</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#0070f3",
              neutral: {
                50: "#f9fafb",
                400: "#9ca3af",
                600: "#4b5563",
                900: "#111827",
              },
            },
            fontFamily: {
              sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
            },
          },
        },
      }}
    >
      <Body className="bg-neutral-50 my-auto mx-auto font-sans">
        <Container className="border border-solid border-neutral-200 rounded-2xl bg-white my-[40px] mx-auto p-[40px] max-w-[465px] shadow-sm">
          <Section className="mb-8">
            <Text className="text-brand text-[24px] font-bold tracking-tighter">
              Job Research AI
            </Text>
          </Section>

          <Heading className="text-neutral-900 text-[26px] font-bold leading-tight mb-4 tracking-tight">
            Forgot your password?
          </Heading>
          
          <Text className="text-neutral-600 text-[16px] leading-[24px] mb-6">
            No worries. It happens to the best of us. 
          </Text>

          <Text className="text-neutral-600 text-[16px] leading-[24px]">
            Use this code to reset your password and get back into your account.
          </Text>

          {/* Large OTP Display */}
          <Section className="bg-neutral-900 rounded-xl my-8 py-6 text-center">
            <Text className="text-white text-[42px] font-bold tracking-[12px] m-0 leading-[1]">
              {otpCode}
            </Text>
          </Section>

          <Text className="text-neutral-400 text-[14px] leading-[18px] text-center">
             This code is for you only. It expires in 15 minutes. If you didn't ask for this, you're all good—just delete this email. 
          </Text>

          <Hr className="border border-solid border-neutral-100 my-8" />

          <Text className="text-neutral-400 text-center text-[12px] leading-[16px] mb-0">
            © {(new Date()).getFullYear()} Jrai AI.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ForgotPassword;