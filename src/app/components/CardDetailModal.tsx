import { useState } from "react";
import React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "./ui/dialog";
import {
  Package, TrendingUp, ShoppingCart, AlertTriangle,
  ArrowUpRight, ArrowDownRight, LineChart, Calendar, CheckCircle, Clock, AlertCircle
} from "lucide-react";

interface CardDetail {
  title: string;
  icon?: React.ReactNode;
  data?: any;
}

const detailContent: Record<string, CardDetail & { children: React.ReactNode }> = {
  "Total Stok": {
    title: "Detail Total Stok",
    icon: <Package size={22} className="text-blue-600" />,
    children: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total Keseluruhan</p>
            <p className="text-2xl font-bold text-blue-600">2,450</p>
            <p className="text-xs text-gray-400 mt-1">unit</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Perubahan</p>
            <div className="flex items-center gap-1">
              <ArrowUpRight size={16} className="text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">+12.5%</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">dari bulan lalu</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Stok Per Kategori</h4>
          <div className="space-y-3">
            {[
              { name: "Ayam Potong", stok: 450, color: "bg-blue-500" },
              { name: "Ayam Hidup", stok: 680, color: "bg-emerald-500" },
              { name: "Telur", stok: 320, color: "bg-violet-500" },
              { name: "Hasil Olahan", stok: 150, color: "bg-orange-500" },
              { name: "Ayam Bibit", stok: 280, color: "bg-pink-500" },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-800">{item.stok} unit</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${(item.stok / 680) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-500">Catatan: Data diperbarui secara real-time</p>
        </div>
      </div>
    ),
  },

  "Total Penjualan": {
    title: "Detail Total Penjualan",
    icon: <TrendingUp size={22} className="text-emerald-600" />,
    children: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total Tahun Ini</p>
            <p className="text-2xl font-bold text-emerald-600">Rp 780M</p>
            <p className="text-xs text-gray-400 mt-1">2026</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Pertumbuhan</p>
            <div className="flex items-center gap-1">
              <ArrowUpRight size={16} className="text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">+18.2%</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs tahun lalu</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Penjualan Per Bulan</h4>
          <div className="space-y-2">
            {[
              { month: "Januari", amount: 42000000, target: 40000000 },
              { month: "Februari", amount: 38500000, target: 42000000 },
              { month: "Maret", amount: 55000000, target: 45000000 },
              { month: "April", amount: 47000000, target: 48000000 },
            ].map((item) => (
              <div key={item.month} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">Rp {(item.amount / 1000000).toFixed(0)}M</span>
                  <span className={`text-xs px-2 py-1 rounded ${item.amount >= item.target ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                    {item.amount >= item.target ? "✓ Tercapai" : "⚠ Kurang"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-500">Target bulanan: Rp 50M - 75M</p>
        </div>
      </div>
    ),
  },

  "Transaksi Bulan Ini": {
    title: "Detail Transaksi Bulan April",
    icon: <ShoppingCart size={22} className="text-violet-600" />,
    children: (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-violet-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-violet-600">1,284</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-emerald-600">1,089</p>
            <p className="text-xs text-gray-500 mt-1">Selesai</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">195</p>
            <p className="text-xs text-gray-500 mt-1">Proses</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Ringkasan Status</h4>
          <div className="space-y-3">
            {[
              { status: "Selesai", icon: <CheckCircle size={16} className="text-emerald-500" />, count: 1089, color: "bg-emerald-50" },
              { status: "Diproses", icon: <Clock size={16} className="text-blue-500" />, count: 156, color: "bg-blue-50" },
              { status: "Menunggu", icon: <AlertCircle size={16} className="text-yellow-500" />, count: 39, color: "bg-yellow-50" },
            ].map((item) => (
              <div key={item.status} className={`p-3 rounded-lg ${item.color} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-500">Data per: 18 April 2026</p>
        </div>
      </div>
    ),
  },

  "Stok Menipis": {
    title: "Detail Stok Menipis",
    icon: <AlertTriangle size={22} className="text-orange-600" />,
    children: (
      <div className="space-y-6">
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <p className="text-orange-800 text-sm font-semibold">⚠ Segera Lakukan Restok</p>
          <p className="text-orange-700 text-xs mt-1">14 produk mencapai level minimum stok</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Produk Dengan Stok Kritis</h4>
          {[
            { name: "Telur Ayam Segar (per karton)", current: 3, min: 10, category: "Telur", percentage: 30 },
            { name: "Ayam Broiler Bibit", current: 2, min: 5, category: "Ayam Bibit", percentage: 40 },
            { name: "Telur Omega 3 (per karton)", current: 8, min: 20, category: "Telur", percentage: 40 },
            { name: "Daging Ayam Premium", current: 5, min: 15, category: "Hasil Olahan", percentage: 33 },
            { name: "Ayam Kampung Hidup", current: 12, min: 30, category: "Ayam Hidup", percentage: 40 },
          ].map((item) => (
            <div key={item.name} className="border border-gray-100 p-3 rounded-lg hover:bg-orange-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                </div>
                <span className="text-xs font-bold text-orange-600">{item.percentage}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-orange-400" style={{ width: `${item.percentage}%` }} />
              </div>
              <p className="text-xs text-gray-500">{item.current} / {item.min} unit</p>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Buat Pesanan Restok
        </button>
      </div>
    ),
  },
};

interface CardDetailModalProps {
  isOpen: boolean;
  title: string | null;
  onClose: () => void;
}

export function CardDetailModal({ isOpen, title, onClose }: CardDetailModalProps) {
  const content = title && title in detailContent ? detailContent[title as keyof typeof detailContent] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {content?.icon}
            <DialogTitle>{content?.title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="mt-4">
          {content?.children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
