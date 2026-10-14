import { logout } from '/shared/functions/logout.js'
const submitButton = document.getElementById('button-submit-form')
submitButton.addEventListener('click', () => logout())