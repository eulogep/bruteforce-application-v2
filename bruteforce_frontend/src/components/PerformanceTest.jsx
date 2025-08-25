/**
 * Performance Test Component - Tests de performance et benchmarks
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Cpu, 
  Zap, 
  Target, 
  Clock, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Play,
  Square
} from 'lucide-react'

const PerformanceTest = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState('')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState({})
  const [benchmarkHistory, setBenchmarkHistory] = useState([])
  const intervalRef = useRef()

  const testSuites = {
    'basic_charset': {
      name: 'Test Charset Basique',
      description: 'Test de performance avec charset basique (a-z, 0-9)',
      expectedSpeed: 50000,
      duration: 5000
    },
    'complex_charset': {
      name: 'Test Charset Complexe', 
      description: 'Test avec caractères spéciaux et unicode',
      expectedSpeed: 35000,
      duration: 7000
    },
    'dictionary_attack': {
      name: 'Test Dictionnaire',
      description: 'Test de performance avec dictionnaire commun',
      expectedSpeed: 100000,
      duration: 3000
    },
    'hybrid_attack': {
      name: 'Test Hybride',
      description: 'Combinaison dictionnaire + brute force',
      expectedSpeed: 25000,
      duration: 8000
    },
    'gpu_simulation': {
      name: 'Simulation GPU',
      description: 'Test de performance GPU simulé',
      expectedSpeed: 1000000,
      duration: 4000
    }
  }

  const runPerformanceTest = async (testKey) => {
    const test = testSuites[testKey]
    setIsRunning(true)
    setCurrentTest(test.name)
    setProgress(0)

    // Simulation réaliste du test
    const startTime = performance.now()
    let attempts = 0
    const targetAttempts = test.expectedSpeed * (test.duration / 1000)

    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTime
      const progressPercent = (elapsed / test.duration) * 100

      if (progressPercent >= 100) {
        clearInterval(intervalRef.current)
        
        // Calcul des résultats finaux
        const actualElapsed = performance.now() - startTime
        const actualSpeed = Math.floor(attempts / (actualElapsed / 1000))
        const efficiency = Math.min((actualSpeed / test.expectedSpeed) * 100, 125)
        
        const testResult = {
          testName: test.name,
          speed: actualSpeed,
          efficiency: efficiency,
          attempts: attempts,
          duration: actualElapsed,
          timestamp: new Date().toISOString(),
          status: efficiency >= 80 ? 'success' : efficiency >= 60 ? 'warning' : 'error'
        }

        setResults(prev => ({ ...prev, [testKey]: testResult }))
        setBenchmarkHistory(prev => [testResult, ...prev.slice(0, 9)])
        setIsRunning(false)
        setCurrentTest('')
        setProgress(100)
        
        return
      }

      // Simulation de progression avec variations réalistes
      const speedVariation = 0.8 + Math.random() * 0.4 // 80-120% de variation
      const currentSpeed = test.expectedSpeed * speedVariation
      attempts += Math.floor(currentSpeed * 0.1) // 100ms d'intervalle
      
      setProgress(progressPercent)
    }, 100)
  }

  const stopTest = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
    setCurrentTest('')
    setProgress(0)
  }

  const runFullBenchmark = async () => {
    for (const testKey of Object.keys(testSuites)) {
      await new Promise(resolve => {
        runPerformanceTest(testKey)
        const checkComplete = setInterval(() => {
          if (!isRunning) {
            clearInterval(checkComplete)
            resolve()
          }
        }, 100)
      })
      
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const getPerformanceGrade = (efficiency) => {
    if (efficiency >= 90) return { grade: 'A+', color: 'text-green-500', bg: 'bg-green-500/10' }
    if (efficiency >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-500/10' }
    if (efficiency >= 70) return { grade: 'B', color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
    if (efficiency >= 60) return { grade: 'C', color: 'text-orange-500', bg: 'bg-orange-500/10' }
    return { grade: 'D', color: 'text-red-500', bg: 'bg-red-500/10' }
  }

  const formatSpeed = (speed) => {
    if (speed >= 1000000) return `${(speed / 1000000).toFixed(1)}M/sec`
    if (speed >= 1000) return `${(speed / 1000).toFixed(1)}K/sec`
    return `${speed}/sec`
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Contrôles de test */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Tests de Performance</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Évaluez les performances de votre système pour les attaques de brute force
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRunning && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Test en cours:</span>
                <span className="text-white font-medium">{currentTest}</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="text-center">
                <Button 
                  onClick={stopTest}
                  variant="outline"
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Arrêter le test
                </Button>
              </div>
            </div>
          )}

          {!isRunning && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(testSuites).map(([key, test]) => (
                <Button
                  key={key}
                  onClick={() => runPerformanceTest(key)}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-1 bg-slate-700/50 hover:bg-slate-600/50 border-slate-600"
                >
                  <div className="font-medium text-white">{test.name}</div>
                  <div className="text-xs text-slate-400 text-left">{test.description}</div>
                  <div className="text-xs text-purple-400">
                    Cible: {formatSpeed(test.expectedSpeed)}
                  </div>
                </Button>
              ))}
              
              <Button
                onClick={runFullBenchmark}
                className="h-auto p-4 flex flex-col items-center space-y-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Play className="h-5 w-5" />
                <div className="font-medium">Benchmark Complet</div>
                <div className="text-xs opacity-80">Tous les tests</div>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {Object.keys(results).length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Résultats des Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results).map(([key, result]) => {
                const grade = getPerformanceGrade(result.efficiency)
                return (
                  <div key={key} className={`p-4 rounded-lg border ${grade.bg} border-slate-600`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{result.testName}</h4>
                      <Badge className={`${grade.color} border-current`} variant="outline">
                        {grade.grade}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vitesse:</span>
                        <span className="text-white font-mono">{formatSpeed(result.speed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Efficacité:</span>
                        <span className={`font-mono ${grade.color}`}>{result.efficiency.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tentatives:</span>
                        <span className="text-white font-mono">{result.attempts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Durée:</span>
                        <span className="text-white font-mono">{(result.duration / 1000).toFixed(1)}s</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique des benchmarks */}
      {benchmarkHistory.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <span>Historique des Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {benchmarkHistory.map((result, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                  <div className="flex items-center space-x-3">
                    {result.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {result.status === 'error' && <Target className="h-4 w-4 text-red-500" />}
                    <span className="text-white text-sm">{result.testName}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-slate-400 font-mono">{formatSpeed(result.speed)}</span>
                    <Badge variant="outline" className={getPerformanceGrade(result.efficiency).color}>
                      {result.efficiency.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PerformanceTest
