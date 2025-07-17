import { create } from 'zustand';
import { API } from '../services/API';
import { Transaction } from '../types';
import { Pagination } from '../types/ComponentModels';

interface TransactionStore {
    transactions: Transaction[];
    transactionStatistics?: {
        totalTransactions: number;
        successTransactions: number;
        pendingTransactions: number;
        canceledTransactions: number;
    };
    loading: boolean;
    fetchTransactions: (params?: Pagination) => Promise<void>;
    getTransaction: (transactionId: string) => Promise<Transaction>;
    createTransaction: (data: Transaction) => Promise<void>;
    deleteTransaction: (transactionId: string) => Promise<void>;
    approveTransaction: (transactionId: string) => Promise<void>;
    rejectTransaction: (transactionId: string) => Promise<void>;
    fetchTransactionStatistics: () => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
    transactions: [],
    loading: false,

    fetchTransactions: async (params) => {
        set({ loading: true });
        try {
            const response = await API.getTransactions(params);

            const data = response.data.data || response.data;
            set({ transactions: data });
            return data;
        } catch (error: unknown) {
            console.error('Failed to fetch transactions:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to fetch transactions');
            }
            throw new Error('Failed to fetch transactions');
        } finally {
            set({ loading: false });
        }
    },

    createTransaction: async (data) => {
        set({ loading: true });
        try {
            const response = await API.createTransaction(data);
            set((state) => ({ transactions: [...state.transactions, response.data.data || response.data] }));
        } catch (error: unknown) {
            console.error('Failed to create transaction:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to create transaction');
            }
            throw new Error('Failed to create transaction');
        } finally {
            set({ loading: false });
        }
    },

    deleteTransaction: async (transactionId) => {
        set({ loading: true });
        try {
            await API.deleteTransaction(transactionId);
            set((state) => ({ transactions: state.transactions.filter((transaction) => String(transaction.id) !== transactionId) }));
        } catch (error: unknown) {
            console.error('Failed to delete transaction:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to delete transaction');
            }
            throw new Error('Failed to delete transaction');
        } finally {
            set({ loading: false });
        }
    },

    approveTransaction: async (transactionId) => {
        set({ loading: true });
        try {
            await API.approveTransaction(transactionId);
            set((state) => ({
                transactions: state.transactions.map((transaction) =>
                    String(transaction.id) === String(transactionId) ? { ...transaction, status: 'approved' } : transaction
                ),
            }));
        } catch (error: unknown) {
            console.error('Failed to approve transaction:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to approve transaction');
            }
            throw new Error('Failed to approve transaction');
        } finally {
            set({ loading: false });
        }
    },

    rejectTransaction: async (transactionId) => {
        set({ loading: true });
        try {
            await API.rejectTransaction(transactionId);
            set((state) => ({
                transactions: state.transactions.map((transaction) =>
                    String(transaction.id) === String(transactionId) ? { ...transaction, status: 'rejected' } : transaction
                ),
            }));
        } catch (error: unknown) {
            console.error('Failed to reject transaction:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to reject transaction');
            }
            throw new Error('Failed to reject transaction');
        } finally {
            set({ loading: false });
        }
    },

    fetchTransactionStatistics: async () => {
        set({ loading: true });
        try {
            const response = await API.getTransactionStatistics();
            set({ transactionStatistics: response.data.data || response.data });
        } catch (error: unknown) {
            console.error('Failed to fetch transaction statistics:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to fetch transaction statistics');
            }
            throw new Error('Failed to fetch transaction statistics');
        } finally {
            set({ loading: false });
        }
    },

    getTransaction: async (transactionId: string) => {
        try {
            const response = await API.getTransaction(transactionId);
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Failed to get transaction:', error);
            if (error instanceof Error && 'response' in error) {
                const responseError = error as { response: { data: { message?: string } } };
                throw new Error(responseError.response.data.message || 'Failed to get transaction');
            }
            throw new Error('Failed to get transaction');
        }
    },
}));
