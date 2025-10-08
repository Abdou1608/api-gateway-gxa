MS Word templates for document generation

- Place your .docx template files here.
- Default template used by WordTemplateService: contrat-template.docx

Placeholders syntax (docxtemplater):
- Simple fields: {{contrat.numero}}, {{client.nom}}, {{primeNette}}
- Nested objects: {{contrat.client.adresse.Ville}}
- Lists/tables:
  - Header row with placeholders
  - Surround rows with a loop: {{#garanties}}{{/garanties}}
    Example cells: {{libelle}}, {{plafond}}, {{franchise}}
- Dates and Money will be formatted in the service using Intl.* helpers.

Conventions:
- Root object key: contrat
- Client key: client
- Arrays: garanties, quittances

Updating template:
- Add/remove placeholders and update WordMergeData interface accordingly.
- For images (optional), use the image module placeholder syntax and ensure the service provides image data.
