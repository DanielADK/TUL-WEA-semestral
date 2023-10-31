FROM ubuntu:latest
LABEL authors="daniel"

ENTRYPOINT ["top", "-b"]
# Použijeme oficiální Python obraz z Docker Hub
FROM python:3.8-slim-buster

# Nastavíme pracovní adresář v kontejneru
WORKDIR /app

# Kopírujeme současný adresář (s naší Flask aplikací) do kontejneru
COPY . /app

# Instalujeme všechny potřebné balíčky
RUN pip install --no-cache-dir -r requirements.txt

# Nastavíme proměnnou prostředí pro Flask
ENV FLASK_APP=app.py

# Otevřeme port 5000
EXPOSE 5000

# Spustíme aplikaci
CMD ["gunicorn", "-c", "gunicorn_config.py", "app:app"]
