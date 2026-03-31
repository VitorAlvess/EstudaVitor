Set WshShell = CreateObject("WScript.Shell")

' 1. Inicia o servidor Node.js (EstudaVitor) silenciosamente sem abrir janela
WshShell.Run "cmd.exe /c cd ""C:\Users\vitor\Documents\EstudaVitor"" && node server.js", 0, False

' 2. Inicia o Ngrok apontando para a porta 3737 silenciosamente
' DICA: Substitua o campo basic-auth com suas proprias senhas
WshShell.Run "cmd.exe /c ngrok http 3737 --basic-auth=""seu_usuario:sua_senha_aqui""", 0, False

' 3. Roda o script Node oculto que te manda o email com o link!
WshShell.Run "cmd.exe /c cd ""C:\Users\vitor\Documents\EstudaVitor"" && node send_link.js", 0, False
