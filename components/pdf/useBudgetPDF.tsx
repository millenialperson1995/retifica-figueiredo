import { usePDF } from '@react-pdf/renderer';
import BudgetPDF from './BudgetPDF';
import { Budget, Customer, Vehicle } from '@/lib/types';

interface UseBudgetPDFOptions {
  budget: Budget;
  customer: Customer;
  vehicle: Vehicle;
  logoPath?: string;
}

export const useBudgetPDF = ({ budget, customer, vehicle, logoPath = '/logo.png' }: UseBudgetPDFOptions) => {
  const [instance, updateInstance] = usePDF({
    document: (
      <BudgetPDF
        budget={budget}
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
    link.download = `orcamento-${budget.id.slice(-6).toUpperCase()}.pdf`;
    link.click();
  };

  return {
    instance,
    downloadPDF,
  };
};