# 🎓 EstudaVitor

Bem-vindo ao **EstudaVitor**, um organizador de estudos e tarefas focado em simplicidade, alta performance, possuindo controle de técnicas Pomodoro e uma incríve **sincronização bidirecional completa com o Google Calendar**.

Este projeto foi construído pensando na retenção máxima de foco, rodando o cliente HTML/JS/CSS nativo localmente da sua máquina com o apoio de um servidor ultraleve Node.js de retaguarda.

## ✨ Funcionalidades Principais

- 🍅 **Pomodoro Interativo:** Temporizador customizável entre foco de estudo, pausas curtas e longas. Funciona no menu inferior sem travar sua tela.
- ✅ **Gestão Atenta de Tarefas:** Crie tarefas e agende-as flexivelmente. As tarefas recebem bordas especiais quando estiverem "atrasadas" em relação a hoje.
- 🗓️ **Calendário Colorido e Detalhado:** Todos os dias de estudo e todas as tarefas viram minúsculas etiquetas coloridas pela urgência (Alta, Média, Baixa) num grid altamente escaneável e ajustado via CSS.
- 📈 **Dashboard & Analytics:** Descubra rápido sua eficiência exibindo as horas de estudo no mês atual, total de dias de "streak" seguidos e as pendências em andamento.
- 🔄 **Integração Poderosa de Calendar (Google Cloud):** Você pode vincular **múltiplas contas da Google**.
  - As tarefas criadas no seu calendário fluem para a nuvem da Google automaticamente em backgruond.
  - Todo e qualquer agendamento importado do Google também entra como prioridade local aqui no calendário.
  - Realizou um compromisso e clicou em "feito"? O aplicativo renomeia silenciosamente esse evento no seu GCalendar usando um `[CONCLUÍDO]`.
- 💾 **Persistência Baseada em Arquivos:** Dados são salvos num robusto `.json` no servidor local, de forma que você não sofre dependência de nuvem paga a menos que deseje o backup.
- 📥 **Exportações Completas:** Crie PDFs ou tire snapshots em `.csv` se você é um daqueles estudantes que adoram estatísticas externas.
- ✉️ **Notificação Automática (Ngrok):** Um script robô independente varre a inicialização do túnel na sua máquina e encaminha o link ativo direto para o seu e-mail de forma autônoma!

## 🚀 Como instalar (Passo a Passo)

1. Faça o clone/baixe os arquivos deste projeto num diretório de sua escolha.
2. Certifique-se de de ter o instalador [Node.js](https://nodejs.org/pt-br/) atualizado na máquina.
3. Se desejar as funções da nuvem, não esqueça de rodar:
   ```bash
   npm install
   ```

### ⚙️ Sobre as Chaves GCloud
Uma regra de ouro do Git/Github é nunca expor arquivos perigosos, mas a lib Google exige verificação local (OAuth 2.0). O projeto já possui bloqueios no arquivo `.gitignore` nativamente — nada da pasta `/data` e do arquivo `.env` fará envio online!

- Para a parte cloud funcionar, altere o nome do arquivo `.env.example` para apenas **`.env`** (ou copie e crie um novo na raiz do sistema).
- Cole suas chaves que foram elaboradas lá [Console de Desenvolvedor](https://console.cloud.google.com/):
  ```env
  GOOGLE_CLIENT_ID=COLE_AQUI
  GOOGLE_CLIENT_SECRET=COLE_AQUI
  ```

### Iniciando!
- Se você for Windows, pode invocar o aplicativo clicando `iniciar.bat`.
- Do contrário, um simples comando via Terminal na raiz da aplicação já põe o app pra funcionar:
  ```bash
  node server.js
  ```
Logo que a mensagem `🚀 EstudaVitor rodando em http://localhost:3737` estiver no ar, basta curtir! O link funciona dentro e fora da máquina, pelo Wi-Fi residencial até em smartphones antigos.

---
> 🌟 *Criado com código nativo.* Sem necessidade complexa de bibliotecas React/Angular pesadas de Frontend. Apenas HTML semântico elegante, JS baunília e folhas CSS modernas.
