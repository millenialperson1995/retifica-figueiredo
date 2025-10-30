import { usePDF } from '@react-pdf/renderer';
import OrderPDF from './OrderPDF';
import { Order, Customer, Vehicle } from '@/lib/types';

interface UseOrderPDFOptions {
  order: Order;
  customer: Customer;
  vehicle: Vehicle;
  logoPath?: string;
}

export const useOrderPDF = ({ order, customer, vehicle, logoPath = '/logo.png' }: UseOrderPDFOptions) => {
  const [instance, updateInstance] = usePDF({
    document: (
      <OrderPDF
        order={order}
        customer={customer}
        vehicle={vehicle}
        logoPath={logoPath}
      />
    )
  });

  const downloadPDF = () => {
    if (instance.loading) {
      console.log('PDF ainda está sendo gerado...');
      return;
    }

    if (instance.error) {
      console.error('Erro ao gerar PDF:', instance.error);
      return;
    }

    // Criar link de download
    const link = document.createElement('a');
    link.href = instance.url || '';
    link.download = `ordem-servico-${order.id.slice(-6).toUpperCase()}.pdf`;
    link.click();
  };

  return {
    instance,
    downloadPDF,
  };
};