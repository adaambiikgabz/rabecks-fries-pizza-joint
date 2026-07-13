export default {
  name: 'menuItem', title: 'Menu Item', type: 'document',
  fields: [
    { name: 'name',        title: 'Name',        type: 'string' },
    { name: 'description', title: 'Description', type: 'string' },
    { name: 'price',       title: 'Price (e.g. GHS 35)', type: 'string' },
    { name: 'category',    title: 'Category', type: 'string',
      options: { list: ['Fries', 'Pizza', 'Sides', 'Drinks'] } },
    { name: 'image',       title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'featured',    title: 'Show on homepage teaser', type: 'boolean' },
    { name: 'order',       title: 'Display Order', type: 'number' },
  ]
}
