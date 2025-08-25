/**
 * SecurityAnalysis Component - Analyse avancée de sécurité
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Lock,
  Unlock,
  Eye
} from 'lucide-react'

const SecurityAnalysis = ({ targetPassword, attackConfig, attackStatus }) => {
  const [analysis, setAnalysis] = useState({
    strength: 0,
    vulnerabilities: [],
    recommendations: [],
    complexity: 'unknown'
  })

  useEffect(() => {
    if (targetPassword) {
      analyzePassword(targetPassword)
    }
  }, [targetPassword])

  const analyzePassword = (password) => {
    let score = 0
    let vulnerabilities = []
    let recommendations = []

    // Analyse de la longueur
    if (password.length < 8) {
      vulnerabilities.push({
        type: 'critical',
        message: 'Mot de passe trop court (< 8 caractères)',
        icon: XCircle
      })
    } else if (password.length < 12) {
      vulnerabilities.push({
        type: 'warning',
        message: 'Longueur faible (recommandé : 12+ caractères)',
        icon: AlertTriangle
      })
      score += 20
    } else {
      score += 40
    }

    // Analyse de la complexité
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasDigits = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

    if (hasLower) score += 10
    if (hasUpper) score += 10
    if (hasDigits) score += 10
    if (hasSpecial) score += 20

    if (!hasLower || !hasUpper) {
      vulnerabilities.push({
        type: 'warning',
        message: 'Manque de variation dans la casse',
        icon: AlertTriangle
      })
    }

    if (!hasDigits) {
      vulnerabilities.push({
        type: 'warning',
        message: 'Aucun chiffre détecté',
        icon: AlertTriangle
      })
    }

    if (!hasSpecial) {
      vulnerabilities.push({
        type: 'warning',
        message: 'Aucun caractère spécial',
        icon: AlertTriangle
      })
    }

    // Détection de patterns communs
    const commonPatterns = [
      { pattern: /password/i, message: 'Contient le mot "password"' },
      { pattern: /123456/, message: 'Contient une séquence numérique faible' },
      { pattern: /qwerty/i, message: 'Contient une séquence de clavier' },
      { pattern: /admin/i, message: 'Contient le mot "admin"' }
    ]

    commonPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(password)) {
        vulnerabilities.push({
          type: 'critical',
          message,
          icon: XCircle
        })
        score -= 20
      }
    })

    // Génération des recommandations
    if (password.length < 12) {
      recommendations.push('Augmenter la longueur à 12+ caractères')
    }
    if (!hasSpecial) {
      recommendations.push('Ajouter des caractères spéciaux (!@#$%)')
    }
    if (!hasUpper || !hasLower) {
      recommendations.push('Utiliser majuscules ET minuscules')
    }
    if (!hasDigits) {
      recommendations.push('Inclure des chiffres')
    }

    recommendations.push('Éviter les mots du dictionnaire')
    recommendations.push('Ne pas utiliser d\'informations personnelles')

    // Détermination du niveau de complexité
    let complexity
    if (score >= 80) complexity = 'forte'
    else if (score >= 60) complexity = 'moyenne'
    else if (score >= 40) complexity = 'faible'
    else complexity = 'très faible'

    setAnalysis({
      strength: Math.max(0, Math.min(100, score)),
      vulnerabilities,
      recommendations,
      complexity
    })
  }

  const getStrengthColor = (strength) => {
    if (strength >= 80) return 'text-green-600'
    if (strength >= 60) return 'text-yellow-600'
    if (strength >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getStrengthBarColor = (strength) => {
    if (strength >= 80) return 'bg-green-600'
    if (strength >= 60) return 'bg-yellow-600'
    if (strength >= 40) return 'bg-orange-600'
    return 'bg-red-600'
  }

  const estimateBreakTime = () => {
    if (!attackStatus || !attackStatus.speed) return 'Calcul en cours...'
    
    const combinations = Math.pow(94, targetPassword?.length || 8) // ASCII printable
    const timeSeconds = combinations / (attackStatus.speed * 2) // Moyenne statistique
    
    if (timeSeconds < 60) return `${Math.round(timeSeconds)} secondes`
    if (timeSeconds < 3600) return `${Math.round(timeSeconds / 60)} minutes`
    if (timeSeconds < 86400) return `${Math.round(timeSeconds / 3600)} heures`
    if (timeSeconds < 31536000) return `${Math.round(timeSeconds / 86400)} jours`
    return `${Math.round(timeSeconds / 31536000)} années`
  }

  return (
    <div className="space-y-6">
      {/* Score de sécurité global */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Analyse de Sécurité</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Évaluation de la robustesse du mot de passe testé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white">
                Force du mot de passe
              </span>
              <span className={`text-sm font-bold ${getStrengthColor(analysis.strength)}`}>
                {analysis.complexity.toUpperCase()}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getStrengthBarColor(analysis.strength)}`}
                style={{ width: `${analysis.strength}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>0%</span>
              <span>{analysis.strength}%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStrengthColor(analysis.strength)}`}>
                {analysis.strength}%
              </div>
              <div className="text-xs text-slate-400">Score de sécurité</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {estimateBreakTime()}
              </div>
              <div className="text-xs text-slate-400">Temps de cassage estimé</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vulnérabilités détectées */}
      {analysis.vulnerabilities.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Vulnérabilités Détectées</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.vulnerabilities.map((vuln, index) => (
              <Alert
                key={index}
                className={`${
                  vuln.type === 'critical' 
                    ? 'border-red-500 bg-red-500/10' 
                    : 'border-yellow-500 bg-yellow-500/10'
                }`}
              >
                <vuln.icon className={`h-4 w-4 ${
                  vuln.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <AlertDescription className={
                  vuln.type === 'critical' ? 'text-red-200' : 'text-yellow-200'
                }>
                  {vuln.message}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommandations */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Recommandations de Sécurité</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-slate-300">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations sur le test */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <span>Contexte du Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Type d'attaque:</span>
            <Badge variant="outline">{attackConfig?.attack_type || 'N/A'}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Longueur testée:</span>
            <span className="text-white">
              {attackConfig?.min_length || 'N/A'} - {attackConfig?.max_length || 'N/A'} caractères
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Jeu de caractères:</span>
            <Badge variant="outline">{attackConfig?.charset || 'Standard'}</Badge>
          </div>
          
          <Alert className="border-blue-500 bg-blue-500/10 mt-4">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-200">
              Cette analyse est effectuée dans un cadre éducatif pour sensibiliser 
              aux enjeux de sécurité des mots de passe.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecurityAnalysis
