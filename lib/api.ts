// lib/api.ts
// Serviço para acessar as APIs do sistema

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl = '/api'; // Usando rota interna do Next.js

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      cache: 'no-store', // Prevent caching
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (response.status === 401) {
      // Redirecionar para login se não autorizado
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
      throw new Error('Não autorizado: Faça login para acessar os dados');
    }

    if (!response.ok) {
      // Retornar informações específicas para tratamento de erros
      const errorText = await response.text();
      const error = new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      (error as any).status = response.status;
      (error as any).responseText = errorText;
      throw error;
    }

    return response.json();
  }

  // Customer API methods
  async getCustomers(): Promise<any[]> {
    return this.request('/customers');
  }

  async getCustomerById(id: string): Promise<any> {
    return this.request(`/customers/${id}`);
  }

  async createCustomer(customerData: any): Promise<any> {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(id: string, customerData: any): Promise<any> {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Vehicle API methods
  async getVehicles(): Promise<any[]> {
    return this.request('/vehicles');
  }

  async getVehicleById(id: string): Promise<any> {
    return this.request(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData: any): Promise<any> {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id: string, vehicleData: any): Promise<any> {
    return this.request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string): Promise<void> {
    return this.request(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // Inventory API methods
  async getInventory(): Promise<any[]> {
    return this.request('/inventory');
  }

  async createInventoryItem(itemData: any): Promise<any> {
    return this.request('/inventory', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateInventoryItem(id: string, itemData: any): Promise<any> {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteInventoryItem(id: string): Promise<void> {
    return this.request(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  // Budget API methods
  async getBudgets(): Promise<any[]> {
    return this.request('/budgets');
  }

  async getBudgetById(id: string): Promise<any> {
    return this.request(`/budgets/${id}`);
  }

  async createBudget(budgetData: any): Promise<any> {
    return this.request('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  }

  async updateBudget(id: string, budgetData: any): Promise<any> {
    return this.request(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    });
  }

  async deleteBudget(id: string): Promise<void> {
    return this.request(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Order API methods
  async getOrders(): Promise<any[]> {
    return this.request('/orders');
  }

  async createOrder(orderData: any): Promise<any> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id: string, orderData: any): Promise<any> {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  async deleteOrder(id: string): Promise<void> {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Service API methods
  async getServices(): Promise<any[]> {
    return this.request('/services');
  }

  async createService(serviceData: any): Promise<any> {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id: string, serviceData: any): Promise<any> {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id: string): Promise<void> {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();