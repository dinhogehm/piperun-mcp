FROM python:3.10-slim

WORKDIR /app

# Copia os arquivos de requisitos e instala as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir flask json-rpc

# Copia o restante dos arquivos do aplicativo
COPY . .

# Expõe a porta em que o servidor irá rodar
EXPOSE 8000

# Configura variáveis de ambiente (valores serão preenchidos durante o deploy)
ENV PIPERUN_API_TOKEN=""

# Comando para iniciar o servidor
CMD ["python", "server.py"]
