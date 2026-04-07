import { supabase } from './config/supabase.js'
import { renderNavbar, initNavbar } from './components/navbar.js'
import { openModal, closeModal, initModals } from './components/modal.js'
import { renderProductTable, renderPurchaseTable } from './components/table.js'

let allProducts = []
let editingId = null

async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    const email = session?.user?.email ?? 'admin@test.com'
    document.getElementById('navbar').innerHTML = renderNavbar(email)
    initNavbar()
    initModals()
    initEvents()
    await loadProducts()
    await loadPurchases()
}

async function loadProducts() {
    const search = document.getElementById('searchInput').value
    const category = document.getElementById('categoryFilter').value

    let query = supabase.from('products').select('*').order('name')
    if (category) query = query.eq('category', category)
    if (search) query = query.ilike('name', `%${search}%`)

    const { data, error } = await query
    if (error) { console.error('Error loading products:', error); return }

    allProducts = data
    document.getElementById('productTableBody').innerHTML = renderProductTable(allProducts)
    document.getElementById('totalProducts').textContent = allProducts.length
    document.getElementById('totalStock').textContent = allProducts.reduce((a, b) => a + b.stock, 0)
    initTableEvents()
}

async function loadPurchases() {
    const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('purchase_date', { ascending: false })
    if (error) { console.error('Error loading purchases:', error); return }
    document.getElementById('purchaseTableBody').innerHTML = renderPurchaseTable(data)
    initPurchaseEvents() // ← add this line
}

function initEvents() {
    document.getElementById('searchInput').addEventListener('input', loadProducts)
    document.getElementById('categoryFilter').addEventListener('change', loadProducts)

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        await supabase.auth.signOut()
        window.location.href = 'index.html'
    })

    document.getElementById('addProductBtn').addEventListener('click', () => {
        editingId = null
        document.getElementById('modalTitle').textContent = 'Add Product'
        document.getElementById('productForm').reset()
        openModal('productModal')
    })

    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault()
        const product = {
            name: document.getElementById('prodName').value,
            category: document.getElementById('prodCategory').value,
            price: parseFloat(document.getElementById('prodPrice').value),
            stock: parseInt(document.getElementById('prodStock').value),
            discount: parseFloat(document.getElementById('prodDiscount').value) || 0
        }
        if (editingId) {
            await supabase.from('products').update(product).eq('id', editingId)
        } else {
            await supabase.from('products').insert([product])
        }
        closeModal('productModal')
        await loadProducts()
    })

    document.getElementById('sellForm').addEventListener('submit', async (e) => {
        e.preventDefault()
        const productId = parseInt(document.getElementById('sellProductId').value)
        const product = allProducts.find(p => p.id === productId)
        const quantity = parseInt(document.getElementById('sellQty').value)
        const unitPrice = parseFloat(document.getElementById('sellPrice').value)
        await supabase.from('purchases').insert([{
            product_id: productId,
            product_name: product.name,
            customer_name: document.getElementById('sellCustomer').value,
            customer_contact: document.getElementById('sellContact').value,
            quantity,
            unit_price: unitPrice,
            total_price: unitPrice * quantity,
            is_paid: document.getElementById('sellPaid').checked
        }])
        await supabase.from('products').update({ stock: product.stock - quantity }).eq('id', productId)
        closeModal('sellModal')
        await loadProducts()
        await loadPurchases()
    })
}

function initTableEvents() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = allProducts.find(p => p.id === parseInt(btn.dataset.id))
            editingId = product.id
            document.getElementById('modalTitle').textContent = 'Edit Product'
            document.getElementById('prodName').value = product.name
            document.getElementById('prodCategory').value = product.category || ''
            document.getElementById('prodPrice').value = product.price
            document.getElementById('prodStock').value = product.stock
            document.getElementById('prodDiscount').value = product.discount
            openModal('productModal')
        })
    })

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this product?')) {
                await supabase.from('products').delete().eq('id', parseInt(btn.dataset.id))
                await loadProducts()
            }
        })
    })

    document.querySelectorAll('.btn-sell').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id)
            const product = allProducts.find(p => p.id === productId)
            document.getElementById('sellProductId').value = productId
            document.getElementById('sellProductName').textContent = product.name
            document.getElementById('sellPrice').value = btn.dataset.price
            document.getElementById('sellForm').reset()
            document.getElementById('sellProductId').value = productId
            document.getElementById('sellPrice').value = btn.dataset.price
            openModal('sellModal')
        })
    })
}
async function initPurchaseEvents() {
    document.querySelectorAll('.btn-toggle-paid').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id)
            const currentPaid = btn.dataset.paid === 'true'
            await supabase
                .from('purchases')
                .update({ is_paid: !currentPaid })
                .eq('id', id)
            await loadPurchases()
            initPurchaseEvents()
        })
    })
}
init()