// lib/apiOptimized.ts
// Serviço otimizado para acessar as APIs do sistema com paginação e cache

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Tipos para paginação
interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiServiceOptimized {
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
      // Log detalhado do erro para debug
      console.error(`API error ${response.status} ${response.statusText} at ${endpoint}`);
      
      try {
        // Tenta parsear o corpo da resposta como JSON
        const errorBody = await response.json();
        console.error('API Error Details:', errorBody);

        // Se tiver uma mensagem de erro específica, retorna ela
        if (errorBody?.error) {
          throw new Error(errorBody.error);
        }
      } catch (e) {
        // Se não conseguir parsear como JSON, usa a mensagem padrão
        let message = 'Erro na operação';
        
        switch (response.status) {
          case 400:
            message = 'Dados inválidos. Verifique as informações e tente novamente.';
            break;
          case 401:
            message = 'Não autorizado. Faça login novamente.';
            break;
          case 403:
            message = 'Você não tem permissão para realizar esta operação.';
            break;
          case 404:
            message = 'O recurso solicitado não foi encontrado.';
            break;
          case 409:
            message = 'Conflito de dados. O recurso já existe.';
            break;
          case 500:
            message = 'Erro interno do servidor. Tente novamente mais tarde.';
            break;
          default:
            message = 'Erro ao realizar operação. Tente novamente.';
        }
        
        throw new Error(message);
      }
    }

    return response.json();
  }

  // Customer API methods
  async getCustomers(pagination?: PaginationParams): Promise<PaginatedResponse<any> | any[]> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const endpoint = params.toString() ? `/customers?${params.toString()}` : '/customers';
    return this.request(endpoint);
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
  async getVehicles(pagination?: PaginationParams): Promise<PaginatedResponse<any> | any[]> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const endpoint = params.toString() ? `/vehicles?${params.toString()}` : '/vehicles';
    return this.request(endpoint);
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
  async getInventory(pagination?: PaginationParams): Promise<PaginatedResponse<any> | any[]> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const endpoint = params.toString() ? `/inventory?${params.toString()}` : '/inventory';
    return this.request(endpoint);
  }

  async getInventoryItem(id: string): Promise<any> {
    return this.request(`/inventory/${id}`);
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
  async getBudgets(pagination?: PaginationParams): Promise<PaginatedResponse<any> | any[]> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const endpoint = params.toString() ? `/budgets?${params.toString()}` : '/budgets';
    return this.request(endpoint);
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
  async getOrders(pagination?: PaginationParams): Promise<PaginatedResponse<any> | any[]> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const endpoint = params.toString() ? `/orders?${params.toString()}` : '/orders';
    return this.request(endpoint);
  }

  async getOrderById(id: string): Promise<any> {
    return this.request(`/orders/${id}`);
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
  async getServices(pagination?: PaginationParams): Promise<PaginatedResponse<any> | any[]> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const endpoint = params.toString() ? `/services?${params.toString()}` : '/services';
    return this.request(endpoint);
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

export const apiServiceOptimized = new ApiServiceOptimized();