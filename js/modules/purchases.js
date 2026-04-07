import { supabase } from '../config/supabase.js'

export async function getPurchases() {
    const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('purchase_date', { ascending: false })
    if (error) throw error
    return data
}

export async function addPurchase(purchase) {
    const { data, error } = await supabase.from('purchases').insert([purchase]).select()
    if (error) throw error

    // Deduct stock
    await supabase.rpc('deduct_stock', {
        product_id: purchase.product_id,
        qty: purchase.quantity
    })

    return data
}