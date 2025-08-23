from flask import Blueprint, request, jsonify
from src.advanced_bruteforce_engine import AdvancedBruteForceEngine
from src.target_functions import TargetFunctions
from src.dictionary_manager import DictionaryManager
from src.gpu_engine import GPUBruteForceEngine
from src.credential_stuffing_engine import CredentialStuffingEngine # Import new engine
import threading
import string

bruteforce_bp = Blueprint("bruteforce", __name__)

active_attacks = {}
dictionary_manager = DictionaryManager()
gpu_bruteforce_engine = GPUBruteForceEngine(use_gpu=True)
credential_stuffing_engine = CredentialStuffingEngine() # Initialize new engine

@bruteforce_bp.route("/start_attack", methods=["POST"])
def start_attack():
    data = request.json
    attack_id = data.get("attack_id")
    attack_type = data.get("attack_type")
    
    # Common parameters for charset-based attacks
    charset_name = data.get("charset")
    custom_charset = data.get("custom_charset", "")
    min_length = data.get("min_length")
    max_length = data.get("max_length")

    # Parameters for dictionary/rule-based/hybrid attacks
    dictionary_name = data.get("dictionary_name")
    rules = data.get("rules", [])
    append_length = data.get("append_length")

    # Parameters for Credential Stuffing
    leaked_credentials_file = data.get("leaked_credentials_file")
    target_url = data.get("target_url")
    login_field_name = data.get("login_field_name")
    password_field_name = data.get("password_field_name")
    success_indicator = data.get("success_indicator")

    target_params = data.get("target_params")

    if not attack_id or not attack_type or not target_params:
        return jsonify({"error": "Paramètres de base manquants (attack_id, attack_type, target_params)"}), 400

    if attack_id in active_attacks:
        return jsonify({"error": f"Attaque avec l\"ID {attack_id}\" déjà en cours"}), 409

    engine_kwargs = {"attack_type": attack_type}
    charset = ""

    if attack_type == "charset":
        if not all([charset_name, min_length, max_length]):
            return jsonify({"error": "Paramètres de charset manquants"}), 400
        if charset_name == "ascii_lowercase":
            charset = string.ascii_lowercase
        elif charset_name == "ascii_uppercase":
            charset = string.ascii_uppercase
        elif charset_name == "digits":
            charset = string.digits
        elif charset_name == "punctuation":
            charset = string.punctuation
        elif charset_name == "printable":
            charset = string.printable.strip()
        elif charset_name == "custom":
            charset = custom_charset
        else:
            return jsonify({"error": "Jeu de caractères non valide"}), 400
        engine_kwargs.update({"charset": charset, "min_length": min_length, "max_length": max_length})

    elif attack_type == "dictionary" or attack_type == "rule_based" or attack_type == "hybrid":
        if not dictionary_name:
            return jsonify({"error": "Nom du dictionnaire manquant"}), 400
        dictionary = dictionary_manager.get_dictionary(dictionary_name)
        if not dictionary:
            return jsonify({"error": f"Dictionnaire \"{dictionary_name}\" non trouvé"}), 404
        engine_kwargs["dictionary"] = dictionary
        
        if attack_type == "rule_based":
            engine_kwargs["rules"] = rules
        elif attack_type == "hybrid":
            if not append_length or not charset_name:
                return jsonify({"error": "Paramètres hybrides (append_length, charset) manquants"}), 400
            if charset_name == "ascii_lowercase":
                charset = string.ascii_lowercase
            elif charset_name == "ascii_uppercase":
                charset = string.ascii_uppercase
            elif charset_name == "digits":
                charset = string.digits
            elif charset_name == "punctuation":
                charset = string.punctuation
            elif charset_name == "printable":
                charset = string.printable.strip()
            elif charset_name == "custom":
                charset = custom_charset
            else:
                return jsonify({"error": "Jeu de caractères non valide pour l\"attaque hybride"}), 400
            engine_kwargs.update({"charset": charset, "append_length": append_length})

    elif attack_type == "hash_crack":
        engine_kwargs["gpu_engine"] = gpu_bruteforce_engine

    elif attack_type == "credential_stuffing":
        if not all([leaked_credentials_file, target_url, login_field_name, password_field_name, success_indicator]):
            return jsonify({"error": "Paramètres de credential stuffing manquants"}), 400
        try:
            credential_stuffing_engine.load_leaked_credentials(leaked_credentials_file)
        except Exception as e:
            return jsonify({"error": f"Erreur lors du chargement des crédentiels: {e}"}), 500
        
        if not credential_stuffing_engine.leaked_credentials:
            return jsonify({"error": "Aucun crédentiel valide trouvé dans le fichier fourni."}), 400

    else:
        return jsonify({"error": "Type d\"attaque non supporté"}), 400

    # Determine which engine to use and start the attack
    thread = None
    is_gpu_attack = False
    is_credential_stuffing_attack = False

    if attack_type == "credential_stuffing":
        is_credential_stuffing_attack = True
        thread = threading.Thread(target=credential_stuffing_engine.start_attack, args=(
            target_url, login_field_name, password_field_name, success_indicator
        ))
    else:
        engine = AdvancedBruteForceEngine(**engine_kwargs)
        target_function = None
        if target_params.get("type") == "hash_crack":
            target_hash = target_params.get("hash")
            hash_type = target_params.get("hash_type", "md5")
            if not target_hash:
                return jsonify({"error": "Hash cible manquant pour l\"attaque de hash"}), 400
            target_function = TargetFunctions.hash_target(target_hash, hash_type)
            
            gpu_attack_mode = data.get("gpu_attack_mode", "bruteforce")
            gpu_dictionary_path = data.get("gpu_dictionary_path")
            
            thread = threading.Thread(target=engine.start_attack, args=(
                target_function, target_hash, hash_type, gpu_attack_mode, gpu_dictionary_path, charset, min_length, max_length
            ))
            is_gpu_attack = (attack_type == "hash_crack" and gpu_bruteforce_engine.can_use_gpu())

        elif target_params.get("type") == "http_basic_auth":
            url = target_params.get("url")
            username = target_params.get("username")
            if not all([url, username]):
                return jsonify({"error": "URL ou nom d\"utilisateur manquant pour l\"authentification HTTP"}), 400
            target_function = TargetFunctions.http_basic_auth_target(url, username)
            thread = threading.Thread(target=engine.start_attack, args=(target_function,))

        elif target_params.get("type") == "simple_string":
            target_string = target_params.get("target_string")
            if not target_string:
                return jsonify({"error": "Chaîne cible manquante pour l\"attaque simple"}), 400
            target_function = TargetFunctions.simple_string_target(target_string)
            thread = threading.Thread(target=engine.start_attack, args=(target_function,))

        else:
            return jsonify({"error": "Type de cible non supporté"}), 400

        if target_function is None and not is_gpu_attack:
            return jsonify({"error": "Impossible de créer la fonction cible"}), 500

    if thread is None:
        return jsonify({"error": "Erreur interne: thread d\"attaque non initialisé"}), 500

    thread.daemon = True
    thread.start()

    if is_credential_stuffing_attack:
        active_attacks[attack_id] = {"engine": credential_stuffing_engine, "thread": thread, "is_credential_stuffing_attack": True}
    else:
        active_attacks[attack_id] = {"engine": engine, "thread": thread, "is_gpu_attack": is_gpu_attack}

    return jsonify({"message": "Attaque démarrée", "attack_id": attack_id}), 200

@bruteforce_bp.route("/stop_attack", methods=["POST"])
def stop_attack():
    data = request.json
    attack_id = data.get("attack_id")

    if not attack_id:
        return jsonify({"error": "ID d\"attaque manquant"}), 400

    if attack_id not in active_attacks:
        return jsonify({"error": f"Attaque avec l\"ID {attack_id}\" non trouvée"}), 404

    engine_info = active_attacks[attack_id]
    engine = engine_info["engine"]
    
    engine.stop_attack()
    return jsonify({"message": "Attaque arrêtée", "attack_id": attack_id}), 200

@bruteforce_bp.route("/attack_status/<attack_id>", methods=["GET"])
def get_attack_status(attack_id):
    if attack_id not in active_attacks:
        return jsonify({"error": f"Attaque avec l\"ID {attack_id}\" non trouvée"}), 404

    engine_info = active_attacks[attack_id]
    engine = engine_info["engine"]
    
    status = engine.get_status()
    
    if engine_info.get("is_gpu_attack", False):
        status["gpu_available"] = gpu_bruteforce_engine.can_use_gpu()
        status["hashcat_available"] = gpu_bruteforce_engine.gpu_engine.hashcat_path is not None
        status["john_available"] = gpu_bruteforce_engine.gpu_engine.john_path is not None
    elif engine_info.get("is_credential_stuffing_attack", False):
        status["found_credentials"] = status.get("found_credentials", [])

    if not status["running"] and not active_attacks[attack_id]["thread"].is_alive():
        del active_attacks[attack_id]

    return jsonify(status), 200

@bruteforce_bp.route("/dictionaries", methods=["GET"])
def list_dictionaries():
    return jsonify(dictionary_manager.list_dictionaries()), 200

@bruteforce_bp.route("/dictionaries/load_common", methods=["POST"])
def load_common_dictionary():
    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"error": "Nom du dictionnaire manquant"}), 400
    if dictionary_manager.load_common_dictionary(name):
        return jsonify({"message": f"Dictionnaire \"{name}\" chargé avec succès"}), 200
    return jsonify({"error": f"Impossible de charger le dictionnaire \"{name}\""}), 500

@bruteforce_bp.route("/dictionaries/create_custom", methods=["POST"])
def create_custom_dictionary():
    data = request.json
    name = data.get("name")
    words = data.get("words")
    if not name or not words:
        return jsonify({"error": "Nom ou mots du dictionnaire manquants"}), 400
    if dictionary_manager.create_custom_dictionary(name, words):
        return jsonify({"message": f"Dictionnaire personnalisé \"{name}\" créé avec succès"}), 200
    return jsonify({"error": f"Impossible de créer le dictionnaire personnalisé \"{name}\""}), 500

@bruteforce_bp.route("/dictionaries/generate_personal", methods=["POST"])
def generate_personal_dictionary():
    data = request.json
    name = data.get("name")
    personal_info = data.get("personal_info")
    if not name or not personal_info:
        return jsonify({"error": "Nom ou informations personnelles manquantes"}), 400
    
    personal_dict = dictionary_manager.generate_personal_dictionary(personal_info)
    if dictionary_manager.create_custom_dictionary(name, personal_dict):
        return jsonify({"message": f"Dictionnaire personnel \"{name}\" généré avec succès", "word_count": len(personal_dict)}), 200
    return jsonify({"error": f"Impossible de générer le dictionnaire personnel \"{name}\""}), 500

@bruteforce_bp.route("/dictionaries/stats/<name>", methods=["GET"])
def get_dictionary_stats(name):
    stats = dictionary_manager.get_dictionary_stats(name)
    if stats:
        return jsonify(stats), 200
    return jsonify({"error": f"Dictionnaire \"{name}\" non trouvé"}), 404

@bruteforce_bp.route("/rules", methods=["GET"])
def list_rules():
    available_rules = [
        ":capitalize", 
        ":uppercase", 
        ":lowercase", 
        ":append_digit:N", 
        ":prepend_digit:N"
    ]
    return jsonify(available_rules), 200

@bruteforce_bp.route("/gpu_info", methods=["GET"])
def get_gpu_info():
    return jsonify(gpu_bruteforce_engine.get_gpu_info()), 200




