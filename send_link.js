// Importa as variáveis de ambiente e bibliotecas
require('dotenv').config();
const nodemailer = require('nodemailer');
const http = require('http');

console.log('Iniciando script de envio de link do Ngrok...');

function checkNgrok(retriesLeft) {
  if (retriesLeft <= 0) {
    console.error('Falha: Tempo limite esgotado. Ngrok não inicializou no tempo esperado.');
    return;
  }

  // Busca a URL do painel visível apenas da sua máquina local
  http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      try {
        const json = JSON.parse(data);
        if (!json.tunnels || json.tunnels.length === 0) {
          console.log(`Túnel não encontrado ainda. Tentando novamente... (${retriesLeft - 1} tentativas restantes)`);
          setTimeout(() => checkNgrok(retriesLeft - 1), 2000);
          return;
        }
        
        const url = json.tunnels[0].public_url;
        console.log('🔗 URL Obtida:', url);
        
        await sendEmail(url);
      } catch (e) {
        console.error('Erro ao analisar a resposta do Ngrok:', e.message);
        setTimeout(() => checkNgrok(retriesLeft - 1), 2000);
      }
    });
  }).on('error', (e) => {
    console.log(`Ngrok ainda não está respondendo. Tentando novamente em 2 segundos... (${retriesLeft - 1} tentativas restantes) [Erro: ${e.message}]`);
    setTimeout(() => checkNgrok(retriesLeft - 1), 2000);
  });
}

async function sendEmail(url) {
  if (!process.env.EMAIL || !process.env.EMAIL_SENHA) {
     console.error('ERRO: Preencha EMAIL e EMAIL_SENHA no arquivo .env!');
     return;
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail', // O NodeMailer já conhece as portas/servidores padrão do Google
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_SENHA
    }
  });

  try {
    let info = await transporter.sendMail({
      from: `"EstudaVitor 🤖" <${process.env.EMAIL}>`,
      to: process.env.EMAIL, // Envia de você para você mesmo
      subject: 'Seu Link do EstudaVitor de Hoje 🚀',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #6c63ff;">O Servidor EstudaVitor foi iniciado!</h2>
          <p>O Ngrok gerou o seu link público de acesso de hoje em background. Acesse o seu aplicativo aqui:</p>
          <div style="margin: 20px 0;">
            <a href="${url}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Acessar EstudaVitor
            </a>
          </div>
          <p>Ou copie a URL inteira: <strong>${url}</strong></p>
          <hr style="border: none; border-top: 1px solid #ccc; margin-top: 30px;">
          <p style="font-size: 12px; color: gray;">Mensagem gerada automaticamente pelo seu PC na inicialização.</p>
        </div>
      `
    });
    
    console.log('✅ E-mail com link Ngrok enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
}

// Inicia a verificação (tenta por até 1 minuto: 30 tentativas x 2 segundos)
checkNgrok(30);
