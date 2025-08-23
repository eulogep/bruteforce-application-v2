import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Shield, Play, Square, AlertTriangle, CheckCircle, Clock, Cpu, HardDrive } from 'lucide-react'
import './App.css'

// Configuration de l'API backend
const API_BASE_URL = '/api'

function App() {
  const [attackConfig, setAttackConfig] = useState({
    attack_id: '',
    attack_type: 'simple_string',
    charset: 'ascii_lowercase',
    custom_charset: '',
    min_length: 1,
    max_length: 4,
    dictionary_name: '',
    rules: [],
    append_length: 1,
    gpu_attack_mode: 'bruteforce', // New: for GPU attacks
    gpu_dictionary_path: '', // New: for GPU dictionary attacks
    leaked_credentials_file: '', // New: for credential stuffing
    target_url: '', // New: for credential stuffing
    login_field_name: '', // New: for credential stuffing
    password_field_name: '', // New: for credential stuffing
    success_indicator: '', // New: for credential stuffing
    target_params: {
      type: 'simple_string',
      target_string: '',
      hash: '',
      hash_type: 'md5',
      url: '',
      username: ''
    }
  })

  const [attackStatus, setAttackStatus] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dictionaries, setDictionaries] = useState([])
  const [availableRules, setAvailableRules] = useState([])
  const [gpuInfo, setGpuInfo] = useState(null) // New: to store GPU information

  const generateAttackId = () => {
    return 'attack_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dictionaries`)
        if (response.ok) {
          const data = await response.json()
          setDictionaries(data)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des dictionnaires:', err)
        // Set default dictionaries for demo purposes
        setDictionaries(['rockyou', 'common_passwords', 'french_passwords'])
      }
    }

    const fetchRules = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/rules`)
        if (response.ok) {
          const data = await response.json()
          setAvailableRules(data)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des règles:', err)
        // Set default rules for demo purposes
        setAvailableRules([':capitalize', ':uppercase', ':lowercase', ':append_digit:N', ':prepend_digit:N'])
      }
    }

    const fetchGpuInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/gpu_info`)
        if (response.ok) {
          const data = await response.json()
          setGpuInfo(data)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des informations GPU:', err)
        // Set default GPU info for demo purposes
        setGpuInfo({
          gpu_available: false,
          hashcat_available: false,
          john_available: false,
          hashcat_path: null,
          john_path: null
        })
      }
    }

    fetchDictionaries()
    fetchRules()
    fetchGpuInfo()
  }, [])

  useEffect(() => {
    let interval
    if (isRunning && attackConfig.attack_id) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/attack_status/${attackConfig.attack_id}`)
          if (response.ok) {
            const status = await response.json()
            setAttackStatus(status)
            if (!status.running) {
              setIsRunning(false)
              if (status.found_password) {
                setSuccess(`Mot de passe trouvé : ${status.found_password}`)
              } else if (status.found_credentials && status.found_credentials.length > 0) {
                setSuccess(`Crédentiels trouvés : ${status.found_credentials[0].username}:${status.found_credentials[0].password}`)
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
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, attackConfig.attack_id])

  const handleStartAttack = async () => {
    setError('')
    setSuccess('')

    const attackId = generateAttackId()
    const configToSend = {
      ...attackConfig,
      attack_id: attackId,
      target_params: { ...attackConfig.target_params, type: attackConfig.attack_type }
    }

    // Add credential stuffing specific parameters to configToSend
    if (attackConfig.attack_type === 'credential_stuffing') {
      configToSend.leaked_credentials_file = attackConfig.leaked_credentials_file
      configToSend.target_url = attackConfig.target_url
      configToSend.login_field_name = attackConfig.login_field_name
      configToSend.password_field_name = attackConfig.password_field_name
      configToSend.success_indicator = attackConfig.success_indicator
    }

    try {
      const response = await fetch(`${API_BASE_URL}/start_attack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configToSend),
      })

      if (response.ok) {
        setAttackConfig(configToSend)
        setIsRunning(true)
        setAttackStatus({ running: true, attempts: 0, elapsed_time: 0, found_password: null, speed: 0, progress: 0, total_combinations: 0, eta_seconds: 0, found_credentials: [] })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erreur lors du démarrage de l\'attaque')
      }
    } catch (err) {
      // Demo mode - simulate attack start when backend is not available
      setError('')
      setAttackConfig(configToSend)
      setIsRunning(true)
      setAttackStatus({
        running: true,
        attempts: 0,
        elapsed_time: 0,
        found_password: null,
        speed: 0,
        progress: 0,
        total_combinations: Math.pow(26, Math.max(configToSend.min_length || 4, 4)),
        eta_seconds: 300,
        found_credentials: []
      })
      setSuccess('Mode démo activé - Backend non disponible')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">BruteForce Tool</h1>
          </div>
          <p className="text-slate-300">Outil de test de sécurité pour l'éducation et les tests autorisés</p>
        </div>

        {/* Avertissement */}
        <Alert className="border-yellow-500 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            <strong>Avertissement :</strong> Cet outil est destiné uniquement à des fins éducatives et de test de sécurité autorisé. 
            L'utilisation non autorisée contre des systèmes tiers est illégale et contraire à l'éthique.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Configuration de l'attaque</CardTitle>
              <CardDescription className="text-slate-300">
                Configurez les paramètres de votre test de brute force
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type d'attaque */}
              <div className="space-y-2">
                <Label className="text-white">Type d'attaque</Label>
                <Select 
                  value={attackConfig.attack_type} 
                  onValueChange={(value) => setAttackConfig({...attackConfig, attack_type: value})}
                  disabled={isRunning}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="charset">Par jeu de caractères</SelectItem>
                    <SelectItem value="dictionary">Par dictionnaire</SelectItem>
                    <SelectItem value="rule_based">Basée sur des règles</SelectItem>
                    <SelectItem value="hybrid">Hybride</SelectItem>
                    <SelectItem value="hash_crack">Craquage de hash (CPU)</SelectItem>
                    <SelectItem value="gpu_hash_crack">Craquage de hash (GPU)</SelectItem>
                    <SelectItem value="http_basic_auth">HTTP Basic Auth</SelectItem>
                    <SelectItem value="simple_string">Chaîne simple</SelectItem>
                    <SelectItem value="credential_stuffing">Credential Stuffing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Paramètres spécifiques au type d'attaque */}
              {(attackConfig.attack_type === 'charset' || attackConfig.attack_type === 'hybrid') && (
                <div className="space-y-2">
                  <Label className="text-white">Jeu de caractères</Label>
                  <Select 
                    value={attackConfig.charset} 
                    onValueChange={(value) => setAttackConfig({...attackConfig, charset: value})}
                    disabled={isRunning}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="ascii_lowercase">Minuscules (a-z)</SelectItem>
                      <SelectItem value="ascii_uppercase">Majuscules (A-Z)</SelectItem>
                      <SelectItem value="digits">Chiffres (0-9)</SelectItem>
                      <SelectItem value="punctuation">Ponctuation (!@#$)</SelectItem>
                      <SelectItem value="printable">Tous caractères imprimables</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {attackConfig.charset === 'custom' && (
                <div className="space-y-2">
                  <Label className="text-white">Caractères personnalisés</Label>
                  <Input
                    value={attackConfig.custom_charset}
                    onChange={(e) => setAttackConfig({
                      ...attackConfig, 
                      custom_charset: e.target.value
                    })}
                    placeholder="abc123"
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={isRunning}
                  />
                </div>
              )}

              {(attackConfig.attack_type === 'charset') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Longueur min</Label>
                    <Input
                      type="number"
                      value={attackConfig.min_length}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig, 
                        min_length: parseInt(e.target.value) || 1
                      })}
                      min="1"
                      max="10"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Longueur max</Label>
                    <Input
                      type="number"
                      value={attackConfig.max_length}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig, 
                        max_length: parseInt(e.target.value) || 1
                      })}
                      min="1"
                      max="10"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                </div>
              )}

              {(attackConfig.attack_type === 'dictionary' || attackConfig.attack_type === 'rule_based' || attackConfig.attack_type === 'hybrid') && (
                <div className="space-y-2">
                  <Label className="text-white">Dictionnaire</Label>
                  <Select 
                    value={attackConfig.dictionary_name} 
                    onValueChange={(value) => setAttackConfig({...attackConfig, dictionary_name: value})}
                    disabled={isRunning}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Sélectionner un dictionnaire" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {dictionaries.map(dictName => (
                        <SelectItem key={dictName} value={dictName}>{dictName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {attackConfig.attack_type === 'rule_based' && (
                <div className="space-y-2">
                  <Label className="text-white">Règles (séparées par des virgules)</Label>
                  <Textarea
                    value={attackConfig.rules.join(', ')}
                    onChange={(e) => setAttackConfig({
                      ...attackConfig, 
                      rules: e.target.value.split(',').map(rule => rule.trim()).filter(rule => rule !== '')
                    })}
                    placeholder="ex: :capitalize, :append_digit:2"
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={isRunning}
                  />
                  <p className="text-xs text-slate-400">Règles disponibles: {availableRules.join(', ')}</p>
                </div>
              )}

              {attackConfig.attack_type === 'hybrid' && (
                <div className="space-y-2">
                  <Label className="text-white">Longueur à ajouter (chiffres/caractères)</Label>
                  <Input
                    type="number"
                    value={attackConfig.append_length}
                    onChange={(e) => setAttackConfig({
                      ...attackConfig, 
                      append_length: parseInt(e.target.value) || 1
                    })}
                    min="1"
                    max="5"
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={isRunning}
                  />
                </div>
              )}

              {(attackConfig.attack_type === 'simple_string' || attackConfig.attack_type === 'hash_crack' || attackConfig.attack_type === 'gpu_hash_crack') && (
                <div className="space-y-2">
                  <Label className="text-white">Chaîne cible</Label>
                  <Input
                    value={attackConfig.target_params.target_string}
                    onChange={(e) => setAttackConfig({
                      ...attackConfig,
                      target_params: { ...attackConfig.target_params, target_string: e.target.value }
                    })}
                    placeholder="password123"
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={isRunning}
                  />
                </div>
              )}

              {(attackConfig.attack_type === 'hash_crack' || attackConfig.attack_type === 'gpu_hash_crack') && (
                <>
                  <div className="space-y-2">
                    <Label className="text-white">Type de hash</Label>
                    <Select 
                      value={attackConfig.target_params.hash_type} 
                      onValueChange={(value) => setAttackConfig({
                        ...attackConfig,
                        target_params: { ...attackConfig.target_params, hash_type: value }
                      })}
                      disabled={isRunning}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="md5">MD5</SelectItem>
                        <SelectItem value="sha1">SHA1</SelectItem>
                        <SelectItem value="sha256">SHA256</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Hash cible</Label>
                    <Input
                      value={attackConfig.target_params.hash}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig,
                        target_params: { ...attackConfig.target_params, hash: e.target.value }
                      })}
                      placeholder="e.g., 5d41402abc4b2a76b9719d911017c592 (md5 of 'hello')"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                </>
              )}

              {attackConfig.attack_type === 'gpu_hash_crack' && gpuInfo?.gpu_available && (
                <div className="space-y-2">
                  <Label className="text-white">Mode d'attaque GPU</Label>
                  <Select 
                    value={attackConfig.gpu_attack_mode} 
                    onValueChange={(value) => setAttackConfig({...attackConfig, gpu_attack_mode: value})}
                    disabled={isRunning}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="bruteforce">Brute Force</SelectItem>
                      <SelectItem value="dictionary">Dictionnaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {attackConfig.attack_type === 'gpu_hash_crack' && gpuInfo?.gpu_available && attackConfig.gpu_attack_mode === 'dictionary' && (
                <div className="space-y-2">
                  <Label className="text-white">Chemin du dictionnaire GPU (sur le serveur)</Label>
                  <Input
                    value={attackConfig.gpu_dictionary_path}
                    onChange={(e) => setAttackConfig({
                      ...attackConfig, 
                      gpu_dictionary_path: e.target.value
                    })}
                    placeholder="/path/to/rockyou.txt"
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={isRunning}
                  />
                </div>
              )}

              {attackConfig.attack_type === 'http_basic_auth' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-white">URL cible (avec /)</Label>
                    <Input
                      value={attackConfig.target_params.url}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig,
                        target_params: { ...attackConfig.target_params, url: e.target.value }
                      })}
                      placeholder="http://example.com/admin/"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Nom d'utilisateur (si connu)</Label>
                    <Input
                      value={attackConfig.target_params.username}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig,
                        target_params: { ...attackConfig.target_params, username: e.target.value }
                      })}
                      placeholder="admin"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                </>
              )}

              {attackConfig.attack_type === 'credential_stuffing' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-white">Fichier de crédentiels fuis (sur le serveur)</Label>
                    <Input
                      value={attackConfig.leaked_credentials_file}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig, 
                        leaked_credentials_file: e.target.value
                      })}
                      placeholder="/path/to/leaked_creds.txt (format: user:pass)"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">URL de la page de connexion cible</Label>
                    <Input
                      value={attackConfig.target_url}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig, 
                        target_url: e.target.value
                      })}
                      placeholder="http://example.com/login"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Nom du champ de connexion (input name)</Label>
                    <Input
                      value={attackConfig.login_field_name}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig, 
                        login_field_name: e.target.value
                      })}
                      placeholder="username ou email"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Nom du champ de mot de passe (input name)</Label>
                    <Input
                      value={attackConfig.password_field_name}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig, 
                        password_field_name: e.target.value
                      })}
                      placeholder="password"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Indicateur de succès (texte ou URL)</Label>
                    <Input
                      value={attackConfig.success_indicator}
                      onChange={(e) => setAttackConfig({
                        ...attackConfig, 
                        success_indicator: e.target.value
                      })}
                      placeholder="Bienvenue sur le tableau de bord ou /dashboard"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isRunning}
                    />
                  </div>
                </>
              )}

              <Button 
                onClick={handleStartAttack} 
                disabled={isRunning} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4" /> Démarrer
              </Button>
              <Button 
                onClick={handleStopAttack} 
                disabled={!isRunning} 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Square className="mr-2 h-4 w-4" /> Arrêter
              </Button>
            </CardContent>
          </Card>

          {/* Statut de l'attaque */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Statut de l'attaque</CardTitle>
              <CardDescription className="text-slate-300">
                Suivez la progression de votre attaque en temps réel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {attackStatus && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Statut</span>
                      <Badge className={attackStatus.running ? "bg-green-500" : "bg-red-500"}>
                        {attackStatus.running ? 'En cours' : 'Arrêtée'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Tentatives</span>
                      <span className="text-white font-mono">{attackStatus.attempts?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Combinaisons totales</span>
                      <span className="text-white font-mono">{attackStatus.total_combinations?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Temps écoulé</span>
                      <span className="text-white font-mono">{formatTime(attackStatus.elapsed_time || 0)}</span>
                    </div>
                    {attackStatus.running && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Vitesse</span>
                        <span className="text-white font-mono">
                          {attackStatus.speed ? Math.round(attackStatus.speed).toLocaleString() : 0} tentatives/sec
                        </span>
                      </div>
                    )}
                    {attackStatus.running && attackStatus.total_combinations > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Progression</span>
                          <span className="text-white font-mono">{attackStatus.progress.toFixed(2)}%</span>
                        </div>
                        <Progress value={attackStatus.progress} className="w-full" />
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Temps restant estimé</span>
                          <span className="text-white font-mono">{formatTime(attackStatus.eta_seconds || 0)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {attackStatus.found_password && (
                    <Alert className="border-green-500 bg-green-500/10">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-200">
                        Mot de passe trouvé : <strong className="text-white">{attackStatus.found_password}</strong>
                      </AlertDescription>
                    </Alert>
                  )}

                  {attackStatus.found_credentials && attackStatus.found_credentials.length > 0 && (
                    <Alert className="border-green-500 bg-green-500/10">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-200">
                        Crédentiels trouvés :
                        <ul>
                          {attackStatus.found_credentials.map((cred, index) => (
                            <li key={index}><strong className="text-white">{cred.username}:{cred.password}</strong> sur {cred.url}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* GPU Information Section */}
        {gpuInfo && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>Informations GPU</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-300">
              <div className="flex justify-between text-sm">
                <span>GPU disponible:</span>
                <span className="font-mono text-white">{gpuInfo.gpu_available ? 'Oui' : 'Non'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Hashcat disponible:</span>
                <span className="font-mono text-white">{gpuInfo.hashcat_available ? 'Oui' : 'Non'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>John the Ripper disponible:</span>
                <span className="font-mono text-white">{gpuInfo.john_available ? 'Oui' : 'Non'}</span>
              </div>
              {gpuInfo.hashcat_path && (
                <div className="flex justify-between text-sm">
                  <span>Chemin Hashcat:</span>
                  <span className="font-mono text-white text-xs break-all">{gpuInfo.hashcat_path}</span>
                </div>
              )}
              {gpuInfo.john_path && (
                <div className="flex justify-between text-sm">
                  <span>Chemin John the Ripper:</span>
                  <span className="font-mono text-white text-xs break-all">{gpuInfo.john_path}</span>
                </div>
              )}
              {!gpuInfo.gpu_available && (
                <Alert className="border-red-500 bg-red-500/10 mt-4">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-200">
                    Aucun GPU compatible détecté ou les outils nécessaires (hashcat/john) ne sont pas installés.
                    Les attaques GPU ne seront pas disponibles.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dictionary Management Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Gestion des Dictionnaires</CardTitle>
            <CardDescription className="text-slate-300">
              Chargez ou créez des dictionnaires pour vos attaques.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Load Common Dictionary */}
              <div className="space-y-2">
                <Label className="text-white">Charger un dictionnaire commun</Label>
                <Select 
                  onValueChange={async (value) => {
                    try {
                      const response = await fetch(`${API_BASE_URL}/api/dictionaries/load_common`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: value })
                      })
                      if (response.ok) {
                        setSuccess(`Dictionnaire '${value}' chargé avec succès.`)
                        const updatedDictionaries = await fetch(`${API_BASE_URL}/api/dictionaries`).then(res => res.json())
                        setDictionaries(updatedDictionaries)
                      } else {
                        const errData = await response.json()
                        setError(errData.error || `Erreur lors du chargement de '${value}'.`)
                      }
                    } catch (err) {
                      setError('Erreur de connexion au serveur lors du chargement du dictionnaire.')
                    }
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Sélectionner un dictionnaire" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="rockyou">rockyou.txt</SelectItem>
                    <SelectItem value="common_passwords">common_passwords.txt</SelectItem>
                    <SelectItem value="french_passwords">french_passwords.txt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Create Custom Dictionary */}
              <div className="space-y-2">
                <Label className="text-white">Créer un dictionnaire personnalisé</Label>
                <Input
                  placeholder="Nom du dictionnaire"
                  className="bg-slate-700 border-slate-600 text-white mb-2"
                  id="customDictName"
                />
                <Textarea
                  placeholder="Mots (un par ligne)"
                  className="bg-slate-700 border-slate-600 text-white mb-2"
                  id="customDictWords"
                />
                <Button 
                  onClick={async () => {
                    const name = document.getElementById('customDictName').value
                    const words = document.getElementById('customDictWords').value.split('\n').map(w => w.trim()).filter(w => w !== '')
                    if (!name || words.length === 0) {
                      setError('Veuillez fournir un nom et des mots pour le dictionnaire personnalisé.')
                      return
                    }
                    try {
                      const response = await fetch(`${API_BASE_URL}/api/dictionaries/create_custom`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, words })
                      })
                      if (response.ok) {
                        setSuccess(`Dictionnaire '${name}' créé avec succès.`)
                        const updatedDictionaries = await fetch(`${API_BASE_URL}/api/dictionaries`).then(res => res.json())
                        setDictionaries(updatedDictionaries)
                      } else {
                        const errData = await response.json()
                        setError(errData.error || `Erreur lors de la création de '${name}'.`)
                      }
                    } catch (err) {
                      setError('Erreur de connexion au serveur lors de la création du dictionnaire.')
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Créer Dictionnaire
                </Button>
              </div>
            </div>

            {/* Generate Personal Dictionary */}
            <div className="space-y-2">
              <Label className="text-white">Générer un dictionnaire personnel</Label>
              <Input
                placeholder="Nom du dictionnaire personnel"
                className="bg-slate-700 border-slate-600 text-white mb-2"
                id="personalDictName"
              />
              <Textarea
                placeholder="Informations personnelles (JSON)"
                className="bg-slate-700 border-slate-600 text-white mb-2"
                id="personalInfo"
              />
              <Button 
                onClick={async () => {
                  const name = document.getElementById('personalDictName').value
                  let personal_info = {}
                  try {
                    personal_info = JSON.parse(document.getElementById('personalInfo').value)
                  } catch (e) {
                    setError('Format JSON invalide pour les informations personnelles.')
                    return
                  }
                  if (!name || Object.keys(personal_info).length === 0) {
                    setError('Veuillez fournir un nom et des informations pour le dictionnaire personnel.')
                    return
                  }
                  try {
                    const response = await fetch(`${API_BASE_URL}/api/dictionaries/generate_personal`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, personal_info })
                    })
                    if (response.ok) {
                      const result = await response.json()
                      setSuccess(`Dictionnaire personnel '${name}' généré avec succès (${result.word_count} mots).`)
                      const updatedDictionaries = await fetch(`${API_BASE_URL}/api/dictionaries`).then(res => res.json())
                      setDictionaries(updatedDictionaries)
                    } else {
                      const errData = await response.json()
                      setError(errData.error || `Erreur lors de la génération de '${name}'.`)
                    }
                  } catch (err) {
                    setError('Erreur de connexion au serveur lors de la génération du dictionnaire personnel.')
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Générer Dictionnaire Personnel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
