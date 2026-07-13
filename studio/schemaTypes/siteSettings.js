export default {
  name: 'siteSettings', title: 'Site Settings', type: 'document',
  fields: [
    { name: 'phoneDisplay',  title: 'Phone (display format, e.g. 0548 960 695)', type: 'string' },
    { name: 'whatsapp',      title: 'WhatsApp Number (with country code, no +)', type: 'string' },
    { name: 'addressArea',   title: 'Area / City (e.g. Pantang West, Accra)', type: 'string' },
    { name: 'addressDetail', title: 'Exact Street Address', type: 'string' },
    { name: 'hoursLabel',    title: 'Hours Label (e.g. Monday – Sunday)', type: 'string' },
    { name: 'hoursValue',    title: 'Hours Value (e.g. 12:00pm – 11:30pm)', type: 'string' },
    { name: 'rating',        title: 'Customer Rating (e.g. 4.9)', type: 'string' },
    { name: 'heroKitchenImage',    title: 'Kitchen Action Photo', type: 'image', options: { hotspot: true } },
    { name: 'heroStorefrontImage', title: 'Storefront Photo', type: 'image', options: { hotspot: true } },
  ]
}
