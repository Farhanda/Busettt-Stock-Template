import React, { useEffect, useState } from 'react';
import { sendRequest } from '../utils/api';
import { ApiResponse } from '../utils/types';

interface Menu {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  availability_status: string;
}

export const PosView: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);

  const fetchMenus = async () => {
    const res = await sendRequest<Menu[]>('/menu', 'list');
    if (res.success && res.data) {
      setMenus(res.data);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleSale = async (menuId: string) => {
    const res = await sendRequest('/transaction', 'sell_menu', { 
      menu_id: menuId, 
      qty: 1 
    });
    
    if (res.success) {
      alert("Update success!");
      fetchMenus(); // Refresh stok real-time
    } else {
      alert(res.message); // Menampilkan pesan failed
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Kasir</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {menus.map((menu) => (
          <div key={menu.id} className="border p-4 rounded shadow">
            <h3>{menu.name}</h3>
            <p>Rp {menu.price.toLocaleString()}</p>
            
            {!menu.is_available && (
              <p className="text-red-500 text-sm font-italic">
                {menu.availability_status}
              </p>
            )}

            <button
              onClick={() => handleSale(menu.id)}
              disabled={!menu.is_available}
              className={`mt-2 px-4 py-2 rounded ${
                menu.is_available ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {menu.is_available ? 'Jual' : 'Habis'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};