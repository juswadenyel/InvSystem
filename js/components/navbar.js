import { logout } from '../modules/auth.js'

export function renderNavbar(username) {
    return `
    <nav class="navbar">
        <div class="navbar-brand">
            <span class="brand-icon">📦</span>
            <span class="brand-name">InvSystem</span>
        </div>
        <div class="navbar-menu">
            <button class="nav-btn active" data-tab="inventory">Inventory</button>
            <button class="nav-btn" data-tab="purchases">Purchase History</button>
        </div>
        <div class="navbar-user">
            <span class="user-email">${username}</span>
            <button class="logout-btn" id="logoutBtn">Logout</button>
        </div>
    </nav>`
}

export function initNavbar() {
    document.getElementById('logoutBtn').addEventListener('click', logout)

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
            btn.classList.add('active')

            const tab = btn.dataset.tab
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'))
            document.getElementById(tab).classList.add('active')
        })
    })
}