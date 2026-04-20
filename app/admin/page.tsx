'use client';

import Sidebar from '@/components/admin/Sidebar';
import OverviewView from '@/components/admin/OverviewView';
import StoreSettingsView from '@/components/admin/StoreSettingsView';
import HeroSettingsView from '@/components/admin/HeroSettingsView';
import GallerySettingsView from '@/components/admin/GallerySettingsView';
import CatalogManagerView from '@/components/admin/CatalogManagerView';
import MobileHeader from '@/components/admin/MobileHeader';
import { useAdminDashboard } from './useAdminDashboard';

export default function AdminDashboard() {
    const {
        view, setView,
        items,
        heroImages, setHeroImages,
        landingGalleryImages, setLandingGalleryImages,
        heroTitle, setHeroTitle,
        heroDescription, setHeroDescription,
        loading, setLoading,
        showForm, setShowForm,
        categories,
        itemImageFile, setItemImageFile,
        formData, setFormData,
        galleryImageFiles, setGalleryImageFiles,
        galleryUrls, setGalleryUrls,
        editingId,
        isSidebarOpen, setIsSidebarOpen,
        updateCategories, deleteCategory, toggleStoreStatus, storeStatus,
        closedTitle, setClosedTitle, closedDescription, setClosedDescription, closedBackground, setClosedBackground,
        updateClosedStoreSettings, uploadClosedBackground,
        updateHeroSettings, uploadHeroImage,
        handleEdit, resetForm, handleSubmit, deleteItem,
        totalItems, totalValue, recentItems
    } = useAdminDashboard();

    return (
        <div className="flex min-h-screen bg-background font-sans relative">
            <Sidebar 
                view={view} 
                setView={setView} 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
            />

            <main className="flex-1 md:ml-64 p-6 md:p-12 w-full max-w-[100vw] transition-all">
                <div className="max-w-6xl mx-auto overflow-x-hidden">
                    <MobileHeader setIsSidebarOpen={setIsSidebarOpen} />

                    {view === 'overview' && (
                        <OverviewView 
                            totalItems={totalItems}
                            totalValue={totalValue}
                            categoriesCount={categories.length}
                            recentItems={recentItems}
                            setView={setView}
                            setShowForm={setShowForm}
                        />
                    )}

                    {view === 'store' && (
                        <StoreSettingsView 
                            storeStatus={storeStatus}
                            toggleStoreStatus={toggleStoreStatus}
                            closedTitle={closedTitle}
                            setClosedTitle={setClosedTitle}
                            closedDescription={closedDescription}
                            setClosedDescription={setClosedDescription}
                            closedBackground={closedBackground}
                            uploadClosedBackground={uploadClosedBackground}
                            updateClosedStoreSettings={updateClosedStoreSettings}
                        />
                    )}
                    
                    {view === 'hero' && (
                        <HeroSettingsView
                            heroTitle={heroTitle}
                            setHeroTitle={setHeroTitle}
                            heroDescription={heroDescription}
                            setHeroDescription={setHeroDescription}
                            heroImages={heroImages}
                            setHeroImages={setHeroImages}
                            uploadHeroImage={uploadHeroImage}
                            updateHeroSettings={updateHeroSettings}
                            loading={loading}
                        />
                    )}

                    {view === 'gallery' && (
                        <GallerySettingsView 
                            landingGalleryImages={landingGalleryImages}
                            setLandingGalleryImages={setLandingGalleryImages}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    )}

                    {view === 'catalog' && (
                        <CatalogManagerView 
                            items={items}
                            loading={loading}
                            showForm={showForm}
                            setShowForm={setShowForm}
                            editingId={editingId}
                            formData={formData}
                            setFormData={setFormData}
                            handleSubmit={handleSubmit}
                            resetForm={resetForm}
                            categories={categories}
                            updateCategories={updateCategories}
                            deleteCategory={deleteCategory}
                            itemImageFile={itemImageFile}
                            setItemImageFile={setItemImageFile}
                            galleryImageFiles={galleryImageFiles}
                            setGalleryImageFiles={setGalleryImageFiles}
                            galleryUrls={galleryUrls}
                            setGalleryUrls={setGalleryUrls}
                            handleEdit={handleEdit}
                            deleteItem={deleteItem}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
