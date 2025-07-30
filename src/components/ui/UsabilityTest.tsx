import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock, CheckCircle, XCircle } from 'lucide-react'
import Button from './Button'
import Card from './Card'

interface UsabilityTestProps {
  testName: string
  tasks: UsabilityTask[]
  onComplete: (results: UsabilityTestResult) => void
  onCancel: () => void
}

interface UsabilityTask {
  id: string
  name: string
  description: string
  expectedAction: string
  timeLimit?: number // seconds
}

interface UsabilityTestResult {
  testName: string
  startTime: number
  endTime: number
  tasks: TaskResult[]
  totalDuration: number
  successRate: number
  errorCount: number
}

interface TaskResult {
  taskId: string
  taskName: string
  startTime: number
  endTime?: number
  duration?: number
  success: boolean
  errorCount: number
  notes: string
}

const UsabilityTest: React.FC<UsabilityTestProps> = ({
  testName,
  tasks,
  onComplete,
  onCancel
}) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [taskStartTime, setTaskStartTime] = useState(0)
  const [results, setResults] = useState<TaskResult[]>([])
  const [currentTaskNotes, setCurrentTaskNotes] = useState('')
  const [errorCount, setErrorCount] = useState(0)

  const currentTask = tasks[currentTaskIndex]

  useEffect(() => {
    if (currentTask) {
      setTaskStartTime(Date.now())
    }
  }, [currentTaskIndex, isRunning, currentTask])

  const _startTest = () => {
    setIsRunning(true)
    setStartTime(Date.now())
    setTaskStartTime(Date.now())
  }

  const pauseTest = () => {
    setIsRunning(false)
  }

  const resumeTest = () => {
    setIsRunning(true)
    setTaskStartTime(Date.now())
  }

  const completeTask = (success: boolean) => {
    if (!currentTask) return;
    
    const taskResult: TaskResult = {
      taskId: currentTask.id,
      taskName: currentTask.name,
      startTime: taskStartTime,
      endTime: Date.now(),
      duration: Date.now() - taskStartTime,
      success,
      errorCount,
      notes: currentTaskNotes
    }

    const newResults = [...results, taskResult]
    setResults(newResults)
    setCurrentTaskNotes('')
    setErrorCount(0)

    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
    } else {
      // Test completed
      const testResult: UsabilityTestResult = {
        testName,
        startTime,
        endTime: Date.now(),
        tasks: newResults,
        totalDuration: Date.now() - startTime,
        successRate: (newResults.filter(r => r.success).length / newResults.length) * 100,
        errorCount: newResults.reduce((sum, r) => sum + r.errorCount, 0)
      }
      onComplete(testResult)
    }
  }

  const addError = () => {
    setErrorCount(errorCount + 1)
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getCurrentDuration = () => {
    if (!isRunning) return 0
    return Date.now() - taskStartTime
  }

  if (!currentTask) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card variant="glass" className="w-full max-w-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{testName}</h2>
            <p className="text-gray-600">Görev {currentTaskIndex + 1} / {tasks.length}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(getCurrentDuration())}</span>
            </div>
            {isRunning ? (
              <Button variant="secondary" size="sm" icon={Pause} onClick={pauseTest}>
                Duraklat
              </Button>
            ) : (
              <Button variant="primary" size="sm" icon={Play} onClick={resumeTest}>
                Devam Et
              </Button>
            )}
            <Button variant="destructive" size="sm" icon={Square} onClick={onCancel}>
              İptal
            </Button>
          </div>
        </div>

        {/* Current Task */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentTask.name}
          </h3>
          <p className="text-gray-600 mb-4">{currentTask.description}</p>
          
          {currentTask.timeLimit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                ⏰ Zaman sınırı: {formatTime(currentTask.timeLimit * 1000)}
              </p>
            </div>
          )}
        </div>

        {/* Error Counter */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Hata sayısı:</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-red-600">{errorCount}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={addError}
                className="text-red-600 hover:text-red-700"
              >
                + Hata
              </Button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notlar (isteğe bağlı)
          </label>
          <textarea
            value={currentTaskNotes}
            onChange={(e) => setCurrentTaskNotes(e.target.value)}
            placeholder="Bu görevle ilgili notlarınızı yazın..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>İlerleme</span>
            <span>{currentTaskIndex + 1} / {tasks.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentTaskIndex + 1) / tasks.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="destructive"
            size="lg"
            icon={XCircle}
            onClick={() => completeTask(false)}
            className="flex-1"
          >
            Başarısız
          </Button>
          <Button
            variant="primary"
            size="lg"
            icon={CheckCircle}
            onClick={() => completeTask(true)}
            className="flex-1"
          >
            Başarılı
          </Button>
        </div>

        {/* Previous Results */}
        {results.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Önceki Görevler</h4>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={result.taskId}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-600">
                    {index + 1}. {result.taskName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(result.duration || 0)}
                    </span>
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default UsabilityTest 