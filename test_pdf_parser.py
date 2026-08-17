import sys
sys.path.insert(0, r'C:\Users\anves\Documents\workspace\ledgerflow-ai\backend')

from app.services.pdf_parser import parse_invoice_from_pdf

with open(r'C:\Users\anves\Documents\workspace\sample_invoice.pdf', 'rb') as f:
    data = f.read()

result = parse_invoice_from_pdf(data)
print("Parsed invoice details:")
for key, value in result.items():
    print(f"  {key}: {value}")