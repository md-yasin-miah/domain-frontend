import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { formatCurrency, timeFormat } from "@/lib/helperFun";

// Register fonts if needed (optional)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf'
// });

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 16,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "medium",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  headerRight: {
    textAlign: "right",
  },
  label: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#111827",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "medium",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  twoColumn: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  column: {
    flex: 1,
  },
  infoBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: "medium",
    color: "#111827",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 9,
    fontWeight: "medium",
    color: "#111827",
  },
  table: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "medium",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableCellDescription: {
    flex: 1,
  },
  tableCellAmount: {
    width: 100,
    textAlign: "right",
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#111827",
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 9,
    color: "#6b7280",
  },
  itemAmount: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#111827",
  },
  totalsContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  totalsBox: {
    width: 200,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#374151",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "semibold",
    color: "#111827",
  },
  paymentInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #f3f4f6",
  },
  paymentText: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: 16,
    marginTop: 24,
  },
  footerRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  footerColumn: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#374151",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 9,
    color: "#6b7280",
  },
  footerNote: {
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 16,
  },
  status: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  statusValue: {
    fontWeight: "medium",
    textTransform: "capitalize",
  },
});

interface InvoicePDFProps {
  order: Order;
  invoice?: Invoice;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ order, invoice }) => {
  const invoiceNumber = invoice?.invoice_number || `INV-${order.order_number}`;
  const invoiceDate =
    invoice?.issue_date || invoice?.created_at || new Date().toISOString();
  const dueDate = invoice?.due_date || null;
  const status = invoice?.status || "draft";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>INVOICE</Text>
              <Text style={styles.subtitle}>Invoice Number: {invoiceNumber}</Text>
              {invoice && (
                <Text style={styles.status}>
                  Status: <Text style={styles.statusValue}>{status}</Text>
                </Text>
              )}
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.label}>Date Issued:</Text>
              <Text style={styles.value}>
                {timeFormat(invoiceDate, "MMM DD, YYYY")}
              </Text>
              {dueDate && (
                <>
                  <Text style={[styles.label, { marginTop: 8 }]}>Due Date:</Text>
                  <Text style={styles.value}>
                    {timeFormat(dueDate, "MMM DD, YYYY")}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Company & Client Info */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>From:</Text>
            <View>
              <Text style={[styles.value, { marginBottom: 4 }]}>
                Adominoz Marketplace
              </Text>
              <Text style={styles.subtitle}>Digital Asset Marketplace</Text>
              <Text style={[styles.subtitle, { marginTop: 6 }]}>
                support@adominoz.com
              </Text>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <View>
              <Text style={[styles.value, { marginBottom: 4 }]}>
                {order.buyer?.username || order.buyer?.email || "Customer"}
              </Text>
              {order.buyer?.email && (
                <Text style={styles.subtitle}>{order.buyer.email}</Text>
              )}
              <Text style={[styles.subtitle, { marginTop: 6 }]}>
                Order #: {order.order_number}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details:</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              {order.listing?.title || `Listing #${order.listing_id}`}
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Listing ID:</Text>
              <Text style={styles.infoValue}>#{order.listing_id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID:</Text>
              <Text style={styles.infoValue}>#{order.id}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableCellDescription}>
              <Text style={styles.tableHeaderText}>Description</Text>
            </View>
            <View style={styles.tableCellAmount}>
              <Text style={[styles.tableHeaderText, { textAlign: "right" }]}>
                Amount
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCellDescription}>
              <Text style={styles.itemTitle}>Listing Price</Text>
              <Text style={styles.itemSubtitle}>
                {order.listing?.title || `Listing #${order.listing_id}`}
              </Text>
            </View>
            <View style={styles.tableCellAmount}>
              <Text style={styles.itemAmount}>
                {formatCurrency(order.listing_price)} {order.currency}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCellDescription}>
              <Text style={styles.itemTitle}>Platform Fee</Text>
              <Text style={styles.itemSubtitle}>Service charge</Text>
            </View>
            <View style={styles.tableCellAmount}>
              <Text style={styles.itemAmount}>
                {formatCurrency(order.platform_fee)} {order.currency}
              </Text>
            </View>
          </View>

          {order.seller_amount && (
            <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
              <View style={styles.tableCellDescription}>
                <Text style={styles.itemTitle}>Seller Amount</Text>
              </View>
              <View style={styles.tableCellAmount}>
                <Text style={styles.itemAmount}>
                  {formatCurrency(order.seller_amount)} {order.currency}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(order.final_price)} {order.currency}
              </Text>
            </View>
            {order.payment_method && (
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentText}>
                  Payment Method:{" "}
                  <Text style={styles.value}>{order.payment_method}</Text>
                </Text>
                {order.payment_transaction_id && (
                  <Text style={styles.paymentText}>
                    Transaction ID:{" "}
                    <Text style={styles.value}>
                      #{order.payment_transaction_id}
                    </Text>
                  </Text>
                )}
                {order.paid_at && (
                  <Text style={styles.paymentText}>
                    Paid On:{" "}
                    <Text style={styles.value}>
                      {timeFormat(order.paid_at, "MMM DD, YYYY")}
                    </Text>
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Payment Terms:</Text>
              <Text style={styles.footerText}>
                Payment is due upon receipt of this invoice.
              </Text>
            </View>
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Thank You:</Text>
              <Text style={styles.footerText}>
                Thank you for your business!
              </Text>
            </View>
          </View>
          <View style={styles.footerNote}>
            <Text>
              This is an automatically generated invoice from Adominoz Marketplace
            </Text>
            <Text style={{ marginTop: 4 }}>
              Generated on{" "}
              {timeFormat(new Date().toISOString(), "MMM DD, YYYY HH:mm")}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

