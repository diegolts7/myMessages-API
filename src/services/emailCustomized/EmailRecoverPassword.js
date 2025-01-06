export const EmailRecover = (urlBase, token, name) => {
  return `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de Senha</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #4CAF50;
                }
                p {
                    font-size: 16px;
                }
                a.button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                a.button:hover {
                    background-color: #45a049;
                }
                footer {
                    margin-top: 20px;
                    font-size: 14px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Recuperação de Senha</h1>
                <p>Olá, ${name}</p>
                <p>Recebemos um pedido para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
                <a href="${urlBase}?token=${token}" class="button">Redefinir Senha</a>
                <p>Se você não fez esse pedido, pode ignorar este e-mail.</p>
                <footer>
                    <p>Atenciosamente,<br>Equie My messages LTDA.</p>
                </footer>
            </div>
        </body>
        </html>`;
};
