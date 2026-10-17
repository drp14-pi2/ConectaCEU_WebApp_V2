const openTermsOfUseBtn = document.getElementById('openTermsOfUseBtn')

function openTermsOfUse() {
    const html = `
    <style>
        .popup {
            position: fixed;
            inset: 0; /* covers the whole viewport */
            display: flex;
            align-items: center; /* vertical center */
            justify-content: center; /* horizontal center */
            z-index: 1000;
        }

        .popup-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
        }

        .popup-dialog {
            background-color: var(--light-blue);
            border-radius: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            position: relative; /* sits above the backdrop */
            padding: 1.5rem;
            margin: auto;
            max-width: 90vw;
            max-height: 90vh; /* don't overflow on small screens */
            overflow: auto; /* scroll content if it's tall */
        }
        
        .popup-inner-container {
            background-color: var(--white);
            border-radius: 15px;
            height: 80%;
            margin: auto;
            margin-bottom: 30px;
            outline: 5px solid var(--medium-blue);
            overflow-y: auto;
            padding: 10px;
            width: 98%;
        }

        .popup-btn-row {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
    <div id="popup" class="popup" role="dialog">
        <div class="popup-backdrop"></div>
        <div class="popup-dialog">
            <h2>Termos de uso</h2>
            <div class="popup-inner-container">
                <p>Ao utilizar o sistema ConectaCEU, você concorda com as seguintes condições:</p>
                <p><span class="bold">Veracidade das informações:</span> você garante que todos os dados preenchidos e documentos anexados são autênticos. Informações falsas podem resultar no cancelamento da matrícula.</p>
                <p><span class="bold">Uso de imagem:</span> ao aceitar os termos no cadastro, você autoriza o uso da imagem do aluno em materiais de divulgação institucional das atividades dos CEUs.</p>
                <p><span class="bold">Responsabilidade:</span> usuários menores de idade devem ser cadastrados obrigatoriamente por seus responsáveis legais.</p>
                <p><span class="bold">Segurança da senha:</span> a senha criada é pessoal e intransferível. Você é responsável por manter o sigilo dessa informação.</p>
            </div>
            <div class="popup-btn-row">
                <button id='closePopupBtn'>Fechar</button>
            </div>
        </div>
    </div>`
    document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', html)

    // Close on backdrop click
    popup.querySelector('.popup-backdrop').addEventListener('click', closeTermsOfUse)

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('popup')) closeTermsOfUse()
    })

    // Close button
    const closePopupBtn = document.getElementById('closePopupBtn')
    closePopupBtn.addEventListener('click', closeTermsOfUse)
}

function closeTermsOfUse() {
    document.getElementById('popup').remove()
}

openTermsOfUseBtn.addEventListener('click', openTermsOfUse)
