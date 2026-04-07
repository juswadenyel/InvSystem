import { supabase } from '../config/supabase.js'

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
}

export async function logout() {
    await supabase.auth.signOut()
    window.location.href = 'index.html'
}

export async function getUser() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user ?? null
}

export async function requireAuth() {
    const user = await getUser()
    if (!user) {
        window.location.href = 'index.html'
        return null
    }
    return user
}