FROM python:3.10-slim

WORKDIR /app

# Instala dependências do sistema necessárias
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia os arquivos de requisitos e instala as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante dos arquivos do aplicativo
COPY . .

# Expõe a porta em que o servidor irá rodar
EXPOSE 8000

# Configura variáveis de ambiente (valores serão preenchidos durante o deploy)
ENV PIPERUN_API_TOKEN=""
ENV HOST="0.0.0.0"
ENV PORT="8000"

# Comando para iniciar o servidor
CMD ["python", "server.py"]
