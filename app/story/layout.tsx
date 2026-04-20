import { getStoreSettings } from '@/lib/getStoreSettings';
import ClosedStore from '@/components/ui/ClosedStore';

export default async function StoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeSettings = await getStoreSettings();

    if (storeSettings.status === 'closed') {
        return (
            <ClosedStore
                title={storeSettings.title}
                description={storeSettings.description}
                background={storeSettings.background}
            />
        );
    }

    return <>{children}</>;
}
