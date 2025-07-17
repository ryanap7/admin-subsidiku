import { create } from 'zustand';
import { API } from '../services/API';
import { Product } from '../types';
import { Pagination } from '../types/ComponentModels';

interface ProductStore {
    products: Product[];
    loading: boolean;
    fetchProducts: (params?: Pagination) => Promise<void>;
    getProduct: (productId: string) => Promise<Product>;
    createProduct: (data: Product) => Promise<void>;
    updateProduct: (productId: string, data: Product) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    loading: false,

    fetchProducts: async (params) => {
        set({ loading: true });
        try {
            const response = await API.getProducts(params);

            const data = response.data.data || response.data;
            set({ products: data });
            return data;
        } catch (error: unknown) {
            console.error('Failed to fetch products:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to fetch products');
            }
            throw new Error('Failed to fetch products');
        } finally {
            set({ loading: false });
        }
    },

    createProduct: async (data) => {
        set({ loading: true });
        try {
            const response = await API.createProduct(data);
            set((state) => ({ products: [...state.products, response.data.data || response.data] }));
        } catch (error: unknown) {
            console.error('Failed to create product:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to create product');
            }
            throw new Error('Failed to create product');
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (productId, data) => {
        set({ loading: true });
        try {
            const response = await API.updateProduct(productId, data);
            set((state) => ({
                products: state.products.map((product) => (product.id === productId ? response.data.data || response.data : product)),
            }));
        } catch (error: unknown) {
            console.error('Failed to update product:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to update product');
            }
            throw new Error('Failed to update product');
        } finally {
            set({ loading: false });
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            await API.deleteProduct(productId);
            set((state) => ({ products: state.products.filter((product) => product.id !== productId) }));
        } catch (error: unknown) {
            console.error('Failed to delete product:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to delete product');
            }
            throw new Error('Failed to delete product');
        } finally {
            set({ loading: false });
        }
    },

    getProduct: async (productId: string) => {
        try {
            const response = await API.getProduct(productId);
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Failed to get product:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to get product');
            }
            throw new Error('Failed to get product');
        }
    },
}));
