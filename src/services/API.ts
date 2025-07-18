import { Merchant, MerchantProduct, Product, Recipient, Transaction } from '../types';
import { Pagination, RecipientParams } from '../types/ComponentModels';
import axiosInstance from './Axios';

export class API {
    // GLOBAL
    static getProvinces() {
        return axiosInstance.get(`/recipients/statistics`);
    }

    // RECIPIENTS

    static getRecipientStatistics() {
        return axiosInstance.get(`/recipients/statistics`);
    }

    static getRecipients(params?: RecipientParams) {
        return axiosInstance.get(`/recipients`, { params: params });
    }

    static getRecipient(recipientId: string) {
        return axiosInstance.get(`/recipients/${recipientId}`);
    }

    static createRecipient(data: Recipient) {
        return axiosInstance.post(`/recipients`, data);
    }

    static updateRecipient(recipientId: string, data: Recipient) {
        return axiosInstance.patch(`/recipients/${recipientId}`, data);
    }

    static deleteRecipient(recipientId: string) {
        return axiosInstance.delete(`/recipients/${recipientId}`);
    }

    // PRODUCTS

    static getProducts(params?: Pagination) {
        return axiosInstance.get(`/products`, { params: params });
    }

    static getProduct(productId: string) {
        return axiosInstance.get(`/products/${productId}`);
    }

    static createProduct(data: Product) {
        return axiosInstance.post(`/products`, data);
    }

    static updateProduct(productId: string, data: Product) {
        return axiosInstance.patch(`/products/${productId}`, data);
    }

    static deleteProduct(productId: string) {
        return axiosInstance.delete(`/products/${productId}`);
    }

    // MERCHANTS

    static getMerchantStatistics() {
        return axiosInstance.get(`/merchants/statistics`);
    }

    static getMerchants(params?: Pagination) {
        return axiosInstance.get(`/merchants`, { params: params });
    }

    static getMerchant(merchantId: string) {
        return axiosInstance.get(`/merchants/${merchantId}`);
    }

    static createMerchant(data: Merchant) {
        return axiosInstance.post(`/merchants`, data);
    }

    static addMerchantProduct(merchantId: string, data: MerchantProduct[]) {
        return axiosInstance.post(`/merchants/${merchantId}/products`, data);
    }

    static updateMerchant(merchantId: string, data: Merchant) {
        return axiosInstance.patch(`/merchants/${merchantId}`, data);
    }

    static deleteMerchant(merchantId: string) {
        return axiosInstance.delete(`/merchants/${merchantId}`);
    }

    
    // TRANSACTIONS

    static getTransactions(params?: Pagination) {
        return axiosInstance.get(`/transactions`, { params: params });
    }

    static getTransaction(transactionNumber: string) {
        return axiosInstance.get(`/transactions/${transactionNumber}`);
    }

    static createTransaction(data: Transaction) {
        return axiosInstance.post(`/transactions`, data);
    } 

    static deleteTransaction(transactionNumber: string) {
        return axiosInstance.delete(`/transactions/${transactionNumber}`);
    }
    static approveTransaction(transactionNumber: string) {
        return axiosInstance.post(`/transactions/${transactionNumber}/approve`);
    }

    static rejectTransaction(transactionNumber: string, notes: string) {
        return axiosInstance.post(`/transactions/${transactionNumber}/reject`, { notes });
    }

    static getTransactionStatistics() {
        return axiosInstance.get(`/transactions/statistics`);
    }

}
