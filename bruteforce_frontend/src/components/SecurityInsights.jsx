/**
 * Security Insights Component - Analyses de sécurité avancées
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  Info,
  Zap,
  Brain
} from 'lucide-react'

const SecurityInsights = ({ attackConfig, attackStatus }) => {
  const [insights, setInsights] = useState([])
  const [riskLevel, setRiskLevel] = useState('medium')
  const [securityScore, setSecurityScore] = useState(0)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    if (attackConfig || attackStatus) {
      generateSecurityInsights()
    }
  }, [attackConfig, attackStatus])

  const generateSecurityInsights = () => {
    const newInsights = []
    const newRecommendations = []
    let score = 50 // Score de base

    // Analyse du type d'attaque
    if (attackConfig?.attack_type) {
      switch (attackConfig.attack_type) {
        case 'charset':
          if (attackConfig.max_length >= 12) {
            newInsights.push({
              type: 'positive',
              title: 'Longueur de mot de passe robuste',
              description: `Test sur ${attackConfig.max_length} caractères - Sécurité renforcée`,
              icon: CheckCircle,
              impact: 'high'
            })
            score += 20
          } else {
            newInsights.push({
              type: 'warning',
              title: 'Longueur de mot de passe insuffisante',
              description: `${attackConfig.max_length} caractères peuvent être vulnérables`,
              icon: AlertTriangle,
              impact: 'medium'
            })
            newRecommendations.push('Augmenter la longueur minimale à 12+ caractères')
            score -= 10
          }
          break

        case 'dictionary':
          newInsights.push({
            type: 'info',
            title: 'Attaque par dictionnaire détectée',
            description: 'Test contre les mots de passe communs',
            icon: Eye,
            impact: 'medium'
          })
          newRecommendations.push('Éviter les mots du dictionnaire')
          break

        case 'gpu_hash_crack':
          newInsights.push({
            type: 'critical',
            title: 'Attaque GPU haute performance',
            description: 'Capacité de craquage accélérée détectée',
            icon: Zap,
            impact: 'high'
          })
          newRecommendations.push('Utiliser des algorithmes de hachage lents (bcrypt, scrypt)')
          score -= 15
          break
      }
    }

    // Analyse de la vitesse d'attaque
    if (attackStatus?.speed) {
      if (attackStatus.speed > 100000) {
        newInsights.push({
          type: 'critical',
          title: 'Vitesse d\'attaque très élevée',
          description: `${Math.floor(attackStatus.speed / 1000)}K tentatives/sec - Risque critique`,
          icon: TrendingUp,
          impact: 'high'
        })
        setRiskLevel('high')
        score -= 20
      } else if (attackStatus.speed > 50000) {
        newInsights.push({
          type: 'warning',
          title: 'Vitesse d\'attaque modérée',
          description: `${Math.floor(attackStatus.speed / 1000)}K tentatives/sec - Surveillance recommandée`,
          icon: TrendingUp,
          impact: 'medium'
        })
        setRiskLevel('medium')
        score -= 10
      } else {
        newInsights.push({
          type: 'positive',
          title: 'Vitesse d\'attaque contrôlée',
          description: `${Math.floor(attackStatus.speed)} tentatives/sec - Niveau acceptable`,
          icon: TrendingDown,
          impact: 'low'
        })
      }
    }

    // Analyse de la progression
    if (attackStatus?.progress > 50 && !attackStatus?.found_password) {
      newInsights.push({
        type: 'positive',
        title: 'Résistance du mot de passe confirmée',
        description: `${attackStatus.progress.toFixed(1)}% testé sans succès`,
        icon: Shield,
        impact: 'high'
      })
      score += 15
    } else if (attackStatus?.found_password) {
      newInsights.push({
        type: 'critical',
        title: 'Mot de passe compromis !',
        description: 'Le mot de passe a été cracké avec succès',
        icon: Unlock,
        impact: 'critical'
      })
      setRiskLevel('critical')
      score = 10
    }

    // Recommandations générales de sécurité
    const generalRecommendations = [
      'Implémenter une limitation du taux de tentatives',
      'Utiliser l\'authentification à deux facteurs (2FA)',
      'Mettre en place une surveillance des tentatives d\'accès',
      'Éduquer les utilisateurs sur les bonnes pratiques de mots de passe',
      'Considérer l\'utilisation de gestionnaires de mots de passe'
    ]

    setInsights(newInsights)
    setRecommendations([...newRecommendations, ...generalRecommendations.slice(0, 3)])
    setSecurityScore(Math.max(0, Math.min(100, score)))

    // Détermination du niveau de risque final
    if (score >= 80) setRiskLevel('low')
    else if (score >= 60) setRiskLevel('medium')
    else if (score >= 40) setRiskLevel('high')
    else setRiskLevel('critical')
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-orange-500'
      case 'critical': return 'text-red-500'
      default: return 'text-slate-500'
    }
  }

  const getRiskBg = (level) => {
    switch (level) {
      case 'low': return 'bg-green-500/10 border-green-500/30'
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'high': return 'bg-orange-500/10 border-orange-500/30'
      case 'critical': return 'bg-red-500/10 border-red-500/30'
      default: return 'bg-slate-500/10 border-slate-500/30'
    }
  }

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'border-green-500/50 bg-green-500/5'
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/5'
      case 'critical': return 'border-red-500/50 bg-red-500/5'
      case 'info': return 'border-blue-500/50 bg-blue-500/5'
      default: return 'border-slate-500/50 bg-slate-500/5'
    }
  }

  const generateSecurityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      securityScore,
      riskLevel,
      insights: insights.length,
      attackType: attackConfig?.attack_type,
      recommendations: recommendations.length
    }

    const reportText = `
🔒 RAPPORT DE SÉCURITÉ - BruteForce Tool
📅 Date: ${new Date().toLocaleString()}
👨‍💻 Analyste: MABIALA EULOGE JUNIOR

📊 SCORE DE SÉCURITÉ: ${securityScore}/100
🚨 NIVEAU DE RISQUE: ${riskLevel.toUpperCase()}
🔍 TYPE D'ATTAQUE: ${attackConfig?.attack_type || 'N/A'}

🔗 INSIGHTS DÉTECTÉS: ${insights.length}
${insights.map(insight => `• ${insight.title}: ${insight.description}`).join('\n')}

💡 RECOMMANDATIONS: ${recommendations.length}
${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

---
Généré par BruteForce Tool v2.0
Développé par MABIALA EULOGE JUNIOR
    `.trim()

    // Télécharger le rapport
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Score de sécurité global */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>Analyse de Sécurité Avancée</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Évaluation intelligente basée sur les patterns d'attaque détectés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg border ${getRiskBg(riskLevel)}`}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Score de Sécurité</h3>
                <p className="text-sm text-slate-400">Évaluation globale du système</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{securityScore}%</div>
                <Badge className={`${getRiskColor(riskLevel)} border-current`} variant="outline">
                  {riskLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Progress value={securityScore} className="w-full h-2" />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={generateSecurityReport}
              variant="outline"
              className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500 text-purple-300"
            >
              📄 Générer Rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Insights de sécurité */}
      {insights.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span>Insights de Sécurité</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Analyses détaillées basées sur les données d'attaque
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start space-x-3">
                  <insight.icon className={`h-5 w-5 mt-0.5 ${
                    insight.type === 'positive' ? 'text-green-500' :
                    insight.type === 'warning' ? 'text-yellow-500' :
                    insight.type === 'critical' ? 'text-red-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{insight.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{insight.description}</p>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 text-xs ${
                        insight.impact === 'critical' ? 'border-red-500 text-red-300' :
                        insight.impact === 'high' ? 'border-orange-500 text-orange-300' :
                        insight.impact === 'medium' ? 'border-yellow-500 text-yellow-300' :
                        'border-green-500 text-green-300'
                      }`}
                    >
                      Impact: {insight.impact}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommandations de sécurité */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Recommandations de Sécurité</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Actions recommandées pour améliorer la sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-green-400 text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-slate-300 text-sm">{recommendation}</p>
              </div>
            ))}
          </div>

          <Alert className="mt-4 border-blue-500 bg-blue-500/10">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-200">
              Ces recommandations sont basées sur les meilleures pratiques de sécurité
              et l'analyse des patterns d'attaque détectés durant les tests.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecurityInsights
