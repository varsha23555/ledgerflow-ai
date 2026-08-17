from fpdf import FPDF

class InvoicePDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'INVOICE', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def generate(self, vendor, amount, invoice_date, due_date, inv_num):
        self.add_page()
        self.set_font('Arial', '', 12)

        # Invoice details
        self.cell(0, 10, f'Invoice Number: {inv_num}', 0, 1)
        self.cell(0, 10, f'Vendor: {vendor}', 0, 1)
        self.cell(0, 10, f'Invoice Date: {invoice_date}', 0, 1)
        self.cell(0, 10, f'Due Date: {due_date}', 0, 1)
        self.ln(10)

        # Amount
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, f'Total Amount: ${amount:,.2f}', 0, 1, 'R')
        self.ln(15)

        # Description
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 10, 'Description: Web design services for Q3 2026 project')
        self.ln(5)

        # Payment terms
        self.set_font('Arial', 'I', 10)
        self.cell(0, 10, 'Payment Terms: Net 30', 0, 1)
        self.cell(0, 10, 'Contact: billing@example.com', 0, 1)

# Generate the invoice
pdf = InvoicePDF()
pdf.generate(vendor='John', amount=2500.00,
             invoice_date='2026-08-15', due_date='2026-09-14',
             inv_num='INV-2026-025')
pdf.output('sample_invoice.pdf')
print('Sample invoice PDF created successfully!')
print('Path: C:\\Users\\anves\\Documents\\workspace\\ledgerflow-ai\\sample_invoice.pdf')