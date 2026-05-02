const isBrowser = typeof window !== 'undefined';

const getDataLayer = () => {
  if (!isBrowser) {
    return null;
  }

  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

const cleanObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(cleanObject);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, item]) => {
      if (item !== undefined && item !== null && item !== '') {
        acc[key] = cleanObject(item);
      }
      return acc;
    }, {});
  }

  return value;
};

const parsePrice = (item = {}) => {
  if (typeof item.price === 'number') {
    return item.price;
  }

  if (typeof item.amount === 'number') {
    return item.amount;
  }

  const priceLabel = item.priceLabel || item.priceRange || item.price || item.amount || '';
  const parsed = Number(String(priceLabel).replace(/[^0-9.]/g, ''));

  return Number.isFinite(parsed) ? parsed : 0;
};

export const pushToDataLayer = (payload) => {
  const dataLayer = getDataLayer();

  if (!dataLayer || !payload) {
    return;
  }

  // GA4 ecommerce events should be cleared before each new ecommerce payload.
  dataLayer.push(payload.ecommerce === null ? payload : cleanObject(payload));
};

export const pushPageView = ({ pageType, pageTitle, contentGroup, extra = {} }) => {
  pushToDataLayer({
    event: 'page_view',
    page_type: pageType,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    content_group: contentGroup,
    ...extra,
  });
};

export const toGa4Item = (item = {}, index = 0, overrides = {}) => ({
  item_id: String(item.id || item._id || item.slug || item.title || item.name),
  item_name: item.title || item.name,
  item_category: item.category || item.serviceCategory,
  item_variant: item.badge || item.status,
  price: parsePrice(item),
  quantity: 1,
  index,
  ...overrides,
});

export const pushViewItem = ({ item, itemListName, index = 0 }) => {
  const value = parsePrice(item);

  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: item.currency || 'USD',
      value,
      items: [toGa4Item(item, index, { item_list_name: itemListName })],
    },
  });
};

export const pushViewItemList = ({ items, itemListId, itemListName }) => {
  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event: 'view_item_list',
    ecommerce: {
      item_list_id: itemListId,
      item_list_name: itemListName,
      items: items.map((item, index) => toGa4Item(item, index, { item_list_name: itemListName })),
    },
  });
};

export const pushAddToCart = ({ item, index = 0, itemListName = 'Store' }) => {
  const value = parsePrice(item);

  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: item.currency || 'USD',
      value,
      items: [toGa4Item(item, index, { item_list_name: itemListName })],
    },
  });
};

export const pushContactFormSuccess = ({ selectedService }) => {
  pushToDataLayer({
    event: 'generate_lead',
    form_id: 'contact_form',
    form_name: 'Contact Form',
    page_type: 'contact',
    lead_service: selectedService || 'Not selected',
  });
};
