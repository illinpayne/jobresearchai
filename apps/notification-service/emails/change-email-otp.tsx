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

interface VerifyEmailProps {
  otpCode: string;
  userName?: string;
}

export const ChangeEmail: React.FC<Readonly<VerifyEmailProps>> = ({
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
        fontStyle="normal"
      />
      <Font
        fontFamily="Geist"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.woff2",
          format: "woff2",
        }}
        fontWeight={700}
        fontStyle="normal"
      />
    </Head>
    <Preview>Your verification code: {otpCode}</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#0070f3",
              neutral: {
                50: "#f9fafb",
                100: "#f3f4f6",
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
        <Container className="border border-solid border-neutral-200 rounded-xl bg-white my-[40px] mx-auto p-[45px] max-w-[465px]">
          <Section className="mt-[32px] text-center">
            {/* Replace with your actual logo URL */}
            <Text className="text-brand text-[28px] font-bold tracking-tighter">
              Job Research AI
            </Text>
          </Section>
          
          <Heading className="text-neutral-900 text-[24px] font-bold text-center p-0 my-[30px] mx-0">
            Update email
          </Heading>
          
          <Text className="text-neutral-600 text-[15px] leading-[24px]">
            Hi,
          </Text>
          
          <Text className="text-neutral-600 text-[15px] leading-[24px]">
           To finish changing your email and ensure your security, please enter the following code in the verification screen.
          </Text>

          <Section className="bg-neutral-100 rounded-lg my-[32px] py-[24px] text-center">
            <Text className="text-neutral-900 text-[36px] font-bold tracking-[10px] m-0 leading-[40px]">
              {otpCode}
            </Text>
          </Section>

          <Text className="text-neutral-400 text-[13px] leading-[20px] text-center px-4">
            This code expires in 2 minutes. If you didn't request this, you can safely ignore this email.
          </Text>

          <Hr className="border border-solid border-neutral-100 my-8" />
          
          <Section className="text-center">
            <Text className="text-neutral-400 text-[12px] leading-[16px] mb-0">
              © {(new Date()).getFullYear()} Jrai AI.
            </Text>
            <Text className="text-neutral-400 text-[12px] leading-[16px] mt-2">
              Ukraine, UA
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ChangeEmail;