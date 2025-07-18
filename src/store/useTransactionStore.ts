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
    getTransaction: (transactionNumber: string) => Promise<Transaction>;
    createTransaction: (data: Transaction) => Promise<void>;
    deleteTransaction: (transactionNumber: string) => Promise<void>;
    approveTransaction: (transactionNumber: string) => Promise<void>;
    rejectTransaction: (transactionNumber: string, notes: string) => Promise<void>;
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

    deleteTransaction: async (transactionNumber) => {
        set({ loading: true });
        try {
            await API.deleteTransaction(transactionNumber);
            set((state) => ({ transactions: state.transactions.filter((transaction) => String(transaction.id) !== transactionNumber) }));
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

    approveTransaction: async (transactionNumber) => {
        set({ loading: true });
        try {
            await API.approveTransaction(transactionNumber);
            set((state) => ({
                transactions: state.transactions.map((transaction) =>
                    String(transaction.id) === String(transactionNumber) ? { ...transaction, status: 'approved' } : transaction
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

    rejectTransaction: async (transactionNumber, notes: string) => {
        set({ loading: true });
        try {
            await API.rejectTransaction(transactionNumber, notes);
            set((state) => ({
                transactions: state.transactions.map((transaction) =>
                    String(transaction.id) === String(transactionNumber) ? { ...transaction, status: 'rejected' } : transaction
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

    getTransaction: async (transactionNumber: string) => {
        try {
            const response = await API.getTransaction(transactionNumber);
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
