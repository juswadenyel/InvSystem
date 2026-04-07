export function renderProductTable(products) {
    if (products.length === 0) {
        return `<tr><td colspan="7" class="empty-row">No products found</td></tr>`
    }

    return products.map(p => {
        const discountedPrice = p.discount > 0
            ? p.price - (p.price * p.discount / 100)
            : p.price

        const stockClass = p.stock === 0 ? 'stock-out' : p.stock <= 5 ? 'stock-low' : 'stock-ok'

        return `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td><span class="category-badge">${p.category || 'Uncategorized'}</span></td>
            <td>₱${p.price.toFixed(2)}</td>
            <td>${p.discount > 0 ? `<span class="discount-badge">-${p.discount}%</span> ₱${discountedPrice.toFixed(2)}` : '—'}</td>
            <td><span class="stock-badge ${stockClass}">${p.stock}</span></td>
            <td>
                <button class="btn-edit" data-id="${p.id}">Edit</button>
                <button class="btn-delete" data-id="${p.id}">Delete</button>
                <button class="btn-sell" data-id="${p.id}" data-name="${encodeURIComponent(p.name)}" data-price="${discountedPrice}">Sell</button>
            </td>
        </tr>`
    }).join('')
}

export function renderPurchaseTable(purchases) {
    if (purchases.length === 0) {
        return `<tr><td colspan="7" class="empty-row">No purchases yet</td></tr>`
    }

    return purchases.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.product_name}</td>
            <td>${p.customer_name}</td>
            <td>${p.customer_contact || '—'}</td>
            <td>${p.quantity}</td>
            <td>₱${Number(p.total_price).toFixed(2)}</td>
            <td><span class="paid-badge ${p.is_paid ? 'paid' : 'unpaid'}">${p.is_paid ? 'Paid' : 'Unpaid'}</span></td>
        </tr>`
    ).join('')
}