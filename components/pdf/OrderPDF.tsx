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

interface Order {
  id: string;
  customerId: string;
  vehicleId: string;
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  userId: string;
  services: ServiceItem[];
  parts: PartItem[];
  total: number;
  notes?: string;
  mechanicNotes?: string;
}

interface OrderPDFProps {
  order: Order;
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
    padding: 30,
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
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  companyInfo: {
    flex: 1,
    marginRight: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10, 
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
  },
  statusMessage: {
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
    marginBottom: 10,
    fontFamily: 'Open Sans',
  },
  statusHighlight: {
    fontWeight: 'bold',
  },
  companyDetails: {
    fontSize: 10,
    marginBottom: 5,
    fontFamily: 'Open Sans',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    flex: 1,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  detailText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    borderColor: 'black',
    padding: 8,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  tableCellLeft: {
    fontSize: 10,
    textAlign: 'left',
    fontFamily: 'Open Sans',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  totalBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    width: 150,
  },
  totalText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  signaturesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signatureBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    width: '45%',
  },
  signatureLine: {
    height: 40,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  notesSection: {
    marginTop: 20,
  },
  serviceItemDescription: {
    fontSize: 10,
    fontFamily: 'Open Sans',
    marginTop: 5,
    textAlign: 'left',
    paddingHorizontal: 8,
  },
  partItemDescription: {
    fontSize: 10,
    fontFamily: 'Open Sans',
    marginTop: 5,
    textAlign: 'left',
    paddingHorizontal: 8,
  },
});

const OrderPDF: React.FC<OrderPDFProps> = ({ order, customer, vehicle, logoPath = '/logo.png' }) => {
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
        <Text style={styles.title}>ORDEM DE SERVIÇO N° {order.id.slice(-6).toUpperCase()}</Text>

        {/* Status */}
        {order.status === 'pending' && (
          <Text style={styles.statusMessage}>
            Status: <Text style={styles.statusHighlight}>Pendente</Text>
          </Text>
        )}
        {order.status === 'in-progress' && (
          <Text style={styles.statusMessage}>
            Status: <Text style={styles.statusHighlight}>Em Andamento</Text>
          </Text>
        )}
        {order.status === 'completed' && (
          <Text style={styles.statusMessage}>
            Status: <Text style={styles.statusHighlight}>Concluída</Text>
          </Text>
        )}
        {order.status === 'cancelled' && (
          <Text style={styles.statusMessage}>
            Status: <Text style={styles.statusHighlight}>Cancelada</Text>
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

          <View style={{ width: 20 }} />

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

        {/* Datas da ordem de serviço */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailText}>Data de Início: {formatDate(order.startDate)}</Text>
            <Text style={styles.detailText}>Previsão de Término: {formatDate(order.estimatedEndDate)}</Text>
            {order.actualEndDate && <Text style={styles.detailText}>Data de Conclusão: {formatDate(order.actualEndDate)}</Text>}
          </View>
        </View>

        {/* Tabela de serviços */}
        {order.services && order.services.length > 0 && (
          <>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Open Sans' }}>
              SERVIÇOS
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>DESCRIÇÃO</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>QTD</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>VALOR UNIT</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>TOTAL</Text>
                </View>
              </View>
              {order.services.map((service, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellLeft}>{service.description}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{service.quantity}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(service.unitPrice)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(service.total)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Tabela de peças */}
        {order.parts && order.parts.length > 0 && (
          <>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginTop: 10, fontFamily: 'Open Sans' }}>
              PEÇAS
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>DESCRIÇÃO</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>QTD</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>VALOR UNIT</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>TOTAL</Text>
                </View>
              </View>
              {order.parts.map((part, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellLeft}>
                      {part.description}
                      {part.partNumber && ` (Ref: ${part.partNumber})`}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{part.quantity}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(part.unitPrice)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(part.total)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Valor total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={[styles.totalText, { fontWeight: 'bold', marginTop: 5 }]}>
              TOTAL: {formatCurrency(order.total)}
            </Text>
          </View>
        </View>

        {/* Notas adicionais */}
        {order.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.totalText}>Observações: {order.notes}</Text>
          </View>
        )}

        {order.mechanicNotes && (
          <View style={styles.notesSection}>
            <Text style={styles.totalText}>Anotações do Mecânico: {order.mechanicNotes}</Text>
          </View>
        )}

        {/* Campos de assinatura */}
        <View style={styles.signaturesSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.detailTitle}>ASSINATURA CLIENTE</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.detailText}>(Nome do Cliente)</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.detailTitle}>ASSINATURA RETÍFICA</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.detailText}>(Retífica Figueiredo)</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrderPDF;