import { useState, useEffect } from 'react'

type TaskType = 'Study' | 'Coding' | 'Reading' | 'Revision' | 'Custom'
type Theme = 'pink' | 'blue'

interface Session {
  id: string
  taskType: TaskType
  description: string
  duration: number
  timestamp: string
}

const DEFAULT_NAME = "Koli's Buddy"

const THEMES = {
  pink: {
    pageGradient: 'from-pink-50 via-rose-50 to-purple-50',
    titleGradient: 'from-pink-500 to-rose-500',
    timerGradient: 'from-pink-100 to-rose-100',
    timerText: 'text-pink-600',
    totalBg: 'bg-pink-50',
    totalBorder: 'border-pink-200',
    totalText: 'text-pink-600',
    activeTask: 'bg-pink-500 text-white shadow-lg scale-105',
    focusBorder: 'focus:border-pink-500',
    resumeBtn: 'bg-pink-500 hover:bg-pink-600',
    historyBorder: 'border-pink-400',
    historyText: 'text-pink-600',
    toggleTrack: 'bg-pink-400',
  },
  blue: {
    pageGradient: 'from-blue-50 via-sky-50 to-indigo-50',
    titleGradient: 'from-blue-500 to-indigo-500',
    timerGradient: 'from-blue-100 to-sky-100',
    timerText: 'text-blue-600',
    totalBg: 'bg-blue-50',
    totalBorder: 'border-blue-200',
    totalText: 'text-blue-600',
    activeTask: 'bg-blue-500 text-white shadow-lg scale-105',
    focusBorder: 'focus:border-blue-500',
    resumeBtn: 'bg-blue-500 hover:bg-blue-600',
    historyBorder: 'border-blue-400',
    historyText: 'text-blue-600',
    toggleTrack: 'bg-blue-400',
  },
} as const

function App() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [taskType, setTaskType] = useState<TaskType>('Study')
  const [sessionName, setSessionName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('kolisbuddy_sessions')
    if (!saved) return []
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error loading sessions:', e)
      return []
    }
  })
  const [showHistory, setShowHistory] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('kolisbuddy_theme')
    return saved === 'blue' ? 'blue' : 'pink'
  })
  const [appName, setAppName] = useState(() => localStorage.getItem('kolisbuddy_name') || DEFAULT_NAME)
  const [isEditingName, setIsEditingName] = useState(false)

  const taskTypes: TaskType[] = ['Study', 'Coding', 'Reading', 'Revision', 'Custom']
  const t = THEMES[theme]

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('kolisbuddy_sessions', JSON.stringify(sessions))
  }, [sessions])

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('kolisbuddy_theme', theme)
  }, [theme])

  // Save app name to localStorage
  useEffect(() => {
    localStorage.setItem('kolisbuddy_name', appName)
  }, [appName])

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  // Format seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getTodaysSessions = () => {
    const today = new Date().toDateString()
    return sessions.filter(s => new Date(s.timestamp).toDateString() === today)
  }

  const getTodaysTotal = () => {
    return getTodaysSessions().reduce((sum, s) => sum + s.duration, 0)
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleResume = () => setIsRunning(true)
  const handleDone = () => {
    if (seconds > 0) {
      const newSession: Session = {
        id: Date.now().toString(),
        taskType,
        description: taskDescription || sessionName || 'No description',
        duration: seconds,
        timestamp: new Date().toISOString(),
      }
      setSessions([...sessions, newSession])
    }
    setIsRunning(false)
    setSeconds(0)
    setSessionName('')
    setTaskDescription('')
  }

  const handleNameBlur = () => {
    setIsEditingName(false)
    if (!appName.trim()) setAppName(DEFAULT_NAME)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.pageGradient} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm">🌸</span>
          <button
            onClick={() => setTheme(theme === 'pink' ? 'blue' : 'pink')}
            className={`w-14 h-7 rounded-full relative transition-colors ${t.toggleTrack}`}
            aria-label="Toggle pink/blue theme"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                theme === 'blue' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm">💙</span>
        </div>

        {/* Header */}
        {isEditingName ? (
          <input
            autoFocus
            value={appName}
            onChange={e => setAppName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={e => e.key === 'Enter' && handleNameBlur()}
            className={`text-4xl font-bold text-center block w-full bg-transparent border-b-2 border-gray-200 ${t.focusBorder} focus:outline-none mb-2`}
          />
        ) : (
          <h1
            onClick={() => setIsEditingName(true)}
            title="Click to rename"
            className={`text-4xl font-bold text-center bg-gradient-to-r ${t.titleGradient} bg-clip-text text-transparent mb-2 cursor-pointer`}
          >
            {appName}
          </h1>
        )}
        <p className="text-center text-gray-500 text-sm mb-6">Floating Timer for Deep Work</p>

        {/* Timer Display */}
        <div className={`bg-gradient-to-br ${t.timerGradient} rounded-2xl p-8 mb-6 text-center`}>
          <p className="text-sm text-gray-600 mb-2 font-medium">Current Session</p>
          <p className={`text-6xl font-bold ${t.timerText} font-mono tracking-wider`}>
            {formatTime(seconds)}
          </p>
        </div>

        {/* Today's Total */}
        <div className={`${t.totalBg} rounded-xl p-4 mb-6 text-center border-2 ${t.totalBorder}`}>
          <p className="text-xs text-gray-600 font-medium">Today's Total</p>
          <p className={`text-2xl font-bold ${t.totalText}`}>{formatTime(getTodaysTotal())}</p>
          <p className="text-xs text-gray-500 mt-1">{getTodaysSessions().length} sessions</p>
        </div>

        {/* Task Type Selector */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 font-medium mb-3">Task Type</p>
          <div className="flex flex-wrap gap-2">
            {taskTypes.map(task => (
              <button
                key={task}
                onClick={() => setTaskType(task)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  taskType === task
                    ? t.activeTask
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {task}
              </button>
            ))}
          </div>
        </div>

        {/* Task Name Input */}
        {taskType === 'Custom' && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Custom task name..."
              value={sessionName}
              onChange={e => setSessionName(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border-2 border-gray-200 ${t.focusBorder} focus:outline-none transition-colors text-sm`}
            />
          </div>
        )}

        {/* Task Description */}
        <div className="mb-6">
          <label className="text-sm text-gray-700 font-medium block mb-2">
            What are you working on?
          </label>
          <textarea
            placeholder="e.g., Chapter 5 reading, Debug login form, Practice CSS..."
            value={taskDescription}
            onChange={e => setTaskDescription(e.target.value)}
            className={`w-full px-4 py-2 rounded-xl border-2 border-gray-200 ${t.focusBorder} focus:outline-none transition-colors text-sm resize-none h-20`}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 mb-4">
          {!isRunning && seconds === 0 && (
            <button
              onClick={handleStart}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
            >
              Start
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
            >
              Pause
            </button>
          )}

          {!isRunning && seconds > 0 && (
            <button
              onClick={handleResume}
              className={`flex-1 ${t.resumeBtn} text-white font-bold py-3 rounded-xl transition-all active:scale-95`}
            >
              Resume
            </button>
          )}

          {seconds > 0 && (
            <button
              onClick={handleDone}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
            >
              Done
            </button>
          )}
        </div>

        {/* Reset Button */}
        {!isRunning && seconds > 0 && (
          <button
            onClick={() => setSeconds(0)}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-xl transition-all mb-4"
          >
            Reset
          </button>
        )}

        {/* Toggle History */}
        {getTodaysSessions().length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-xl transition-all text-sm"
          >
            {showHistory ? '📖 Hide' : '📖 Show'} Today's Sessions ({getTodaysSessions().length})
          </button>
        )}

        {/* Today's Sessions History */}
        {showHistory && getTodaysSessions().length > 0 && (
          <div className="mt-6 max-h-60 overflow-y-auto bg-gray-50 rounded-xl p-4 space-y-2">
            {getTodaysSessions().map(session => (
              <div key={session.id} className={`bg-white p-3 rounded-lg text-sm border-l-4 ${t.historyBorder}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{session.taskType}</p>
                    <p className="text-gray-600 text-xs mt-1">{session.description}</p>
                  </div>
                  <p className={`font-bold ${t.historyText} ml-2`}>{formatTime(session.duration)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          ⏱️ Focus, track, and celebrate your progress
        </p>
      </div>
    </div>
  )
}

export default App
