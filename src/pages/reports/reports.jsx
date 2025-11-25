import React, { useState, useEffect } from 'react';
import { Play, Clock, Calendar, BarChart3, Users, Tag, FileText, DollarSign, LayoutGrid, UserCircle, Trash2 } from 'lucide-react';

export default function ClockifyClone() {
  const [activeView, setActiveView] = useState('dashboard'); // changed default to 'dashboard'
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      description: 'javascriptmastery code',
      project: 'Project',
      startTime: '19:15',
      endTime: '21:53',
      duration: '02:38:08',
      date: 'Today'
    },
    {
      id: 2,
      description: 'język angielski',
      project: 'Project',
      startTime: '16:28',
      endTime: '18:50',
      duration: '02:10:14',
      date: 'Today'
    },
    {
      id: 3,
      description: 'język angielski',
      project: 'Project',
      startTime: '13:45',
      endTime: '16:37',
      duration: '01:51:04',
      date: 'Yesterday'
    }
  ]);

  const deleteEntry = (id) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  const addProject = () => {
    if (newProjectName.trim()) {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const newProject = {
        id: Date.now(),
        name: newProjectName.trim(),
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      setNewProjectName('');
      setShowProjectModal(false);
    }
  };

  const selectProject = (project) => {
    setSelectedProject(project);
    setShowProjectModal(false);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000) + elapsedSeconds;
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        setCurrentTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, elapsedSeconds]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const handleStop = () => {
    if (isRunning && description) {
      const now = new Date();
      const start = new Date(startTime);
      const newEntry = {
        id: Date.now(),
        description: description,
        project: selectedProject ? selectedProject.name : '(no Project)',
        projectId: selectedProject ? selectedProject.id : null,
        startTime: start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        endTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration: currentTime,
        date: 'Today'
      };
      setTimeEntries([newEntry, ...timeEntries]);
      setDescription('');
      setSelectedProject(null);
    }
    setIsRunning(false);
    setCurrentTime('00:00:00');
    setElapsedSeconds(0);
    setStartTime(null);
  };

  const calculateWeekTotal = (filter) => {
    const entries = filter === 'today' 
      ? timeEntries.filter(e => e.date === 'Today')
      : filter === 'yesterday'
      ? timeEntries.filter(e => e.date === 'Yesterday')
      : timeEntries;
    
    let totalSeconds = 0;
    entries.forEach(entry => {
      const [h, m, s] = entry.duration.split(':').map(Number);
      totalSeconds += h * 3600 + m * 60 + s;
    });
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Clock size={20} />
            <span className="text-sm">TIME TRACKER</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            <SidebarItem 
              icon={<Clock size={18} />} 
              text="TIME TRACKER" 
              active={activeView === 'tracker'} 
              onClick={() => setActiveView('tracker')} 
            />
            <SidebarItem icon={<Calendar size={18} />} text="CALENDAR" />
          </div>
          
          <div className="px-4 py-2">
            <div className="text-xs text-gray-500 font-semibold mb-2">ANALYZE</div>
            <SidebarItem icon={<LayoutGrid size={18} />} text="DASHBOARD" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <SidebarItem 
              icon={<BarChart3 size={18} />} 
              text="REPORTS" 
              hasArrow 
              active={activeView === 'reports'} 
              onClick={() => setActiveView('reports')} 
            />
          </div>
          
          <div className="px-4 py-2">
            <div className="text-xs text-gray-500 font-semibold mb-2">MANAGE</div>
            <SidebarItem icon={<FileText size={18} />} text="PROJECTS" />
            <SidebarItem icon={<Users size={18} />} text="TEAM" />
            <SidebarItem icon={<UserCircle size={18} />} text="CLIENTS" />
            <SidebarItem icon={<Tag size={18} />} text="TAGS" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'tracker' ? (
          <TrackerView 
            description={description}
            setDescription={setDescription}
            currentTime={currentTime}
            isRunning={isRunning}
            handleStart={handleStart}
            handleStop={handleStop}
            timeEntries={timeEntries}
            deleteEntry={deleteEntry}
            calculateWeekTotal={calculateWeekTotal}
            selectedProject={selectedProject}
            showProjectModal={showProjectModal}
            setShowProjectModal={setShowProjectModal}
            projects={projects}
            selectProject={selectProject}
            newProjectName={newProjectName}
            setNewProjectName={setNewProjectName}
            addProject={addProject}
          />
        ) : activeView === 'reports' ? (
          <ReportsView timeEntries={timeEntries} />
        ) : (
          <DashboardView timeEntries={timeEntries} projects={projects} />
        )}
      </div>
    </div>
  );
}

function DashboardView({ timeEntries, projects }) {
  const totalSeconds = timeEntries.reduce((acc, entry) => {
    const [h, m, s] = entry.duration.split(':').map(Number);
    return acc + h * 3600 + m * 60 + s;
  }, 0);

  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const totalSecs = totalSeconds % 60;
  const totalTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSecs).padStart(2, '0')}`;

  // Calculate top project
  const projectTimes = {};
  timeEntries.forEach(entry => {
    const projectName = entry.project || '(no Project)';
    if (!projectTimes[projectName]) {
      projectTimes[projectName] = 0;
    }
    const [h, m, s] = entry.duration.split(':').map(Number);
    projectTimes[projectName] += h * 3600 + m * 60 + s;
  });

  const topProject = Object.entries(projectTimes)
    .sort((a, b) => b[1] - a[1])[0];
  
  const topProjectName = topProject ? topProject[0] : '--';
  const topProjectSeconds = topProject ? topProject[1] : 0;
  const topProjectTime = topProjectSeconds > 0 
    ? `${String(Math.floor(topProjectSeconds / 3600)).padStart(2, '0')}:${String(Math.floor((topProjectSeconds % 3600) / 60)).padStart(2, '0')}:${String(topProjectSeconds % 60).padStart(2, '0')}`
    : '--';

  const calculateDayHours = (entries) => {
    let totalSeconds = 0;
    entries.forEach(entry => {
      const [h, m, s] = entry.duration.split(':').map(Number);
      totalSeconds += h * 3600 + m * 60 + s;
    });
    return totalSeconds / 3600;
  };

  const todayHours = calculateDayHours(timeEntries.filter(e => e.date === 'Today'));
  const yesterdayHours = calculateDayHours(timeEntries.filter(e => e.date === 'Yesterday'));

  const weekData = [
    { day: 'Mon, Nov 24', hours: todayHours },
    { day: 'Tue, Nov 25', hours: 0 },
    { day: 'Wed, Nov 26', hours: 0 },
    { day: 'Thu, Nov 27', hours: 0 },
    { day: 'Fri, Nov 28', hours: 0 },
    { day: 'Sat, Nov 29', hours: 0 },
    { day: 'Sun, Nov 30', hours: 0 },
  ];

  const maxHours = Math.max(...weekData.map(d => d.hours), 5);

  // Get unique activities with their totals
  const activityMap = {};
  timeEntries.forEach(entry => {
    if (!activityMap[entry.description]) {
      activityMap[entry.description] = { duration: 0, project: entry.project };
    }
    const [h, m, s] = entry.duration.split(':').map(Number);
    activityMap[entry.description].duration += h * 3600 + m * 60 + s;
  });

  const topActivities = Object.entries(activityMap)
    .map(([name, data]) => {
      const hours = Math.floor(data.duration / 3600);
      const minutes = Math.floor((data.duration % 3600) / 60);
      const seconds = data.duration % 60;
      return {
        name,
        project: data.project,
        duration: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      };
    })
    .sort((a, b) => {
      const [ha, ma, sa] = a.duration.split(':').map(Number);
      const [hb, mb, sb] = b.duration.split(':').map(Number);
      return (hb * 3600 + mb * 60 + sb) - (ha * 3600 + ma * 60 + sa);
    })
    .slice(0, 10);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded text-sm">
              <option>Project</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded text-sm">
              <option>Only me</option>
            </select>
            <button className="px-3 py-2 border border-gray-300 rounded text-sm flex items-center gap-2">
              <Calendar size={16} />
              This week
            </button>
            <button className="p-2 border border-gray-300 rounded">‹</button>
            <button className="p-2 border border-gray-300 rounded">›</button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-2">Total time</div>
            <div className="text-4xl font-semibold text-gray-800">{totalTime}</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-2">Top Project</div>
            <div className="text-2xl font-semibold text-gray-800">{topProjectName}</div>
            {topProjectTime !== '--' && (
              <div className="text-sm text-gray-500 mt-1">{topProjectTime}</div>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-2">Top Client</div>
            <div className="text-4xl font-semibold text-gray-800">--</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Bar Chart - Takes 2 columns */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <span className="text-sm text-gray-600">{totalTime}</span>
            </div>
            
            <div className="relative h-80 flex items-end justify-between gap-2">
              <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>5.0h</span>
                <span>4.5h</span>
                <span>4.0h</span>
                <span>3.5h</span>
                <span>3.0h</span>
                <span>2.5h</span>
                <span>2.0h</span>
                <span>1.5h</span>
                <span>1.0h</span>
                <span>0.5h</span>
              </div>

              <div className="flex-1 flex items-end justify-between gap-2 ml-12">
                {weekData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center" style={{ height: '260px' }}>
                      <div 
                        className="w-full bg-blue-200 rounded-t transition-all duration-300"
                        style={{ 
                          height: item.hours > 0 ? `${(item.hours / maxHours) * 100}%` : '0',
                          minHeight: item.hours > 0 ? '8px' : '0'
                        }}
                        title={`${item.hours.toFixed(2)} hours`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      {item.day.split(',')[0]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.day.split(',')[1]}
                    </div>
                    <div className="text-xs text-gray-800 font-medium">
                      {item.hours > 0 
                        ? `${String(Math.floor(item.hours)).padStart(2, '0')}:${String(Math.round((item.hours % 1) * 60)).padStart(2, '0')}:00`
                        : '00:00:00'
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Most tracked activities - Takes 1 column */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-600">Most tracked activities</h3>
              <select className="text-xs border border-gray-300 rounded px-2 py-1">
                <option>Top 10</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {topActivities.map((activity, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{activity.name}</div>
                      <div className="text-xs text-gray-500">(no Project)</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">{activity.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Donut Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 200 200" className="transform -rotate-90">
                <circle cx="100" cy="100" r="70" fill="none" stroke="#e5e7eb" strokeWidth="30" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#bfdbfe" strokeWidth="30"
                  strokeDasharray={`${(totalSeconds / 86400) * 439.8} 439.8`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-800">{totalTime}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Without project</span>
              <span className="text-sm font-semibold text-gray-800">{totalTime}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 mb-1">
              <div className="bg-blue-200 h-6 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="text-right text-sm text-gray-500">100,0%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackerView({ description, setDescription, currentTime, isRunning, handleStart, handleStop, timeEntries, deleteEntry, calculateWeekTotal, selectedProject, showProjectModal, setShowProjectModal, projects, selectProject, newProjectName, setNewProjectName, addProject }) {
  return (
    <>
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4 relative">
          <input
            type="text"
            placeholder="What are you working on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="relative">
            <button 
              onClick={() => setShowProjectModal(!showProjectModal)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600 px-3 py-2 rounded hover:bg-blue-50"
            >
              {selectedProject ? (
                <>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProject.color }}></span>
                  <span className="text-sm font-medium">{selectedProject.name}</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">+</span>
                  <span className="text-sm font-medium">Project</span>
                </>
              )}
            </button>
            
            {showProjectModal && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64">
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Find project or create new"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addProject();
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  {newProjectName && (
                    <button
                      onClick={addProject}
                      className="w-full mt-2 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      + Create "{newProjectName}"
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => selectProject(project)}
                      className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-left"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></span>
                      <span className="text-sm text-gray-700">{project.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="p-2 hover:bg-gray-100 rounded">
            <Tag size={20} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <DollarSign size={20} className="text-gray-400" />
          </button>
          <div className="text-2xl font-mono font-semibold text-gray-700 min-w-[100px] text-right">
            {currentTime}
          </div>
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
            >
              START
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
            >
              STOP
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-700">This week</h2>
            <div className="text-sm text-gray-500">
              Week total: <span className="font-semibold text-gray-700">{calculateWeekTotal('today')}</span>
            </div>
          </div>
          
          <div className="bg-gray-100 px-4 py-2 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today</span>
              <span className="text-sm text-gray-500">
                Total: <span className="font-semibold text-gray-700">{calculateWeekTotal('today')}</span>
              </span>
            </div>
          </div>
          
          {timeEntries.filter(e => e.date === 'Today').map((entry, index) => (
            <TimeEntry key={entry.id} entry={entry} number={index === 0 ? null : 4} onDelete={deleteEntry} />
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-700">Last week</h2>
            <div className="text-sm text-gray-500">
              Week total: <span className="font-semibold text-gray-700">{calculateWeekTotal('yesterday')}</span>
            </div>
          </div>
          
          <div className="bg-gray-100 px-4 py-2 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Yesterday</span>
              <span className="text-sm text-gray-500">
                Total: <span className="font-semibold text-gray-700">{calculateWeekTotal('yesterday')}</span>
              </span>
            </div>
          </div>
          
          {timeEntries.filter(e => e.date === 'Yesterday').map(entry => (
            <TimeEntry key={entry.id} entry={entry} number={3} onDelete={deleteEntry} />
          ))}
        </div>
      </div>
    </>
  );
}

function ReportsView({ timeEntries }) {
  const [groupBy, setGroupBy] = useState('project');
  
  const calculateDayHours = (entries) => {
    let totalSeconds = 0;
    entries.forEach(entry => {
      const [h, m, s] = entry.duration.split(':').map(Number);
      totalSeconds += h * 3600 + m * 60 + s;
    });
    return totalSeconds / 3600;
  };

  const todayHours = calculateDayHours(timeEntries.filter(e => e.date === 'Today'));
  const yesterdayHours = calculateDayHours(timeEntries.filter(e => e.date === 'Yesterday'));

  const weekData = [
    { day: 'Mon, Nov 24', hours: todayHours },
    { day: 'Tue, Nov 25', hours: 0 },
    { day: 'Wed, Nov 26', hours: 0 },
    { day: 'Thu, Nov 27', hours: 0 },
    { day: 'Fri, Nov 28', hours: 0 },
    { day: 'Sat, Nov 29', hours: 0 },
    { day: 'Sun, Nov 23', hours: yesterdayHours },
  ];

  const totalSeconds = timeEntries.reduce((acc, entry) => {
    const [h, m, s] = entry.duration.split(':').map(Number);
    return acc + h * 3600 + m * 60 + s;
  }, 0);

  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const totalSecs = totalSeconds % 60;
  const totalTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSecs).padStart(2, '0')}`;

  const maxHours = Math.max(...weekData.map(d => d.hours), 5);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded text-sm">
              <option>Billability</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium">
              UPGRADE
            </button>
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded text-sm font-medium flex items-center gap-2">
              Book a demo
              <span>×</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="text-sm text-gray-600">
              <span className="text-2xl font-semibold text-gray-800">{totalTime}</span>
            </div>
          </div>
          
          <div className="relative h-80 flex items-end justify-between gap-2">
            <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>5.0h</span>
              <span>4.4h</span>
              <span>3.9h</span>
              <span>3.3h</span>
              <span>2.8h</span>
              <span>2.2h</span>
              <span>1.7h</span>
              <span>1.1h</span>
              <span>0.55h</span>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 ml-12">
              {weekData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center" style={{ height: '280px' }}>
                    <div 
                      className="w-full bg-green-300 rounded-t transition-all duration-300 hover:bg-green-400"
                      style={{ 
                        height: item.hours > 0 ? `${(item.hours / maxHours) * 100}%` : '0',
                        minHeight: item.hours > 0 ? '8px' : '0'
                      }}
                      title={`${item.hours.toFixed(2)} hours`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center whitespace-nowrap">
                    {item.day}
                  </div>
                  <div className="text-xs text-gray-800 font-medium">
                    {item.hours > 0 
                      ? `${String(Math.floor(item.hours)).padStart(2, '0')}:${String(Math.round((item.hours % 1) * 60)).padStart(2, '0')}:00`
                      : '00:00:00'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-600">Group by:</span>
              <select 
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="project">Project</option>
                <option value="description">Description</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded" />
                Show estimate
              </label>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-600">TITLE ↕</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">DURATION ↕</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">AMOUNT ↕</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{timeEntries.length}</span>
                      <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                      <span className="text-sm text-gray-500">(Without project)</span>
                    </div>
                  </td>
                  <td className="text-right text-sm font-medium">{totalTime}</td>
                  <td className="text-right text-sm text-gray-600">0.00 USD</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 200 200" className="transform -rotate-90">
                <circle cx="100" cy="100" r="70" fill="none" stroke="#e5e7eb" strokeWidth="30" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#93c5fd" strokeWidth="30"
                  strokeDasharray={`${(totalSeconds / 86400) * 439.8} 439.8`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-800">{totalTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, active, hasArrow, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 ${active ? 'bg-gray-100' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-600">{icon}</span>
        <span className="text-xs text-gray-700 font-medium">{text}</span>
      </div>
      {hasArrow && <span className="text-gray-400">›</span>}
    </div>
  );
}

function TimeEntry({ entry, number, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded mb-2 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {number && (
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-sm font-medium">
              {number}
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium text-gray-800">{entry.description}</div>
            <div className="flex items-center gap-2 mt-1">
              {entry.projectId ? (
                <span className="text-sm text-blue-500 flex items-center gap-1">
                  <span className="text-blue-400">•</span> {entry.project}
                </span>
              ) : (
                <span className="text-sm text-gray-400">(no Project)</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Tag size={18} className="text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <DollarSign size={18} className="text-gray-400" />
          </button>
          <div className="text-sm text-gray-600">{entry.startTime} - {entry.endTime}</div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Calendar size={18} className="text-gray-400" />
          </button>
          <div className="text-lg font-mono font-semibold text-gray-700 min-w-[90px] text-right">
            {entry.duration}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Play size={18} className="text-blue-500" />
          </button>
          <button onClick={() => onDelete(entry.id)} className="p-2 hover:bg-red-100 rounded">
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}