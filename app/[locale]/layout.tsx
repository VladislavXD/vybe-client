import RootProvider from "@/src/providers/RootProvider";
import { FallingLeaves } from "falling-leaves/react";
import React from "react";

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  await params;
  return <>
    <RootProvider>
      {children}
    </RootProvider>
  </>
  
}
