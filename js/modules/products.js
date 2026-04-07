import { supabase } from '../config/supabase.js'

export async function getProducts(category = null, search = null) {
    let query = supabase.from('products').select('*').order('name')
    if (category) query = query.eq('category', category)
    if (search) query = query.ilike('name', `%${search}%`)
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function addProduct(product) {
    const { data, error } = await supabase.from('products').insert([product]).select()
    if (error) throw error
    return data
}

export async function updateProduct(id, updates) {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select()
    if (error) throw error
    return data
}

export async function deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
}