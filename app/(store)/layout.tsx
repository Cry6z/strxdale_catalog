import React from 'react';
import OpeningScene from "@/components/ui/OpeningScene";
import AppWrapper from "@/components/ui/AppWrapper";
import ClosedStore from "@/components/ui/ClosedStore";
import { getStoreSettings } from "@/lib/getStoreSettings";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const storeSettings = await getStoreSettings();
  const isStoreOpen = storeSettings.status === 'open';

  if (!isStoreOpen) {
    return <ClosedStore title={storeSettings.title} description={storeSettings.description} background={storeSettings.background} />;
  }

  return (
    <>
      <OpeningScene />
      <AppWrapper bypass={false}>
        {children}
      </AppWrapper>
    </>
  );
}
