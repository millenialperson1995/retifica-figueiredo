import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  referencia?: string; // Ponto de referência opcional
  userId: string;
  createdAt: Date;
}

interface Vehicle {
  id: string;
  customerId: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  engine: string; // Motor do veículo
  cylinder: string; // Cilindro do veículo
  chassisNumber: string; // Número do chassi
  userId: string;
}

interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PartItem {
  id: string;
  description: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  inventoryId?: string;
}

interface Budget {
  id: string;
  customerId: string;
  vehicleId: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  services: ServiceItem[];
  parts: PartItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
}

interface BudgetPDFProps {
  budget: Budget;
  customer: Customer;
  vehicle: Vehicle;
  logoPath?: string;
}

// Registrar fonte
Font.register({
  family: 'Open Sans',
  src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 8,
  },
  companyInfo: {
    flex: 1,
    marginRight: 15,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8, 
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
  },
  statusMessage: {
    textAlign: 'center',
    fontSize: 9,
    color: 'grey',
    marginBottom: 8,
    fontFamily: 'Open Sans',
  },
  statusHighlight: {
    fontWeight: 'bold',
  },
  companyDetails: {
    fontSize: 9,
    marginBottom: 3,
    fontFamily: 'Open Sans',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailBox: {
    borderWidth: 0.5,
    borderColor: '#000',
    padding: 6,
    flex: 1,
  },
  detailTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  detailText: {
    fontSize: 9,
    fontFamily: 'Open Sans',
  },
  table: {
    // 'table' is not in the TypeScript union for Display; cast to any to keep intended PDF layout
    display: 'table' as any,
    width: 'auto',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    backgroundColor: '#f0f0f0',
    borderColor: 'black',
    padding: 4,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'black',
    padding: 4,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  tableCell: {
    fontSize: 8,
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  tableCellLeft: {
    fontSize: 8,
    textAlign: 'left',
    fontFamily: 'Open Sans',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  totalBox: {
    borderWidth: 0.5,
    borderColor: '#000',
    padding: 6,
    width: 130,
  },
  totalText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  notesSection: {
    marginTop: 15,
  },
  notesText: {
    fontSize: 9,
    fontFamily: 'Open Sans',
  },
  serviceItemDescription: {
    fontSize: 8,
    fontFamily: 'Open Sans',
    marginTop: 3,
    textAlign: 'left',
    paddingHorizontal: 4,
  },
  partItemDescription: {
    fontSize: 8,
    fontFamily: 'Open Sans',
    marginTop: 3,
    textAlign: 'left',
    paddingHorizontal: 4,
  },
});

const BudgetPDF: React.FC<BudgetPDFProps> = ({ budget, customer, vehicle, logoPath = '/logo.png' }) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyDetails}>
              <Text style={{ fontWeight: 'bold' }}>RETÍFICA FIGUEIREDO</Text>
            </Text>
            <Text style={styles.companyDetails}>CNPJ: 33.925-338/0001-74</Text>
            <Text style={styles.companyDetails}>Av. Presidente Kennedy, 1956, loja T.: Peixinhos</Text>
            <Text style={styles.companyDetails}>CEP: 53.230-650</Text>
            <Text style={styles.companyDetails}>Telefone: (81) 9.8836-6701</Text>
            <Text style={styles.companyDetails}>Cidade/UF: OLINDA-PE</Text>
          </View>
          <Image style={styles.logo} src={logoPath} />
        </View>

        {/* Título */}
        <Text style={styles.title}>ORÇAMENTO N° {budget.id.slice(-6).toUpperCase()}</Text>

        {/* Status */}
        {budget.status === 'pending' && (
          <Text style={styles.statusMessage}>
            Status: <Text style={styles.statusHighlight}>Pendente</Text>
          </Text>
        )}

        {/* Detalhes do cliente e veículo */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailBox}>
            <Text style={styles.detailTitle}>DADOS DO CLIENTE</Text>
            <Text style={styles.detailText}>Nome: {customer.name}</Text>
            <Text style={styles.detailText}>CPF/CNPJ: {customer.cpfCnpj}</Text>
            <Text style={styles.detailText}>Telefone: {customer.phone}</Text>
            <Text style={styles.detailText}>Email: {customer.email}</Text>
            <Text style={styles.detailText}>Endereço: {customer.address}</Text>
            <Text style={styles.detailText}>Cidade/UF: {customer.city} - {customer.state}</Text>
            <Text style={styles.detailText}>CEP: {customer.zipCode}</Text>
            {customer.referencia && <Text style={styles.detailText}>Ponto de Referência: {customer.referencia}</Text>}
          </View>

          <View style={{ width: 10 }} />

          <View style={styles.detailBox}>
            <Text style={styles.detailTitle}>DADOS DO VEÍCULO</Text>
            <Text style={styles.detailText}>Placa: {vehicle.plate}</Text>
            <Text style={styles.detailText}>Fabricante: {vehicle.brand}</Text>
            <Text style={styles.detailText}>Modelo: {vehicle.model}</Text>
            <Text style={styles.detailText}>Ano/Mod: {vehicle.year}</Text>
            <Text style={styles.detailText}>Motor: {vehicle.engine}</Text>
            <Text style={styles.detailText}>Cilindro: {vehicle.cylinder}</Text>
            <Text style={styles.detailText}>Número: {vehicle.chassisNumber}</Text>
          </View>
        </View>

        {/* Data do orçamento */}
        <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
          <Text style={styles.detailText}>Data do Orçamento: {formatDate(budget.date)}</Text>
        </View>

        {/* Tabelas de serviços e peças lado a lado para melhor aproveitamento de espaço */}
        {budget.services && budget.services.length > 0 && budget.parts && budget.parts.length > 0 ? (
          // Se houver serviços e peças, exibir em colunas lado a lado
          <View style={{ flexDirection: 'row', marginBottom: 15 }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5, fontFamily: 'Open Sans' }}>
                SERVIÇOS
              </Text>
              <View style={[styles.table, { marginBottom: 0 }]}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableColHeader, { width: '60%' }]}>
                    <Text style={styles.tableCellHeader}>DESCRIÇÃO</Text>
                  </View>
                  <View style={[styles.tableColHeader, { width: '40%' }]}>
                    <Text style={styles.tableCellHeader}>TOTAL</Text>
                  </View>
                </View>
                {budget.services.map((service, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '60%' }]}>
                      <Text style={styles.tableCellLeft}>{service.description}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: '40%' }]}>
                      <Text style={styles.tableCell}>{formatCurrency(service.total)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5, fontFamily: 'Open Sans' }}>
                PEÇAS
              </Text>
              <View style={[styles.table, { marginBottom: 0 }]}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableColHeader, { width: '60%' }]}>
                    <Text style={styles.tableCellHeader}>DESCRIÇÃO</Text>
                  </View>
                  <View style={[styles.tableColHeader, { width: '40%' }]}>
                    <Text style={styles.tableCellHeader}>TOTAL</Text>
                  </View>
                </View>
                {budget.parts.map((part, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '60%' }]}>
                      <Text style={styles.tableCellLeft}>
                        {part.description}
                        {part.partNumber && ` (${part.partNumber})`}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, { width: '40%' }]}>
                      <Text style={styles.tableCell}>{formatCurrency(part.total)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          // Se houver apenas serviços ou apenas peças, exibir normalmente
          <>
            {budget.services && budget.services.length > 0 && (
              <>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6, fontFamily: 'Open Sans' }}>
                  SERVIÇOS
                </Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableColHeader, { width: '60%' }]}>
                      <Text style={styles.tableCellHeader}>DESCRIÇÃO</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: '40%' }]}>
                      <Text style={styles.tableCellHeader}>TOTAL</Text>
                    </View>
                  </View>
                  {budget.services.map((service, index) => (
                    <View key={index} style={styles.tableRow}>
                      <View style={[styles.tableCol, { width: '60%' }]}>
                        <Text style={styles.tableCellLeft}>{service.description}</Text>
                      </View>
                      <View style={[styles.tableCol, { width: '40%' }]}>
                        <Text style={styles.tableCell}>{formatCurrency(service.total)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {budget.parts && budget.parts.length > 0 && (
              <>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6, marginTop: 8, fontFamily: 'Open Sans' }}>
                  PEÇAS
                </Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableColHeader, { width: '60%' }]}>
                      <Text style={styles.tableCellHeader}>DESCRIÇÃO</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: '40%' }]}>
                      <Text style={styles.tableCellHeader}>TOTAL</Text>
                    </View>
                  </View>
                  {budget.parts.map((part, index) => (
                    <View key={index} style={styles.tableRow}>
                      <View style={[styles.tableCol, { width: '60%' }]}>
                        <Text style={styles.tableCellLeft}>
                          {part.description}
                          {part.partNumber && ` (${part.partNumber})`}
                        </Text>
                      </View>
                      <View style={[styles.tableCol, { width: '40%' }]}>
                        <Text style={styles.tableCell}>{formatCurrency(part.total)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}

        {/* Valores totais */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={styles.totalText}>SUBTOTAL: {formatCurrency(budget.subtotal)}</Text>
            {budget.discount > 0 && (
              <Text style={styles.totalText}>DESCONTO: -{formatCurrency(budget.discount)}</Text>
            )}
            <Text style={[styles.totalText, { fontWeight: 'bold', marginTop: 5 }]}>
              TOTAL: {formatCurrency(budget.total)}
            </Text>
          </View>
        </View>

        {/* Notas adicionais */}
        {budget.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.totalText}>Observações: {budget.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default BudgetPDF;