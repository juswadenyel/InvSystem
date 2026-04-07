export function openModal(id) {
    document.getElementById(id).classList.add('active')
}

export function closeModal(id) {
    document.getElementById(id).classList.remove('active')
}

export function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active')
        })
    })

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.remove('active')
        })
    })
}