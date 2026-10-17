const openPopupBtn = document.getElementById('openPopupBtn')

function open() {
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
            <h2>Política de privacidade</h2>
            <div class="popup-inner-container">
                <h3>O que coletamos:</h3>
                <p>Coletamos apenas os dados fornecidos voluntariamente por você nos formulários de cadastro (dados de identificação, contato, endereço, documentos e fotos de identificação) e o seu endereço IP para fins de segurança e registro de acesso.</p>
                <h3>Para que usamos:</h3>
                <p><span class="bold">Gestão de atividades:</span> identificar e matricular o aluno nas atividades do CEU.</p>
                <p><span class="bold">Comunicação:</span> entrar em contato sobre atualizações, avisos e segurança.</p>
                <p><span class="bold">Segurança:</span> o registro do IP serve para prevenir fraudes e garantir a integridade do sistema.</p>
                <p><span class="bold">Cookies e terceiros:</span> não utilizamos cookies de rastreamento ou marketing.</p>
                <p><span class="bold">Não compartilhamento:</span> seus dados não são vendidos ou compartilhados com terceiros para fins comerciais. O acesso é restrito à administração do ConectaCEU para finalidades educacionais e administrativas.</p>
                <h3>Seus direitos:</h3>
                <p>Em conformidade com a LGPD (Lei nº 13.709/2018), você pode solicitar a atualização, correção ou exclusão dos seus dados a qualquer momento, desde que não inviabilize a manutenção do vínculo administrativo necessário.</p>
            </div>
            <div class="popup-btn-row">
                <button id='closePopupBtn'>Fechar</button>
            </div>
        </div>
    </div>`
    document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', html)

    // Close on backdrop click
    popup.querySelector('.popup-backdrop').addEventListener('click', close)

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('popup')) close()
    })

    // Close button
    const closePopupBtn = document.getElementById('closePopupBtn')
    closePopupBtn.addEventListener('click', close)
}

function close() {
    document.getElementById('popup').remove()
}

openPopupBtn.addEventListener('click', open)
