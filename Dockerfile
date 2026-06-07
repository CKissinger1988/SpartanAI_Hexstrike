# Use multi-stage build for React frontend and Python backend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY SpartanAI_Hexstrike_App/package*.json ./
RUN npm install
COPY SpartanAI_Hexstrike_App/ ./
RUN npx expo export --platform web

# Final stage: Python environment
FROM python:3.12-slim
WORKDIR /usr/share/hexstrike

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY HexstrikeCentralAPI.py HealthCheck.py PackageDebian.py MassModernizer.py ProvisionArsenal.py ./
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    requests \
    pydantic \
    huggingface_hub \
    python-multipart

# Copy frontend from builder
COPY --from=frontend-builder /app/dist ./SpartanAI_Hexstrike_App/dist

# Provision Arsenal (during build for "Fat" image)
ENV ARSENAL_ROOT=/usr/share/hexstrike/arsenal
RUN python ProvisionArsenal.py

# Expose Orchestrator Port
EXPOSE 8000

# Set startup command
CMD ["python", "HexstrikeCentralAPI.py"]
