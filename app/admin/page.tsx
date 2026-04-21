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
        <div className="flex min-h-screen bg-[#f8f9fa] font-sans relative overflow-hidden text-slate-800">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-slate-200/50 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-slate-300/40 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-slate-200/40 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
            </div>

            {/* Content wrapper */}
            <div className="relative z-10 flex min-h-screen w-full">
            <Sidebar
                view={view}
                setView={setView}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <main className={`flex-1 p-6 md:p-12 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-0'}`}>
                {/* Desktop Sidebar Toggle when Closed */}
                {!isSidebarOpen && (
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="hidden md:flex fixed top-8 left-8 z-40 p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm text-slate-800 hover:bg-white hover:shadow-md transition-all group hover:scale-105"
                    >
                        <span className="material-symbols-outlined text-[20px]! opacity-70 group-hover:opacity-100">menu</span>
                    </button>
                )}
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
        </div>
    );
}
