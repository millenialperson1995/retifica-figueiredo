import { useState, useEffect, useCallback } from 'react';
import { apiServiceOptimized } from '@/lib/apiOptimized';

interface DataCache {
  customers: any[] | null;
  vehicles: any[] | null;
  lastUpdated: number;
}

const DATA_CACHE_TTL = 300000; // 5 minutos

export const useDataCache = () => {
  const [data, setData] = useState<DataCache>({ 
    customers: null, 
    vehicles: null, 
    lastUpdated: 0 
  });
  const [loading, setLoading] = useState(false);

  const loadCachedData = useCallback(async () => {
    const now = Date.now();
    
    // Verificar se os dados estão em cache e ainda são válidos
    if (data.customers && data.vehicles && (now - data.lastUpdated) < DATA_CACHE_TTL) {
      return { customers: data.customers, vehicles: data.vehicles };
    }

    setLoading(true);
    try {
      // Buscar dados apenas quando necessário
      const [customersRes, vehiclesRes] = await Promise.all([
        apiServiceOptimized.getCustomers(),
        apiServiceOptimized.getVehicles()
      ]);

      // Handle both paginated and non-paginated responses
      const customers = Array.isArray(customersRes) ? customersRes : (customersRes as any).data;
      const vehicles = Array.isArray(vehiclesRes) ? vehiclesRes : (vehiclesRes as any).data;

      setData({ customers, vehicles, lastUpdated: now });
      return { customers, vehicles };
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [data]);

  return { data, loading, loadCachedData };
};