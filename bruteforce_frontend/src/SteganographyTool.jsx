import { useState } from 'react'
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
  Eye, 
  EyeOff, 
  Image, 
  Music, 
  Search, 
  Upload, 
  Download, 
  Lock, 
  Unlock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Zap
} from 'lucide-react'

const API_BASE_URL = 'https://e5h6i7cdwqow.manus.space'

export default function SteganographyTool() {
  const [activeTab, setActiveTab] = useState('hide')
  const [operation, setOperation] = useState('hide_data')
  const [mediaType, setMediaType] = useState('image')
  const [mediaPath, setMediaPath] = useState('')
  const [secretData, setSecretData] = useState('')
  const [outputPath, setOutputPath] = useState('')
  const [password, setPassword] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [extractedData, setExtractedData] = useState('')

  const handleHideData = async () => {
    if (!mediaPath || !secretData || !outputPath) {
      setError('Veuillez remplir tous les champs requis')
      return
    }

    setIsProcessing(true)
    setError('')
    setResult('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/steganography/hide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          media_path: mediaPath,
          secret_data: secretData,
          output_path: outputPath,
          media_type: mediaType,
          password: usePassword ? password : null
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`Données cachées avec succès dans: ${data.output}`)
      } else {
        setError(data.error || 'Erreur lors du masquage des données')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExtractData = async () => {
    if (!mediaPath) {
      setError('Veuillez spécifier le chemin du média')
      return
    }

    setIsProcessing(true)
    setError('')
    setExtractedData('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/steganography/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          media_path: mediaPath,
          media_type: mediaType,
          password: usePassword ? password : null
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setExtractedData(data.data)
        setResult('Données extraites avec succès')
      } else {
        setError(data.error || 'Erreur lors de l\'extraction des données')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAnalyzeMedia = async () => {
    if (!mediaPath) {
      setError('Veuillez spécifier le chemin du média')
      return
    }

    setIsProcessing(true)
    setError('')
    setAnalysisResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/steganography/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          media_path: mediaPath
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAnalysisResult(data.analysis)
        setResult('Analyse terminée')
      } else {
        setError(data.error || 'Erreur lors de l\'analyse')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderHideInterface = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Type de média</Label>
        <Select value={mediaType} onValueChange={setMediaType} disabled={isProcessing}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="image">
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Image (PNG, JPG)</span>
              </div>
            </SelectItem>
            <SelectItem value="audio">
              <div className="flex items-center space-x-2">
                <Music className="h-4 w-4" />
                <span>Audio (WAV)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Chemin du média source</Label>
        <Input
          value={mediaPath}
          onChange={(e) => setMediaPath(e.target.value)}
          placeholder="/chemin/vers/image.png"
          className="bg-slate-700 border-slate-600 text-white"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Données secrètes à cacher</Label>
        <Textarea
          value={secretData}
          onChange={(e) => setSecretData(e.target.value)}
          placeholder="Entrez votre message secret ici..."
          className="bg-slate-700 border-slate-600 text-white"
          disabled={isProcessing}
          rows={4}
        />
        <p className="text-xs text-slate-400">
          Caractères: {secretData.length}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Chemin de sortie</Label>
        <Input
          value={outputPath}
          onChange={(e) => setOutputPath(e.target.value)}
          placeholder="/chemin/vers/output.png"
          className="bg-slate-700 border-slate-600 text-white"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="usePassword"
            checked={usePassword}
            onChange={(e) => setUsePassword(e.target.checked)}
            className="rounded"
            disabled={isProcessing}
          />
          <Label htmlFor="usePassword" className="text-white">
            Utiliser un mot de passe (chiffrement)
          </Label>
        </div>
        
        {usePassword && (
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe pour chiffrer les données"
            className="bg-slate-700 border-slate-600 text-white"
            disabled={isProcessing}
          />
        )}
      </div>

      <Button 
        onClick={handleHideData} 
        disabled={isProcessing}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        <EyeOff className="h-4 w-4 mr-2" />
        {isProcessing ? 'Masquage en cours...' : 'Cacher les données'}
      </Button>
    </div>
  )

  const renderExtractInterface = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Type de média</Label>
        <Select value={mediaType} onValueChange={setMediaType} disabled={isProcessing}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="image">
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Image (PNG, JPG)</span>
              </div>
            </SelectItem>
            <SelectItem value="audio">
              <div className="flex items-center space-x-2">
                <Music className="h-4 w-4" />
                <span>Audio (WAV)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Chemin du média avec données cachées</Label>
        <Input
          value={mediaPath}
          onChange={(e) => setMediaPath(e.target.value)}
          placeholder="/chemin/vers/media_avec_donnees.png"
          className="bg-slate-700 border-slate-600 text-white"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="usePasswordExtract"
            checked={usePassword}
            onChange={(e) => setUsePassword(e.target.checked)}
            className="rounded"
            disabled={isProcessing}
          />
          <Label htmlFor="usePasswordExtract" className="text-white">
            Les données sont chiffrées
          </Label>
        </div>
        
        {usePassword && (
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe pour déchiffrer les données"
            className="bg-slate-700 border-slate-600 text-white"
            disabled={isProcessing}
          />
        )}
      </div>

      <Button 
        onClick={handleExtractData} 
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Eye className="h-4 w-4 mr-2" />
        {isProcessing ? 'Extraction en cours...' : 'Extraire les données'}
      </Button>

      {extractedData && (
        <Card className="bg-green-900/20 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Données extraites</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={extractedData}
              readOnly
              className="bg-slate-700 border-slate-600 text-white"
              rows={6}
            />
            <p className="text-xs text-green-300 mt-2">
              Caractères extraits: {extractedData.length}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderAnalyzeInterface = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Chemin de l'image à analyser</Label>
        <Input
          value={mediaPath}
          onChange={(e) => setMediaPath(e.target.value)}
          placeholder="/chemin/vers/image_suspecte.png"
          className="bg-slate-700 border-slate-600 text-white"
          disabled={isProcessing}
        />
      </div>

      <Button 
        onClick={handleAnalyzeMedia} 
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Search className="h-4 w-4 mr-2" />
        {isProcessing ? 'Analyse en cours...' : 'Analyser le média'}
      </Button>

      {analysisResult && (
        <Card className="bg-blue-900/20 border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Résultats de l'analyse</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-400">Entropie Rouge</p>
                <p className="text-lg font-mono text-red-400">
                  {analysisResult.red_lsb_entropy?.toFixed(3)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Entropie Verte</p>
                <p className="text-lg font-mono text-green-400">
                  {analysisResult.green_lsb_entropy?.toFixed(3)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Entropie Bleue</p>
                <p className="text-lg font-mono text-blue-400">
                  {analysisResult.blue_lsb_entropy?.toFixed(3)}
                </p>
              </div>
            </div>

            {analysisResult.suspicious_patterns && analysisResult.suspicious_patterns.length > 0 && (
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Motifs suspects détectés</span>
                </h4>
                <div className="space-y-1">
                  {analysisResult.suspicious_patterns.map((pattern, index) => (
                    <Badge key={index} variant="destructive" className="mr-2 mb-1">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-slate-400">
              <p><strong>Interprétation:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Entropie élevée (&gt; 0.9) = Possibles données cachées</li>
                <li>Entropie faible (&lt; 0.5) = Probablement pas de stéganographie</li>
                <li>Marqueur de fin détecté = Stéganographie LSB probable</li>
              </ul>
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
          <EyeOff className="h-8 w-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Stéganographie</h2>
        </div>
        <p className="text-slate-300">Cacher et extraire des données secrètes dans des médias</p>
      </div>

      {/* Avertissement */}
      <Alert className="border-purple-500 bg-purple-500/10">
        <AlertTriangle className="h-4 w-4 text-purple-500" />
        <AlertDescription className="text-purple-200">
          <strong>Information :</strong> La stéganographie permet de cacher des informations dans des fichiers multimédias. 
          Utilisez cette fonctionnalité de manière responsable et légale.
        </AlertDescription>
      </Alert>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Outils de stéganographie</CardTitle>
            <CardDescription className="text-slate-300">
              Cacher, extraire et analyser des données dans des images et fichiers audio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="hide" className="text-white">
                  <EyeOff className="h-4 w-4 mr-2" />
                  Cacher
                </TabsTrigger>
                <TabsTrigger value="extract" className="text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  Extraire
                </TabsTrigger>
                <TabsTrigger value="analyze" className="text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Analyser
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="hide" className="mt-6">
                {renderHideInterface()}
              </TabsContent>
              
              <TabsContent value="extract" className="mt-6">
                {renderExtractInterface()}
              </TabsContent>
              
              <TabsContent value="analyze" className="mt-6">
                {renderAnalyzeInterface()}
              </TabsContent>
            </Tabs>

            {/* Messages de résultat et d'erreur */}
            {error && (
              <Alert className="border-red-500 bg-red-500/10 mt-4">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="border-green-500 bg-green-500/10 mt-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-200">{result}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Guide d'utilisation */}
        <Card className="bg-slate-800/50 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Guide d'utilisation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-2">Cacher des données :</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Sélectionnez une image PNG/JPG ou un fichier audio WAV comme support</li>
                <li>Entrez le message secret à cacher</li>
                <li>Spécifiez le chemin de sortie pour le fichier modifié</li>
                <li>Optionnel : Utilisez un mot de passe pour chiffrer les données</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">Extraire des données :</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Sélectionnez le fichier contenant les données cachées</li>
                <li>Si les données sont chiffrées, entrez le mot de passe</li>
                <li>Les données extraites s'afficheront dans la zone de texte</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">Analyser un média :</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Sélectionnez une image à analyser</li>
                <li>L'outil calculera l'entropie des bits de poids faible</li>
                <li>Des motifs suspects indiqueront une possible stéganographie</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

