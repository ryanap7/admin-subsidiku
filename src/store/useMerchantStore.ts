import { create } from 'zustand';
import { API } from '../services/API';
import { Merchant, MerchantProduct } from '../types';
import { Pagination } from '../types/ComponentModels';

interface MerchantStore {
    merchants: Merchant[];
    merchantStatistics?: {
        activeMerchant: number;
        totalCapacity: number;
        totalMerchant: number;
    };
    loading: boolean;
    fetchMerchants: (params?: Pagination) => Promise<void>;
    fetchMerchantStatistics: () => Promise<void>;
    createMerchant: (data: Merchant) => Promise<void>;
    updateMerchant: (merchantId: string, data: Merchant) => Promise<void>;
    deleteMerchant: (merchantId: string) => Promise<void>;
    getMerchant: (merchantId: string) => Promise<Merchant>;
    addMerchantProduct: (merchantId: string, data: MerchantProduct[]) => Promise<void>;
}

export const useMerchantStore = create<MerchantStore>((set) => ({
    merchants: [],
    loading: false,

    fetchMerchants: async (params) => {
        set({ loading: true });
        try {
            const response = await API.getMerchants({...params, limit: 100});
            set({ merchants: response.data.data || response.data });
        } catch (error: unknown) {
            console.error('Failed to fetch merchants:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to fetch merchants');
            }
            throw new Error('Failed to fetch merchants');
        } finally {
            set({ loading: false });
        }
    },

    fetchMerchantStatistics: async () => {
        set({ loading: true });
        try {
            const response = await API.getMerchantStatistics();
            set({ merchantStatistics: response.data.data || response.data });
        } catch (error: unknown) {
            console.error('Failed to fetch merchant statistics:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to fetch merchant statistics');
            }
            throw new Error('Failed to fetch merchant statistics');
        } finally {
            set({ loading: false });
        }
    },

    createMerchant: async (data) => {
        set({ loading: true });
        try {
            const response = await API.createMerchant(data);
            const newMerchant = response.data.data || response.data;
            set((state) => ({ merchants: [...state.merchants, newMerchant] }));
            return newMerchant;
        } catch (error: unknown) {
            console.error('Failed to create merchant:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to create merchant');
            }
            throw new Error('Failed to create merchant');
        } finally {
            set({ loading: false });
        }
    },

    updateMerchant: async (merchantId, data) => {
        set({ loading: true });
        try {
            const response = await API.updateMerchant(merchantId, data);
            const updatedMerchant = response.data.data || response.data;
            set((state) => ({
                merchants: state.merchants.map((merchant) =>
                    merchant.id === merchantId ? updatedMerchant : merchant
                ),
            }));
            return updatedMerchant;
        } catch (error: unknown) {
            console.error('Failed to update merchant:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to update merchant');
            }
            throw new Error('Failed to update merchant');
        } finally {
            set({ loading: false });
        }
    },

    deleteMerchant: async (merchantId) => {
        set({ loading: true });
        try {
            await API.deleteMerchant(merchantId);
            set((state) => ({
                merchants: state.merchants.filter((merchant) => merchant.id !== merchantId),
            }));
        } catch (error: unknown) {
            console.error('Failed to delete merchant:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to delete merchant');
            }
            throw new Error('Failed to delete merchant');
        } finally {
            set({ loading: false });
        }
    },

    getMerchant: async (merchantId) => {
        try {
            const response = await API.getMerchant(merchantId);
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Failed to get merchant:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to get merchant');
            }
            throw new Error('Failed to get merchant');
        }
    },

    addMerchantProduct: async (merchantId, data) => {
        set({ loading: true });
        try {
            const response = await API.addMerchantProduct(merchantId, data);
            const addedProducts = response.data.data ?? [];
            set((state) => ({
                merchants: state.merchants.map((merchant) =>
                    merchant.id === merchantId
                        ? { ...merchant, products: [...merchant.products, ...addedProducts] }
                        : merchant
                ),
            }));
            return addedProducts;
        } catch (error: unknown) {
            console.error('Failed to add merchant product:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to add merchant product');
            }
            throw new Error('Failed to add merchant product');
        } finally {
            set({ loading: false });
        }
    },
}));

