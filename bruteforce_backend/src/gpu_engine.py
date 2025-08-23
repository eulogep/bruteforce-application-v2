import hashlib
import time
import threading
import subprocess
import os
from typing import Optional, Callable, List

class GPUEngine:
    """
    Moteur GPU pour accélérer les attaques de brute force, particulièrement pour le craquage de hash.
    Utilise des outils externes comme hashcat ou john the ripper avec support GPU.
    """
    
    def __init__(self):
        self.running = False
        self.found_password = None
        self.attempts = 0
        self.start_time = None
        self.speed = 0
        self.progress = 0
        self.total_combinations = 0
        self.gpu_available = self._check_gpu_availability()
        self.hashcat_path = self._find_hashcat()
        self.john_path = self._find_john()
        
    def _check_gpu_availability(self) -> bool:
        """Vérifie si un GPU compatible est disponible"""
        try:
            # Vérifier NVIDIA GPU
            result = subprocess.run(['nvidia-smi'], capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        try:
            # Vérifier OpenCL
            result = subprocess.run(['clinfo'], capture_output=True, text=True, timeout=5)
            if result.returncode == 0 and 'GPU' in result.stdout:
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        return False
    
    def _find_hashcat(self) -> Optional[str]:
        """Trouve l'exécutable hashcat"""
        try:
            result = subprocess.run(['which', 'hashcat'], capture_output=True, text=True)
            if result.returncode == 0:
                return result.stdout.strip()
        except FileNotFoundError:
            pass
        return None
    
    def _find_john(self) -> Optional[str]:
        """Trouve l'exécutable john the ripper"""
        try:
            result = subprocess.run(['which', 'john'], capture_output=True, text=True)
            if result.returncode == 0:
                return result.stdout.strip()
        except FileNotFoundError:
            pass
        return None
    
    def install_hashcat(self) -> bool:
        """Installe hashcat si possible"""
        try:
            # Essayer d'installer via apt
            result = subprocess.run(['sudo', 'apt', 'update'], capture_output=True, timeout=60)
            if result.returncode == 0:
                result = subprocess.run(['sudo', 'apt', 'install', '-y', 'hashcat'], capture_output=True, timeout=300)
                if result.returncode == 0:
                    self.hashcat_path = self._find_hashcat()
                    return self.hashcat_path is not None
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        return False
    
    def _get_hashcat_mode(self, hash_type: str) -> Optional[int]:
        """Retourne le mode hashcat pour le type de hash donné"""
        modes = {
            'md5': 0,
            'sha1': 100,
            'sha256': 1400,
            'sha512': 1700,
            'ntlm': 1000,
            'bcrypt': 3200
        }
        return modes.get(hash_type.lower())
    
    def gpu_hash_attack(self, target_hash: str, hash_type: str, attack_mode: str = 'dictionary', 
                       dictionary_path: str = None, charset: str = None, min_length: int = 1, 
                       max_length: int = 8) -> Optional[str]:
        """
        Lance une attaque GPU pour cracker un hash
        
        Args:
            target_hash: Hash à cracker
            hash_type: Type de hash (md5, sha1, sha256, etc.)
            attack_mode: Mode d'attaque ('dictionary', 'bruteforce', 'mask')
            dictionary_path: Chemin vers le dictionnaire (pour mode dictionary)
            charset: Jeu de caractères (pour mode bruteforce)
            min_length: Longueur minimale (pour mode bruteforce)
            max_length: Longueur maximale (pour mode bruteforce)
        """
        
        if not self.gpu_available:
            raise Exception("Aucun GPU compatible détecté")
        
        if not self.hashcat_path:
            if not self.install_hashcat():
                raise Exception("Impossible d'installer ou de trouver hashcat")
        
        mode = self._get_hashcat_mode(hash_type)
        if mode is None:
            raise Exception(f"Type de hash non supporté: {hash_type}")
        
        # Créer un fichier temporaire pour le hash
        hash_file = f"/tmp/target_hash_{int(time.time())}.txt"
        with open(hash_file, 'w') as f:
            f.write(target_hash)
        
        # Construire la commande hashcat
        cmd = [self.hashcat_path, '-m', str(mode), hash_file]
        
        if attack_mode == 'dictionary' and dictionary_path:
            cmd.append(dictionary_path)
        elif attack_mode == 'bruteforce':
            # Mode bruteforce avec masque
            if charset:
                # Créer un masque basé sur le charset et la longueur
                mask_chars = {
                    'abcdefghijklmnopqrstuvwxyz': '?l',
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ': '?u', 
                    '0123456789': '?d',
                    '!@#$%^&*()_+-=[]{}|;:,.<>?': '?s'
                }
                
                mask_char = '?a'  # Par défaut, tous les caractères
                for chars, mask in mask_chars.items():
                    if set(charset).issubset(set(chars)):
                        mask_char = mask
                        break
                
                # Générer des masques pour chaque longueur
                for length in range(min_length, max_length + 1):
                    mask = mask_char * length
                    cmd_with_mask = cmd + ['-a', '3', mask]
                    
                    try:
                        self.running = True
                        self.start_time = time.time()
                        
                        result = subprocess.run(cmd_with_mask, capture_output=True, text=True, timeout=3600)
                        
                        if result.returncode == 0:
                            # Parser la sortie pour trouver le mot de passe
                            output = result.stdout + result.stderr
                            if target_hash in output:
                                lines = output.split('\n')
                                for line in lines:
                                    if target_hash in line and ':' in line:
                                        password = line.split(':')[-1].strip()
                                        self.found_password = password
                                        self.running = False
                                        os.unlink(hash_file)
                                        return password
                    except subprocess.TimeoutExpired:
                        pass
        
        # Ajouter des options pour utiliser le GPU
        cmd.extend(['-O', '--force'])  # Optimisations et forcer l'exécution
        
        try:
            self.running = True
            self.start_time = time.time()
            
            # Lancer hashcat
            process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            
            # Monitorer le processus
            while process.poll() is None and self.running:
                time.sleep(1)
                self.attempts += 1000  # Estimation
                
            if process.poll() == 0:
                output = process.stdout.read() + process.stderr.read()
                
                # Parser la sortie pour trouver le mot de passe
                if target_hash in output:
                    lines = output.split('\n')
                    for line in lines:
                        if target_hash in line and ':' in line:
                            password = line.split(':')[-1].strip()
                            self.found_password = password
                            break
            
        except Exception as e:
            print(f"Erreur lors de l'exécution de hashcat: {e}")
        finally:
            self.running = False
            if os.path.exists(hash_file):
                os.unlink(hash_file)
        
        return self.found_password
    
    def stop_attack(self):
        """Arrête l'attaque en cours"""
        self.running = False
    
    def get_status(self) -> dict:
        """Retourne le statut actuel de l'attaque GPU"""
        elapsed_time = time.time() - self.start_time if self.start_time else 0
        current_speed = self.attempts / elapsed_time if elapsed_time > 0 else 0
        
        return {
            'running': self.running,
            'found_password': self.found_password,
            'attempts': self.attempts,
            'elapsed_time': elapsed_time,
            'speed': current_speed,
            'gpu_available': self.gpu_available,
            'hashcat_available': self.hashcat_path is not None,
            'john_available': self.john_path is not None
        }

class GPUBruteForceEngine:
    """
    Moteur de brute force avec support GPU intégré
    """
    
    def __init__(self, use_gpu: bool = True):
        self.use_gpu = use_gpu
        self.gpu_engine = GPUEngine() if use_gpu else None
        self.running = False
        self.found_password = None
        self.attempts = 0
        self.start_time = None
        
    def can_use_gpu(self) -> bool:
        """Vérifie si le GPU peut être utilisé"""
        return self.use_gpu and self.gpu_engine and self.gpu_engine.gpu_available
    
    def start_gpu_hash_attack(self, target_hash: str, hash_type: str, **kwargs) -> Optional[str]:
        """Lance une attaque GPU pour cracker un hash"""
        if not self.can_use_gpu():
            raise Exception("GPU non disponible ou non activé")
        
        return self.gpu_engine.gpu_hash_attack(target_hash, hash_type, **kwargs)
    
    def get_gpu_info(self) -> dict:
        """Retourne les informations sur le GPU"""
        if not self.gpu_engine:
            return {'gpu_available': False, 'error': 'GPU engine not initialized'}
        
        return {
            'gpu_available': self.gpu_engine.gpu_available,
            'hashcat_available': self.gpu_engine.hashcat_path is not None,
            'john_available': self.gpu_engine.john_path is not None,
            'hashcat_path': self.gpu_engine.hashcat_path,
            'john_path': self.gpu_engine.john_path
        }

# Test et exemple d'utilisation
if __name__ == '__main__':
    engine = GPUBruteForceEngine()
    
    print("=== Test GPU Engine ===")
    gpu_info = engine.get_gpu_info()
    print(f"GPU Info: {gpu_info}")
    
    if engine.can_use_gpu():
        print("GPU disponible, test d'une attaque...")
        
        # Test avec un hash MD5 simple
        test_hash = hashlib.md5("test".encode()).hexdigest()
        print(f"Hash de test (MD5 de 'test'): {test_hash}")
        
        try:
            result = engine.start_gpu_hash_attack(
                target_hash=test_hash,
                hash_type='md5',
                attack_mode='bruteforce',
                charset='abcdefghijklmnopqrstuvwxyz',
                min_length=1,
                max_length=4
            )
            print(f"Résultat: {result}")
        except Exception as e:
            print(f"Erreur: {e}")
    else:
        print("GPU non disponible, utilisation du CPU...")

