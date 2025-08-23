/**
 * Dashboard Component - Tableau de bord avancé avec métriques
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard, StatsGrid } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  Clock, 
  Zap, 
  Target, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Database
} from 'lucide-react'

const Dashboard = ({ attackStatus, systemInfo }) => {
  const [realTimeStats, setRealTimeStats] = useState({
    totalAttempts: 0,
    successRate: 0,
    avgSpeed: 0,
    uptime: 0
  })

  useEffect(() => {
    if (attackStatus) {
      setRealTimeStats(prev => ({
        totalAttempts: attackStatus.attempts || 0,
        successRate: attackStatus.found_password ? 100 : 0,
        avgSpeed: attackStatus.speed || 0,
        uptime: attackStatus.elapsed_time || 0
      }))
    }
  }, [attackStatus])

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Stats en temps réel */}
      <StatsGrid>
        <StatsCard
          title="Tentatives Totales"
          value={formatNumber(realTimeStats.totalAttempts)}
          description="Depuis le début de l'attaque"
          icon={Target}
          trend={{
            type: 'positive',
            value: '+12%',
            label: 'vs dernière session'
          }}
        />
        
        <StatsCard
          title="Vitesse Moyenne"
          value={`${formatNumber(realTimeStats.avgSpeed)}/s`}
          description="Tentatives par seconde"
          icon={Zap}
          valueClassName="text-blue-600"
        />
        
        <StatsCard
          title="Temps Actif"
          value={formatTime(realTimeStats.uptime)}
          description="Durée de l'attaque actuelle"
          icon={Clock}
          valueClassName="text-green-600"
        />
        
        <StatsCard
          title="Taux de Succès"
          value={`${realTimeStats.successRate}%`}
          description="Mots de passe trouvés"
          icon={Shield}
          valueClassName={realTimeStats.successRate > 0 ? "text-green-600" : "text-red-600"}
        />
      </StatsGrid>

      {/* Tabs pour différentes vues */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Progression de l'attaque */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Progression de l'Attaque</span>
                </CardTitle>
                <CardDescription>
                  État actuel de l'analyse de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{attackStatus?.progress?.toFixed(1) || 0}%</span>
                  </div>
                  <Progress value={attackStatus?.progress || 0} className="w-full" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Statut</span>
                    <Badge variant={attackStatus?.running ? "default" : "secondary"}>
                      {attackStatus?.running ? "En cours" : "Arrêté"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>ETA</span>
                    <span className="font-mono">
                      {attackStatus?.eta_seconds ? formatTime(attackStatus.eta_seconds) : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Système</span>
                </CardTitle>
                <CardDescription>
                  État des ressources système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>GPU Disponible</span>
                    <Badge variant={systemInfo?.gpu_available ? "default" : "secondary"}>
                      {systemInfo?.gpu_available ? "Oui" : "Non"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Hashcat</span>
                    <Badge variant={systemInfo?.hashcat_available ? "default" : "secondary"}>
                      {systemInfo?.hashcat_available ? "Disponible" : "Non disponible"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Mode</span>
                    <Badge variant="outline">
                      {systemInfo?.gpu_available ? "GPU Accéléré" : "CPU Standard"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Métriques de Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(attackStatus?.speed || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tentatives/sec
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(attackStatus?.total_combinations || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Combinaisons totales
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {((attackStatus?.attempts || 0) / Math.max(attackStatus?.elapsed_time || 1, 1)).toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Moyenne globale/sec
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Analyse de Sécurité</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-800">
                      Test de Sécurité en Cours
                    </div>
                    <div className="text-sm text-yellow-600">
                      Cette analyse est effectuée à des fins éducatives uniquement
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Complexité Testée</h4>
                    <div className="space-y-1 text-sm">
                      <div>Longueur: {attackStatus?.min_length || 0} - {attackStatus?.max_length || 0} caractères</div>
                      <div>Jeu de caractères: {attackStatus?.charset_type || "Standard"}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recommandations</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• Utiliser des mots de passe > 12 caractères</div>
                      <div>• Combiner majuscules, minuscules, chiffres</div>
                      <div>• Ajouter des caractères spéciaux</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs d'Activité</CardTitle>
              <CardDescription>
                Historique des opérations en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="text-xs font-mono space-y-1">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Heure</span>
                    <span className="text-muted-foreground">Action</span>
                    <span className="text-muted-foreground">Détails</span>
                  </div>
                  
                  {attackStatus?.running && (
                    <>
                      <div className="flex justify-between py-1">
                        <span>{new Date().toLocaleTimeString()}</span>
                        <span className="text-blue-600">Test en cours</span>
                        <span>{formatNumber(attackStatus.attempts)} tentatives</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>{new Date(Date.now() - 1000).toLocaleTimeString()}</span>
                        <span className="text-green-600">Performance</span>
                        <span>{formatNumber(attackStatus.speed)}/sec</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between py-1">
                    <span>{new Date().toLocaleTimeString()}</span>
                    <span className="text-gray-600">Système</span>
                    <span>Dashboard initialisé</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard
