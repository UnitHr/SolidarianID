# Imagen base de Python
FROM python:3.12.3-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos al contenedor
COPY . /app

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    cmake \
    make \
    clang \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN wget -O embeddings-s-model.bin https://valencia.inf.um.es/dlpln/embeddings-s-model.bin -O embeddings-s-model.bin

# Instalar dependencias
RUN pip install -r requirements.txt

# Ejecutar el script
CMD ["python", "main.py", "--model", "bert"]
