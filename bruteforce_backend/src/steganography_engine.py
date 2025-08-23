"""
Moteur de stéganographie pour cacher et extraire des données secrètes
AVERTISSEMENT: À utiliser uniquement dans un cadre légal et éthique
"""

import os
import base64
import hashlib
import struct
from PIL import Image
import numpy as np
import wave
import zipfile
import tempfile
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import binascii

class SteganographyEngine:
    """
    Moteur de stéganographie pour cacher et extraire des données dans différents médias
    """
    
    def __init__(self):
        self.status = {
            "operation": "",
            "progress": 0,
            "result": None,
            "error": None,
            "file_info": {}
        }
        
    def hide_data_in_image(self, image_path, secret_data, output_path, password=None):
        """Cache des données dans une image en utilisant la méthode LSB"""
        try:
            self.status["operation"] = "Hiding data in image"
            self.status["progress"] = 0
            
            # Charger l'image
            img = Image.open(image_path)
            img = img.convert('RGB')
            width, height = img.size
            
            # Chiffrer les données si un mot de passe est fourni
            if password:
                secret_data = self._encrypt_data(secret_data, password)
            
            # Convertir les données en binaire
            binary_data = ''.join(format(ord(char), '08b') for char in secret_data)
            binary_data += '1111111111111110'  # Marqueur de fin
            
            # Vérifier si l'image peut contenir les données
            max_capacity = width * height * 3  # 3 canaux RGB
            if len(binary_data) > max_capacity:
                raise ValueError("L'image est trop petite pour contenir les données")
            
            self.status["progress"] = 25
            
            # Convertir l'image en array numpy
            img_array = np.array(img)
            
            # Cacher les données dans les bits de poids faible
            data_index = 0
            for i in range(height):
                for j in range(width):
                    for k in range(3):  # RGB
                        if data_index < len(binary_data):
                            # Modifier le bit de poids faible
                            img_array[i][j][k] = (img_array[i][j][k] & 0xFE) | int(binary_data[data_index])
                            data_index += 1
                        else:
                            break
                    if data_index >= len(binary_data):
                        break
                if data_index >= len(binary_data):
                    break
            
            self.status["progress"] = 75
            
            # Sauvegarder l'image modifiée
            result_img = Image.fromarray(img_array)
            result_img.save(output_path, 'PNG')
            
            self.status["progress"] = 100
            self.status["result"] = f"Données cachées avec succès dans {output_path}"
            
            return True
            
        except Exception as e:
            self.status["error"] = str(e)
            return False
            
    def extract_data_from_image(self, image_path, password=None):
        """Extrait des données cachées d'une image"""
        try:
            self.status["operation"] = "Extracting data from image"
            self.status["progress"] = 0
            
            # Charger l'image
            img = Image.open(image_path)
            img = img.convert('RGB')
            width, height = img.size
            
            self.status["progress"] = 25
            
            # Convertir l'image en array numpy
            img_array = np.array(img)
            
            # Extraire les bits de poids faible
            binary_data = ""
            for i in range(height):
                for j in range(width):
                    for k in range(3):  # RGB
                        binary_data += str(img_array[i][j][k] & 1)
                        
                        # Vérifier le marqueur de fin
                        if len(binary_data) >= 16:
                            if binary_data[-16:] == '1111111111111110':
                                binary_data = binary_data[:-16]
                                break
                    if binary_data.endswith('1111111111111110'):
                        binary_data = binary_data[:-16]
                        break
                if binary_data.endswith('1111111111111110'):
                    binary_data = binary_data[:-16]
                    break
            
            self.status["progress"] = 75
            
            # Convertir les données binaires en texte
            secret_data = ""
            for i in range(0, len(binary_data), 8):
                byte = binary_data[i:i+8]
                if len(byte) == 8:
                    secret_data += chr(int(byte, 2))
            
            # Déchiffrer les données si un mot de passe est fourni
            if password:
                secret_data = self._decrypt_data(secret_data, password)
            
            self.status["progress"] = 100
            self.status["result"] = secret_data
            
            return secret_data
            
        except Exception as e:
            self.status["error"] = str(e)
            return None
            
    def hide_data_in_audio(self, audio_path, secret_data, output_path, password=None):
        """Cache des données dans un fichier audio"""
        try:
            self.status["operation"] = "Hiding data in audio"
            self.status["progress"] = 0
            
            # Chiffrer les données si un mot de passe est fourni
            if password:
                secret_data = self._encrypt_data(secret_data, password)
            
            # Convertir les données en binaire
            binary_data = ''.join(format(ord(char), '08b') for char in secret_data)
            binary_data += '1111111111111110'  # Marqueur de fin
            
            self.status["progress"] = 25
            
            # Ouvrir le fichier audio
            with wave.open(audio_path, 'rb') as audio:
                frames = audio.readframes(-1)
                sound_info = (audio.getnchannels(), audio.getsampwidth(), 
                            audio.getframerate(), audio.getnframes())
                
            # Convertir en array numpy
            audio_data = np.frombuffer(frames, dtype=np.int16)
            
            # Vérifier la capacité
            if len(binary_data) > len(audio_data):
                raise ValueError("Le fichier audio est trop petit pour contenir les données")
            
            self.status["progress"] = 50
            
            # Cacher les données dans les bits de poids faible
            for i, bit in enumerate(binary_data):
                audio_data[i] = (audio_data[i] & 0xFFFE) | int(bit)
            
            self.status["progress"] = 75
            
            # Sauvegarder le fichier audio modifié
            with wave.open(output_path, 'wb') as output_audio:
                output_audio.setnchannels(sound_info[0])
                output_audio.setsampwidth(sound_info[1])
                output_audio.setframerate(sound_info[2])
                output_audio.writeframes(audio_data.tobytes())
            
            self.status["progress"] = 100
            self.status["result"] = f"Données cachées avec succès dans {output_path}"
            
            return True
            
        except Exception as e:
            self.status["error"] = str(e)
            return False
            
    def extract_data_from_audio(self, audio_path, password=None):
        """Extrait des données cachées d'un fichier audio"""
        try:
            self.status["operation"] = "Extracting data from audio"
            self.status["progress"] = 0
            
            # Ouvrir le fichier audio
            with wave.open(audio_path, 'rb') as audio:
                frames = audio.readframes(-1)
            
            # Convertir en array numpy
            audio_data = np.frombuffer(frames, dtype=np.int16)
            
            self.status["progress"] = 25
            
            # Extraire les bits de poids faible
            binary_data = ""
            for sample in audio_data:
                binary_data += str(sample & 1)
                
                # Vérifier le marqueur de fin
                if len(binary_data) >= 16:
                    if binary_data[-16:] == '1111111111111110':
                        binary_data = binary_data[:-16]
                        break
            
            self.status["progress"] = 75
            
            # Convertir les données binaires en texte
            secret_data = ""
            for i in range(0, len(binary_data), 8):
                byte = binary_data[i:i+8]
                if len(byte) == 8:
                    secret_data += chr(int(byte, 2))
            
            # Déchiffrer les données si un mot de passe est fourni
            if password:
                secret_data = self._decrypt_data(secret_data, password)
            
            self.status["progress"] = 100
            self.status["result"] = secret_data
            
            return secret_data
            
        except Exception as e:
            self.status["error"] = str(e)
            return None
            
    def hide_file_in_image(self, image_path, file_path, output_path, password=None):
        """Cache un fichier entier dans une image"""
        try:
            self.status["operation"] = "Hiding file in image"
            self.status["progress"] = 0
            
            # Lire le fichier à cacher
            with open(file_path, 'rb') as f:
                file_data = f.read()
            
            # Encoder en base64 pour éviter les problèmes de caractères
            file_data_b64 = base64.b64encode(file_data).decode('utf-8')
            
            # Ajouter des métadonnées
            filename = os.path.basename(file_path)
            metadata = f"FILENAME:{filename}|SIZE:{len(file_data)}|DATA:"
            full_data = metadata + file_data_b64
            
            return self.hide_data_in_image(image_path, full_data, output_path, password)
            
        except Exception as e:
            self.status["error"] = str(e)
            return False
            
    def extract_file_from_image(self, image_path, output_dir, password=None):
        """Extrait un fichier caché d'une image"""
        try:
            self.status["operation"] = "Extracting file from image"
            
            # Extraire les données
            extracted_data = self.extract_data_from_image(image_path, password)
            
            if not extracted_data:
                return None
            
            # Parser les métadonnées
            if not extracted_data.startswith("FILENAME:"):
                raise ValueError("Format de données invalide")
            
            parts = extracted_data.split("|DATA:", 1)
            if len(parts) != 2:
                raise ValueError("Format de données invalide")
            
            metadata_part = parts[0]
            data_part = parts[1]
            
            # Extraire le nom de fichier
            filename_start = metadata_part.find("FILENAME:") + 9
            filename_end = metadata_part.find("|", filename_start)
            filename = metadata_part[filename_start:filename_end]
            
            # Décoder les données
            file_data = base64.b64decode(data_part.encode('utf-8'))
            
            # Sauvegarder le fichier
            output_path = os.path.join(output_dir, filename)
            with open(output_path, 'wb') as f:
                f.write(file_data)
            
            self.status["result"] = f"Fichier extrait: {output_path}"
            return output_path
            
        except Exception as e:
            self.status["error"] = str(e)
            return None
            
    def create_steganographic_zip(self, files_list, output_path, cover_image, password=None):
        """Crée une archive ZIP cachée dans une image"""
        try:
            self.status["operation"] = "Creating steganographic ZIP"
            self.status["progress"] = 0
            
            # Créer un fichier ZIP temporaire
            with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_zip:
                with zipfile.ZipFile(temp_zip.name, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for file_path in files_list:
                        if os.path.exists(file_path):
                            arcname = os.path.basename(file_path)
                            zipf.write(file_path, arcname)
                
                self.status["progress"] = 50
                
                # Cacher le ZIP dans l'image
                result = self.hide_file_in_image(cover_image, temp_zip.name, output_path, password)
                
                # Nettoyer le fichier temporaire
                os.unlink(temp_zip.name)
                
                return result
                
        except Exception as e:
            self.status["error"] = str(e)
            return False
            
    def analyze_image_for_steganography(self, image_path):
        """Analyse une image pour détecter la présence possible de stéganographie"""
        try:
            self.status["operation"] = "Analyzing image for steganography"
            
            img = Image.open(image_path)
            img = img.convert('RGB')
            width, height = img.size
            
            # Convertir en array numpy
            img_array = np.array(img)
            
            # Analyser la distribution des bits de poids faible
            lsb_analysis = {
                'red_lsb_entropy': 0,
                'green_lsb_entropy': 0,
                'blue_lsb_entropy': 0,
                'suspicious_patterns': []
            }
            
            # Extraire les bits de poids faible pour chaque canal
            for channel in range(3):
                lsb_bits = []
                for i in range(height):
                    for j in range(width):
                        lsb_bits.append(img_array[i][j][channel] & 1)
                
                # Calculer l'entropie
                entropy = self._calculate_entropy(lsb_bits)
                
                if channel == 0:
                    lsb_analysis['red_lsb_entropy'] = entropy
                elif channel == 1:
                    lsb_analysis['green_lsb_entropy'] = entropy
                else:
                    lsb_analysis['blue_lsb_entropy'] = entropy
                
                # Détecter des motifs suspects
                if entropy > 0.9:  # Entropie élevée = possiblement des données cachées
                    lsb_analysis['suspicious_patterns'].append(f"Entropie élevée dans le canal {'RGB'[channel]}")
            
            # Rechercher le marqueur de fin
            binary_data = ""
            found_marker = False
            for i in range(min(1000, height)):  # Vérifier seulement les premiers pixels
                for j in range(min(1000, width)):
                    for k in range(3):
                        binary_data += str(img_array[i][j][k] & 1)
                        if len(binary_data) >= 16:
                            if binary_data[-16:] == '1111111111111110':
                                found_marker = True
                                break
                    if found_marker:
                        break
                if found_marker:
                    break
            
            if found_marker:
                lsb_analysis['suspicious_patterns'].append("Marqueur de fin détecté")
            
            self.status["result"] = lsb_analysis
            return lsb_analysis
            
        except Exception as e:
            self.status["error"] = str(e)
            return None
            
    def _calculate_entropy(self, data):
        """Calcule l'entropie d'une séquence de données"""
        if not data:
            return 0
        
        # Compter les occurrences
        counts = {}
        for item in data:
            counts[item] = counts.get(item, 0) + 1
        
        # Calculer l'entropie
        entropy = 0
        length = len(data)
        for count in counts.values():
            probability = count / length
            if probability > 0:
                entropy -= probability * np.log2(probability)
        
        return entropy
        
    def _encrypt_data(self, data, password):
        """Chiffre les données avec un mot de passe"""
        try:
            # Générer une clé à partir du mot de passe
            password_bytes = password.encode('utf-8')
            salt = b'salt_1234567890'  # En production, utiliser un salt aléatoire
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
            
            # Chiffrer les données
            fernet = Fernet(key)
            encrypted_data = fernet.encrypt(data.encode('utf-8'))
            
            return encrypted_data.decode('utf-8')
            
        except Exception as e:
            raise ValueError(f"Erreur de chiffrement: {str(e)}")
            
    def _decrypt_data(self, encrypted_data, password):
        """Déchiffre les données avec un mot de passe"""
        try:
            # Générer la même clé à partir du mot de passe
            password_bytes = password.encode('utf-8')
            salt = b'salt_1234567890'
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
            
            # Déchiffrer les données
            fernet = Fernet(key)
            decrypted_data = fernet.decrypt(encrypted_data.encode('utf-8'))
            
            return decrypted_data.decode('utf-8')
            
        except Exception as e:
            raise ValueError(f"Erreur de déchiffrement: {str(e)}")
            
    def get_status(self):
        """Retourne le statut actuel de l'opération"""
        return self.status.copy()

