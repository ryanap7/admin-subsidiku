import { create } from 'zustand';
import { API } from '../services/API';
import { Recipient } from '../types';
import { RecipientParams } from '../types/ComponentModels';

interface RecipientStore {
    recipients: Recipient[];
    recipientStatistics?: {
        activeRecipient: number;
        mampu: number;
        menengah: number;
        kurangMampu: number;
        totalRecipient: number;
    };
    loading: boolean;
    fetchRecipients: (params?: RecipientParams) => Promise<void>;
    fetchRecipientStatistics: () => Promise<void>;
    createRecipient: (data: Recipient) => Promise<void>;
    updateRecipient: (id: string, data: Recipient) => Promise<void>;
    deleteRecipient: (id: string) => Promise<void>;
    getRecipient: (id: string) => Promise<Recipient>
}

export const useRecipientStore = create<RecipientStore>((set) => ({
    recipients: [],
    loading: false,

    fetchRecipients: async (params) => {
        set({ loading: true });
        try {
            const response = await API.getRecipients({ ...params, limit: 100 });
            set({ recipients: response.data.data || response.data });
        } catch (error) {
            console.error('Failed to fetch recipients:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to fetch recipients');
            }
            throw new Error('Failed to fetch recipients');
        } finally {
            set({ loading: false });
        }
    },

    fetchRecipientStatistics: async () => {
        set({ loading: true });
        try {
            const response = await API.getRecipientStatistics();
            set({ recipientStatistics: response.data.data || response.data });
        } catch (error) {
            console.error('Failed to fetch recipient statistics:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to fetch recipient statistics');
            }
            throw new Error('Failed to fetch recipient statistics');
        } finally {
            set({ loading: false });
        }
    },

    createRecipient: async (data) => {
        set({ loading: true });
        try {
            const response = await API.createRecipient(data);
            set((state) => ({ recipients: [...state.recipients, response.data.data || response.data] }));
        } catch (error) {
            console.error('Failed to create recipient:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to create recipient');
            }
            throw new Error('Failed to create recipient');
        } finally {
            set({ loading: false });
        }
    },

    updateRecipient: async (id, data) => {
        set({ loading: true });
        try {
            await API.updateRecipient(id, data);
            set((state) => ({
                recipients: state.recipients.map((recipient) => (recipient.id === id ? { ...recipient, ...data } : recipient)),
            }));
        } catch (error) {
            console.error('Failed to update recipient:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to update recipient');
            }
            throw new Error('Failed to update recipient');
        } finally {
            set({ loading: false });
        }
    },

    deleteRecipient: async (id) => {
        set({ loading: true });
        try {
            await API.deleteRecipient(id);
            set((state) => ({ recipients: state.recipients.filter((recipient) => recipient.id !== id) }));
        } catch (error) {
            console.error('Failed to delete recipient:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to delete recipient');
            }
            throw new Error('Failed to delete recipient');
        } finally {
            set({ loading: false });
        }
    },

    getRecipient: async (id) => {
        try {
            const response = await API.getRecipient(id);
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
}));
