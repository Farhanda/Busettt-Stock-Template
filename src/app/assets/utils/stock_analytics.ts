/**
 * Logic Perhitungan Analytics Dashboard (Optimized for ISO Date)
 */

interface StockMovement {
  id: number;
  productId: string;
  type: 'in' | 'out';
  qty: number;
  date: string; // Format: 2026-04-18T13:00:00
  [key: string]: any;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  [key: string]: any;
}

export const calculateStockAnalytics = (movements: StockMovement[], products: Product[]) => {
  // 1. TOP MOVING (Berdasarkan total keluar)
  const calculateTopMoving = () => {
    const outSummary: Record<string, number> = {};
    
    movements
      .filter(m => m.type === 'out')
      .forEach(m => {
        outSummary[m.productId] = (outSummary[m.productId] || 0) + m.qty;
      });

    return Object.entries(outSummary)
      .map(([id, totalOut]) => {
        const product = products.find(p => p.id === id);
        return {
          name: product?.name || `ID: ${id}`,
          keluar: totalOut,
          category: product?.category || "N/A"
        };
      })
      .sort((a, b) => b.keluar - a.keluar)
      .slice(0, 5);
  };

  // 2. WEEKLY HISTORY (Senin - Minggu)
  // Cara kerja: Mengambil index hari dari Date object (0=Minggu, 1=Senin, dst)
  const calculateWeeklyHistory = () => {
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    
    return days.map((day, index) => {
      const dayMovements = movements.filter(m => {
        const mDate = new Date(m.date);
        const dayIdx = mDate.getDay(); 
        // Normalisasi agar Senin = 0, Minggu = 6
        const normalizedIdx = dayIdx === 0 ? 6 : dayIdx - 1; 
        return normalizedIdx === index;
      });

      return {
        day,
        masuk: dayMovements.filter(m => m.type === 'in').reduce((s, c) => s + c.qty, 0),
        keluar: dayMovements.filter(m => m.type === 'out').reduce((s, c) => s + c.qty, 0)
      };
    });
  };

  // 3. MONTHLY HISTORY (Jan - Des)
  const calculateMonthlyHistory = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    return months.map((month, index) => {
        const monthMovements = movements.filter(m => new Date(m.date).getMonth() === index);
        
        const masuk = monthMovements.filter(m => m.type === 'in').reduce((s, c) => s + c.qty, 0);
        const keluar = monthMovements.filter(m => m.type === 'out').reduce((s, c) => s + c.qty, 0);
        let runningBalance = 0;

        // Perhitungan saldo sederhana (Stok awal bulan + masuk - keluar)
        // Catatan: Di backend nyata, saldo biasanya snapshot dari DB
        runningBalance += (masuk - keluar);
        return { month, masuk, keluar, saldo: runningBalance };
    });
  };

  return {
    topMoving: calculateTopMoving(),
    weeklyHistory: calculateWeeklyHistory(),
    monthlyHistory: calculateMonthlyHistory()
  };
};

// Add this helper to your stock_analytics.ts
export const calculateSingleProductAnalytics = (
  movements: StockMovement[], 
  productId: string
) => {
  // Filter movements for this product only
  const filteredMovements = movements.filter(m => m.productId === productId);

  const monthlyHistory = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
    .map((month, index) => {
      const monthMovements = filteredMovements.filter(m => new Date(m.date).getMonth() === index);
      return {
        month,
        masuk: monthMovements.filter(m => m.type === 'in').reduce((s, c) => s + c.qty, 0),
        keluar: monthMovements.filter(m => m.type === 'out').reduce((s, c) => s + c.qty, 0)
      };
    });

  return { monthlyHistory, totalIn: filteredMovements.filter(m => m.type === 'in').reduce((s, c) => s + c.qty, 0) };
};

// Tambahkan di stock_analytics.ts
export const calculateProductSummary = (movements: StockMovement[], productId: string, currentStock: number) => {
  const productMovements = movements.filter(m => m.productId === productId);
  
  // 1. Total Terjual Bulan Ini (Filter tipe 'out' dan bulan sekarang)
  const now = new Date();
  const currentMonthOut = productMovements
    .filter(m => {
      const d = new Date(m.date);
      return m.type === 'out' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, m) => sum + m.qty, 0);

  // 2. Rata-rata Keluar per Hari (Total keluar / jumlah hari yang sudah berjalan di bulan ini)
  const daysPassed = now.getDate();
  const avgPerDay = currentMonthOut / daysPassed;

  // 3. Estimasi Habis (Stok saat ini / rata-rata keluar per hari)
  const estimation = avgPerDay > 0 ? Math.ceil(currentStock / avgPerDay) : 0;

  return {
    currentMonthOut,
    avgPerDay: avgPerDay.toFixed(1),
    estimation
  };
};

// Tambahkan di dalam stock_analytics.ts
export const calculateCategoryStock = (products: Product[], movements: StockMovement[]) => {
  const categoryMap: Record<string, { name: string; stok: number; keluar: number }> = {};

  // 1. Inisialisasi & Hitung Stok saat ini berdasarkan kategori
  products.forEach(p => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = { name: p.category, stok: 0, keluar: 0 };
    }
    categoryMap[p.category].stok += p.stock;
  });

  // 2. Hitung total 'keluar' berdasarkan kategori
  movements.forEach(m => {
    if (m.type === 'out') {
      const product = products.find(p => p.id === m.productId);
      if (product && categoryMap[product.category]) {
        categoryMap[product.category].keluar += m.qty;
      }
    }
  });

  return Object.values(categoryMap);
};

export const calculateCategoryStockAnalytics = (products: Product[], movements: StockMovement[]) => {
  const categoryMap: Record<string, { name: string; stok: number; keluar: number }> = {};

  // 1. Hitung sisa stok fisik saat ini per kategori
  products.forEach(p => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = { name: p.category, stok: 0, keluar: 0 };
    }
    categoryMap[p.category].stok += p.stock;
  });

  // 2. Hitung total akumulasi barang keluar per kategori
  movements.forEach(m => {
    if (m.type === 'out') {
      // Cari produk untuk mengetahui kategorinya
      const product = products.find(p => p.id === m.productId);
      if (product && categoryMap[product.category]) {
        categoryMap[product.category].keluar += m.qty;
      }
    }
  });

  // Ubah object map menjadi array format yang diminta
  return Object.values(categoryMap);
};

// Tambahkan fungsi ini ke stock_analytics.ts
export const calculateCategoryStockStatus = (products: Product[]) => {
  return products.filter(p => {
    const isBelowMin = p.stock <= p.minStock;
    const isCrisisStatus = p.status === "low" || p.status === "empty";
    
    // Kembalikan true jika salah satu kondisi terpenuhi
    return isBelowMin || isCrisisStatus;
  })
  .map(p => ({
    name: p.name,
    stock: p.stock,
    min: p.minStock,
    status: p.status
  }));
};