import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "Seems like we lost this page.",
};

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  );
}
