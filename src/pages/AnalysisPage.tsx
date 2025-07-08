import { motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  ChevronDown,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import animationData from "../assets/lottie/loading.json";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { Recipient } from "../types";

const mockAnalysisData: Record<string, Recipient[]> = {
  pupuk: [
    {
      id: "P1",
      nik: "3402141234567001",
      name: "Samsul Bahri",
      address: "Dusun Jati, Bantul",
      district: "Bantul",
      subsidyType: "pupuk",
      status: "active",
      remainingQuota: 15,
      monthlyQuota: 30,
      lastTransaction: "2024-06-12",
      classification: "poor",
      income: 950000,
      familyMembers: 6,
      landSize: 0.15,
      houseOwnership: "rented",
      vehicleOwnership: ["sepeda"],
      bankAccount: false,
      socialSecurityNumber: "KIS7001",
    },
    {
      id: "P2",
      nik: "3402141234567002",
      name: "Siti Aisyah",
      address: "Desa Trimulyo, Sleman",
      district: "Sleman",
      subsidyType: "pupuk",
      status: "active",
      remainingQuota: 10,
      monthlyQuota: 25,
      lastTransaction: "2024-06-05",
      classification: "poor",
      income: 850000,
      familyMembers: 5,
      landSize: 0.2,
      houseOwnership: "rented",
      vehicleOwnership: [],
      bankAccount: false,
      socialSecurityNumber: "KIS7002",
    },
    {
      id: "P3",
      nik: "3402141234567003",
      name: "Rohman Hidayat",
      address: "Jl. Merpati No. 10, Gunung Kidul",
      district: "Gunung Kidul",
      subsidyType: "pupuk",
      status: "active",
      remainingQuota: 5,
      monthlyQuota: 20,
      lastTransaction: "2024-05-28",
      classification: "poor",
      income: 780000,
      familyMembers: 7,
      landSize: 0.1,
      houseOwnership: "rented",
      vehicleOwnership: ["sepeda"],
      bankAccount: false,
      socialSecurityNumber: "KIS7003",
    },
    {
      id: "P4",
      nik: "3402141234567004",
      name: "Tuminah",
      address: "Jl. Nangka, Kulon Progo",
      district: "Kulon Progo",
      subsidyType: "pupuk",
      status: "active",
      remainingQuota: 8,
      monthlyQuota: 25,
      lastTransaction: "2024-06-01",
      classification: "poor",
      income: 920000,
      familyMembers: 4,
      landSize: 0.18,
      houseOwnership: "rented",
      vehicleOwnership: [],
      bankAccount: false,
      socialSecurityNumber: "KIS7004",
    },
    {
      id: "P5",
      nik: "3402141234567005",
      name: "Paidi",
      address: "Dusun Kalongan, Sleman",
      district: "Sleman",
      subsidyType: "pupuk",
      status: "active",
      remainingQuota: 12,
      monthlyQuota: 30,
      lastTransaction: "2024-06-10",
      classification: "poor",
      income: 990000,
      familyMembers: 6,
      landSize: 0.25,
      houseOwnership: "rented",
      vehicleOwnership: ["sepeda"],
      bankAccount: false,
      socialSecurityNumber: "KIS7005",
    },
  ],
  lpg: [
    {
      id: "L1",
      nik: "3402141234568001",
      name: "Nurhayati",
      address: "Desa Pleret, Bantul",
      district: "Bantul",
      subsidyType: "LPG",
      status: "active",
      remainingQuota: 10,
      monthlyQuota: 20,
      lastTransaction: "2024-06-15",
      classification: "poor",
      income: 850000,
      familyMembers: 4,
      landSize: 0.1,
      houseOwnership: "rented",
      vehicleOwnership: [],
      bankAccount: false,
      socialSecurityNumber: "KIS8001",
    },
    {
      id: "L2",
      nik: "3402141234568002",
      name: "Mulyani",
      address: "RT 04 RW 01, Wonosari",
      district: "Gunung Kidul",
      subsidyType: "LPG",
      status: "active",
      remainingQuota: 8,
      monthlyQuota: 20,
      lastTransaction: "2024-06-08",
      classification: "poor",
      income: 900000,
      familyMembers: 5,
      landSize: 0.12,
      houseOwnership: "rented",
      vehicleOwnership: [],
      bankAccount: false,
      socialSecurityNumber: "KIS8002",
    },
    {
      id: "L3",
      nik: "3402141234568003",
      name: "Karmin",
      address: "Kelurahan Caturharjo, Sleman",
      district: "Sleman",
      subsidyType: "LPG",
      status: "active",
      remainingQuota: 6,
      monthlyQuota: 15,
      lastTransaction: "2024-06-04",
      classification: "poor",
      income: 780000,
      familyMembers: 3,
      landSize: 0.05,
      houseOwnership: "rented",
      vehicleOwnership: [],
      bankAccount: false,
      socialSecurityNumber: "KIS8003",
    },
    {
      id: "L4",
      nik: "3402141234568004",
      name: "Sukirah",
      address: "Dusun Ploso, Bantul",
      district: "Bantul",
      subsidyType: "LPG",
      status: "active",
      remainingQuota: 9,
      monthlyQuota: 20,
      lastTransaction: "2024-06-07",
      classification: "poor",
      income: 910000,
      familyMembers: 4,
      landSize: 0.09,
      houseOwnership: "rented",
      vehicleOwnership: ["sepeda"],
      bankAccount: false,
      socialSecurityNumber: "KIS8004",
    },
    {
      id: "L5",
      nik: "3402141234568005",
      name: "Tarman",
      address: "Dusun Krapyak, Kulon Progo",
      district: "Kulon Progo",
      subsidyType: "LPG",
      status: "active",
      remainingQuota: 7,
      monthlyQuota: 20,
      lastTransaction: "2024-06-03",
      classification: "poor",
      income: 930000,
      familyMembers: 6,
      landSize: 0.11,
      houseOwnership: "rented",
      vehicleOwnership: [],
      bankAccount: false,
      socialSecurityNumber: "KIS8005",
    },
  ],
};

const getClassificationIcon = (classification: string) => {
  switch (classification) {
    case "poor":
      return TrendingDown;
    case "middle":
      return DollarSign;
    case "rich":
      return TrendingUp;
    default:
      return DollarSign;
  }
};

const getClassificationLabel = (classification: string) => {
  switch (classification) {
    case "poor":
      return "Kurang Mampu";
    case "middle":
      return "Menengah";
    case "rich":
      return "Mampu";
    default:
      return classification;
  }
};

const getClassificationColor = (classification: string) => {
  switch (classification) {
    case "poor":
      return "bg-red-100 text-red-800";
    case "middle":
      return "bg-yellow-100 text-yellow-800";
    case "rich":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);

const AnalysisPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recipient[]>([]);

  const handleSearch = () => {
    setLoading(true);
    setResults([]);

    // Delay 2.5s biar Lottie selesai main
    setTimeout(() => {
      setResults(mockAnalysisData[selectedType] || []);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Analisis Kelayakan Penerima
          </h1>
          <p className="text-gray-600 mt-1">
            Pilih jenis subsidi untuk melihat siapa yang layak menerima
          </p>
        </div>
      </motion.div>

      {/* Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-64">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none w-full pl-4 pr-12 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="">Pilih Jenis Subsidi</option>
              <option value="pupuk">Pupuk</option>
              <option value="lpg">LPG</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          <Button
            variant="primary"
            disabled={!selectedType || loading}
            onClick={handleSearch}
          >
            Cari
          </Button>
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center pt-10">
          <Lottie animationData={animationData} style={{ width: 300 }} />
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penerima
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klasifikasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pendapatan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((recipient) => {
                    const Icon = getClassificationIcon(
                      recipient.classification
                    );
                    return (
                      <tr
                        key={recipient.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {recipient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {recipient.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {recipient.district}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {recipient.nik}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {recipient.address}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Icon className="w-4 h-4 mr-2 text-gray-400" />
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClassificationColor(
                                recipient.classification
                              )}`}
                            >
                              {getClassificationLabel(recipient.classification)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(recipient.income)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AnalysisPage;
