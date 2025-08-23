import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Globe, 
  Shield, 
  Bug, 
  AlertTriangle, 
  Play, 
  Square, 
  CheckCircle,
  Database,
  Code,
  FileText,
  Upload,
  Clock,
  Search,
  Zap
} from 'lucide-react'

const API_BASE_URL = 'https://e5h6i7cdwqow.manus.space'

export default function AdvancedAttacks() {
  const [activeTab, setActiveTab] = useState('web')
  const [attackConfig, setAttackConfig] = useState({
    attack_id: '',
    attack_type: 'sql_injection',
    target_params: {
      url: '',
      parameters: [],
      domain: '',
      host: '',
      port: 80,
      network: '192.168.1.0/24',
      usernames: [],
      passwords: []
    }
  })
  
  const [attackStatus, setAttackStatus] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [vulnerabilities, setVulnerabilities] = useState([])
  const [discoveredServices, setDiscoveredServices] = useState([])
  const [foundCredentials, setFoundCredentials] = useState([])

  const webAttackTypes = [
    { value: 'sql_injection', label: 'Injection SQL', icon: Database },
    { value: 'xss_attack', label: 'Cross-Site Scripting (XSS)', icon: Code },
    { value: 'csrf_attack', label: 'Cross-Site Request Forgery', icon: Shield },
    { value: 'directory_traversal', label: 'Traversée de répertoires', icon: FileText },
    { value: 'command_injection', label: 'Injection de commandes', icon: Code },
    { value: 'file_upload_bypass', label: 'Contournement upload', icon: Upload },
    { value: 'timing_attack', label: 'Attaque par timing', icon: Clock },
    { value: 'api_fuzzing', label: 'Fuzzing d\'API', icon: Search }
  ]

  const networkAttackTypes = [
    { value: 'network_discovery', label: 'Découverte réseau', icon: Search },
    { value: 'port_scan', label: 'Scan de ports', icon: Search },
    { value: 'service_enumeration', label: 'Énumération de services', icon: Database },
    { value: 'subdomain_enumeration', label: 'Énumération sous-domaines', icon: Globe },
    { value: 'ssh_bruteforce', label: 'Brute force SSH', icon: Shield },
    { value: 'ftp_bruteforce', label: 'Brute force FTP', icon: Shield },
    { value: 'smtp_bruteforce', label: 'Brute force SMTP', icon: Shield },
    { value: 'ssl_attack', label: 'Test SSL/TLS', icon: Shield },
    { value: 'snmp_attack', label: 'Attaque SNMP', icon: Database },
    { value: 'smb_attack', label: 'Attaque SMB', icon: Database }
  ]

  const socialAttackTypes = [
    { value: 'social_engineering', label: 'Ingénierie sociale', icon: Search },
    { value: 'password_spray', label: 'Pulvérisation de mots de passe', icon: Zap },
    { value: 'credential_stuffing', label: 'Bourrage de crédentiels', icon: Database }
  ]

  const generateAttackId = () => {
    return 'adv_attack_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  useEffect(() => {
    let interval
    if (isRunning && attackConfig.attack_id) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/attack_status/${attackConfig.attack_id}`)
          if (response.ok) {
            const status = await response.json()
            setAttackStatus(status)
            
            // Mettre à jour les résultats
            if (status.vulnerabilities_found) {
              setVulnerabilities(status.vulnerabilities_found)
            }
            if (status.services_discovered) {
              setDiscoveredServices(status.services_discovered)
            }
            if (status.credentials_found) {
              setFoundCredentials(status.credentials_found)
            }
            
            if (!status.running) {
              setIsRunning(false)
              if (status.vulnerabilities_found?.length > 0) {
                setSuccess(`${status.vulnerabilities_found.length} vulnérabilité(s) trouvée(s)`)
              } else if (status.services_discovered?.length > 0) {
                setSuccess(`${status.services_discovered.length} service(s) découvert(s)`)
              } else if (status.credentials_found?.length > 0) {
                setSuccess(`${status.credentials_found.length} crédentiel(s) trouvé(s)`)
              } else {
                setError('Attaque terminée sans résultat')
              }
            }
          } else if (response.status === 404) {
            setIsRunning(false)
          }
        } catch (err) {
          console.error('Erreur lors de la récupération du statut:', err)
        }
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isRunning, attackConfig.attack_id])

  const handleStartAttack = async () => {
    setError('')
    setSuccess('')
    setVulnerabilities([])
    setDiscoveredServices([])
    setFoundCredentials([])
    
    const attackId = generateAttackId()
    const configToSend = { 
      ...attackConfig, 
      attack_id: attackId
    }

    try {
      const endpoint = activeTab === 'network' ? 'start_network_attack' : 'start_advanced_attack'
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configToSend),
      })

      if (response.ok) {
        setAttackConfig(configToSend)
        setIsRunning(true)
        setAttackStatus({ 
          running: true, 
          attempts: 0, 
          elapsed_time: 0,
          vulnerabilities_found: [],
          services_discovered: [],
          credentials_found: []
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erreur lors du démarrage de l\'attaque')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    }
  }

  const handleStopAttack = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stop_attack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attack_id: attackConfig.attack_id }),
      })

      if (response.ok) {
        setIsRunning(false)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erreur lors de l\'arrêt de l\'attaque')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m ${secs.toString().padStart(2, '0')}s`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const renderWebAttackConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Type d'attaque web</Label>
        <Select 
          value={attackConfig.attack_type} 
          onValueChange={(value) => setAttackConfig({...attackConfig, attack_type: value})}
          disabled={isRunning}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {webAttackTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center space-x-2">
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-white">URL cible</Label>
        <Input
          value={attackConfig.target_params.url}
          onChange={(e) => setAttackConfig({
            ...attackConfig, 
            target_params: { ...attackConfig.target_params, url: e.target.value }
          })}
          placeholder="https://example.com/login.php"
          className="bg-slate-700 border-slate-600 text-white"
          disabled={isRunning}
        />
      </div>

      {['sql_injection', 'xss_attack', 'directory_traversal', 'command_injection'].includes(attackConfig.attack_type) && (
        <div className="space-y-2">
          <Label className="text-white">Paramètres à tester (un par ligne)</Label>
          <Textarea
            value={attackConfig.target_params.parameters?.join('\n') || ''}
            onChange={(e) => setAttackConfig({
              ...attackConfig, 
              target_params: { 
                ...attackConfig.target_params, 
                parameters: e.target.value.split('\n').filter(p => p.trim() !== '') 
              }
            })}
            placeholder="username&#10;password&#10;id"
            className="bg-slate-700 border-slate-600 text-white"
            disabled={isRunning}
            rows={4}
          />
        </div>
      )}

      {attackConfig.attack_type === 'api_fuzzing' && (
        <div className="space-y-2">
          <Label className="text-white">URL de base de l'API</Label>
          <Input
            value={attackConfig.target_params.base_url}
            onChange={(e) => setAttackConfig({
              ...attackConfig, 
              target_params: { ...attackConfig.target_params, base_url: e.target.value }
            })}
            placeholder="https://api.example.com"
            className="bg-slate-700 border-slate-600 text-white"
            disabled={isRunning}
          />
        </div>
      )}
    </div>
  )

  const renderNetworkAttackConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Type d'attaque réseau</Label>
        <Select 
          value={attackConfig.attack_type} 
          onValueChange={(value) => setAttackConfig({...attackConfig, attack_type: value})}
          disabled={isRunning}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {networkAttackTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center space-x-2">
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {attackConfig.attack_type === 'network_discovery' && (
        <div className="space-y-2">
          <Label className="text-white">Réseau à scanner</Label>
          <Input
            value={attackConfig.target_params.network}
            onChange={(e) => setAttackConfig({
              ...attackConfig, 
              target_params: { ...attackConfig.target_params, network: e.target.value }
            })}
            placeholder="192.168.1.0/24"
            className="bg-slate-700 border-slate-600 text-white"
            disabled={isRunning}
          />
        </div>
      )}

      {['port_scan', 'service_enumeration', 'ssh_bruteforce', 'ftp_bruteforce', 'smtp_bruteforce', 'ssl_attack', 'snmp_attack', 'smb_attack'].includes(attackConfig.attack_type) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Hôte cible</Label>
            <Input
              value={attackConfig.target_params.host}
              onChange={(e) => setAttackConfig({
                ...attackConfig, 
                target_params: { ...attackConfig.target_params, host: e.target.value }
              })}
              placeholder="192.168.1.100"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Port</Label>
            <Input
              type="number"
              value={attackConfig.target_params.port}
              onChange={(e) => setAttackConfig({
                ...attackConfig, 
                target_params: { ...attackConfig.target_params, port: parseInt(e.target.value) || 80 }
              })}
              placeholder="22"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={isRunning}
            />
          </div>
        </div>
      )}

      {attackConfig.attack_type === 'subdomain_enumeration' && (
        <div className="space-y-2">
          <Label className="text-white">Domaine cible</Label>
          <Input
            value={attackConfig.target_params.domain}
            onChange={(e) => setAttackConfig({
              ...attackConfig, 
              target_params: { ...attackConfig.target_params, domain: e.target.value }
            })}
            placeholder="example.com"
            className="bg-slate-700 border-slate-600 text-white"
            disabled={isRunning}
          />
        </div>
      )}

      {['ssh_bruteforce', 'ftp_bruteforce', 'smtp_bruteforce'].includes(attackConfig.attack_type) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Noms d'utilisateur (un par ligne)</Label>
            <Textarea
              value={attackConfig.target_params.usernames?.join('\n') || ''}
              onChange={(e) => setAttackConfig({
                ...attackConfig, 
                target_params: { 
                  ...attackConfig.target_params, 
                  usernames: e.target.value.split('\n').filter(u => u.trim() !== '') 
                }
              })}
              placeholder="root&#10;admin&#10;user"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={isRunning}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Mots de passe (un par ligne)</Label>
            <Textarea
              value={attackConfig.target_params.passwords?.join('\n') || ''}
              onChange={(e) => setAttackConfig({
                ...attackConfig, 
                target_params: { 
                  ...attackConfig.target_params, 
                  passwords: e.target.value.split('\n').filter(p => p.trim() !== '') 
                }
              })}
              placeholder="password&#10;123456&#10;admin"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={isRunning}
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  )

  const renderSocialAttackConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Type d'attaque sociale</Label>
        <Select 
          value={attackConfig.attack_type} 
          onValueChange={(value) => setAttackConfig({...attackConfig, attack_type: value})}
          disabled={isRunning}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {socialAttackTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center space-x-2">
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {attackConfig.attack_type === 'social_engineering' && (
        <div className="space-y-2">
          <Label className="text-white">Domaine cible</Label>
          <Input
            value={attackConfig.target_params.domain}
            onChange={(e) => setAttackConfig({
              ...attackConfig, 
              target_params: { ...attackConfig.target_params, domain: e.target.value }
            })}
            placeholder="example.com"
            className="bg-slate-700 border-slate-600 text-white"
            disabled={isRunning}
          />
        </div>
      )}

      {attackConfig.attack_type === 'password_spray' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">URL de connexion</Label>
            <Input
              value={attackConfig.target_params.url}
              onChange={(e) => setAttackConfig({
                ...attackConfig, 
                target_params: { ...attackConfig.target_params, url: e.target.value }
              })}
              placeholder="https://example.com/login"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={isRunning}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Noms d'utilisateur (un par ligne)</Label>
              <Textarea
                value={attackConfig.target_params.usernames?.join('\n') || ''}
                onChange={(e) => setAttackConfig({
                  ...attackConfig, 
                  target_params: { 
                    ...attackConfig.target_params, 
                    usernames: e.target.value.split('\n').filter(u => u.trim() !== '') 
                  }
                })}
                placeholder="user1@example.com&#10;user2@example.com"
                className="bg-slate-700 border-slate-600 text-white"
                disabled={isRunning}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Mots de passe (un par ligne)</Label>
              <Textarea
                value={attackConfig.target_params.passwords?.join('\n') || ''}
                onChange={(e) => setAttackConfig({
                  ...attackConfig, 
                  target_params: { 
                    ...attackConfig.target_params, 
                    passwords: e.target.value.split('\n').filter(p => p.trim() !== '') 
                  }
                })}
                placeholder="Password123&#10;Summer2024&#10;Welcome1"
                className="bg-slate-700 border-slate-600 text-white"
                disabled={isRunning}
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderResults = () => (
    <div className="space-y-4">
      {/* Vulnérabilités trouvées */}
      {vulnerabilities.length > 0 && (
        <Card className="bg-red-900/20 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center space-x-2">
              <Bug className="h-5 w-5" />
              <span>Vulnérabilités trouvées ({vulnerabilities.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vulnerabilities.map((vuln, index) => (
                <div key={index} className="p-3 bg-red-900/30 rounded border border-red-500/30">
                  <div className="flex items-center justify-between">
                    <Badge variant="destructive">{vuln.type}</Badge>
                    <span className="text-xs text-red-300">{vuln.url || vuln.host}</span>
                  </div>
                  {vuln.parameter && (
                    <p className="text-sm text-red-200 mt-1">Paramètre: {vuln.parameter}</p>
                  )}
                  {vuln.payload && (
                    <p className="text-xs text-red-300 mt-1 font-mono bg-red-900/50 p-1 rounded">
                      {vuln.payload}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services découverts */}
      {discoveredServices.length > 0 && (
        <Card className="bg-blue-900/20 border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Services découverts ({discoveredServices.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {discoveredServices.map((service, index) => (
                <div key={index} className="p-3 bg-blue-900/30 rounded border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{service.service || service.type}</Badge>
                    <span className="text-xs text-blue-300">
                      {service.host || service.ip}:{service.port}
                    </span>
                  </div>
                  {service.state && (
                    <p className="text-sm text-blue-200 mt-1">État: {service.state}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crédentiels trouvés */}
      {foundCredentials.length > 0 && (
        <Card className="bg-green-900/20 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Crédentiels trouvés ({foundCredentials.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {foundCredentials.map((cred, index) => (
                <div key={index} className="p-3 bg-green-900/30 rounded border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-green-600">{cred.service}</Badge>
                    <span className="text-xs text-green-300">{cred.host || cred.url}</span>
                  </div>
                  <p className="text-sm text-green-200 mt-1 font-mono">
                    {cred.username}:{cred.password}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Bug className="h-8 w-8 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Attaques Avancées</h2>
        </div>
        <p className="text-slate-300">Tests de pénétration et recherche de vulnérabilités</p>
      </div>

      {/* Avertissement */}
      <Alert className="border-red-500 bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-200">
          <strong>ATTENTION :</strong> Ces outils sont extrêmement puissants et ne doivent être utilisés que sur vos propres systèmes ou avec autorisation explicite. L'utilisation malveillante est illégale.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Configuration de l'attaque</CardTitle>
            <CardDescription className="text-slate-300">
              Sélectionnez le type d'attaque et configurez les paramètres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="web" className="text-white">Web</TabsTrigger>
                <TabsTrigger value="network" className="text-white">Réseau</TabsTrigger>
                <TabsTrigger value="social" className="text-white">Social</TabsTrigger>
              </TabsList>
              
              <TabsContent value="web" className="mt-4">
                {renderWebAttackConfig()}
              </TabsContent>
              
              <TabsContent value="network" className="mt-4">
                {renderNetworkAttackConfig()}
              </TabsContent>
              
              <TabsContent value="social" className="mt-4">
                {renderSocialAttackConfig()}
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2 mt-6">
              <Button 
                onClick={handleStartAttack} 
                disabled={isRunning}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Démarrer l'attaque
              </Button>
              
              {isRunning && (
                <Button 
                  onClick={handleStopAttack}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statut et résultats */}
        <div className="space-y-6">
          {/* Statut de l'attaque */}
          {attackStatus && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  <span>Statut de l'attaque</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Tentatives:</span>
                    <span className="text-white ml-2">{attackStatus.attempts || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Temps écoulé:</span>
                    <span className="text-white ml-2">{formatTime(attackStatus.elapsed_time || 0)}</span>
                  </div>
                </div>
                
                {attackStatus.current_target && (
                  <div>
                    <span className="text-slate-400">Cible actuelle:</span>
                    <p className="text-white text-xs font-mono bg-slate-700 p-2 rounded mt-1 break-all">
                      {attackStatus.current_target}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Messages */}
          {error && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          {/* Résultats */}
          {renderResults()}
        </div>
      </div>
    </div>
  )
}

