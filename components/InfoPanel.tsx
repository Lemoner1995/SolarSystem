import React, { useState, useEffect, useRef } from 'react';
import { PlanetData, ChatMessage } from '../types';
import { chatWithPlanet, generatePlanetFunFact } from '../services/geminiService';

interface InfoPanelProps {
  planet: PlanetData | null;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ planet, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'chat'>('info');
  const [funFact, setFunFact] = useState<string>('');
  const [loadingFact, setLoadingFact] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset state when planet changes
  useEffect(() => {
    if (planet) {
      setFunFact('');
      setMessages([{ role: 'model', text: `你好！我是${planet.name}。想知道关于我的什么秘密吗？` }]);
      setActiveTab('info');
      // Auto generate a fun fact on load
      fetchFunFact(planet);
    }
  }, [planet]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const fetchFunFact = async (p: PlanetData) => {
    setLoadingFact(true);
    const fact = await generatePlanetFunFact(p);
    setFunFact(fact);
    setLoadingFact(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !planet || isSending) return;

    const userText = input;
    setInput('');
    setIsSending(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    // Add temporary loading message
    setMessages(prev => [...prev, { role: 'model', text: '思考中...', isLoading: true }]);

    // API Call
    const response = await chatWithPlanet(planet.name, userText);

    // Replace loading with actual response
    setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, { role: 'model', text: response }];
    });
    
    setIsSending(false);
  };

  if (!planet) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-space-800/95 border-l border-white/10 backdrop-blur-md text-white w-full md:w-96 shadow-2xl transition-all z-20">
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-space-800 to-space-700">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            {planet.name}
          </h2>
          <p className="text-sm text-blue-300 font-mono tracking-wider">{planet.enName.toUpperCase()}</p>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'info' ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('info')}
        >
            数据档案
        </button>
        <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('chat')}
        >
            AI 对话
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {activeTab === 'info' && (
          <div className="p-6 space-y-6">
            {/* Real Photo */}
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 shadow-lg group">
                <img 
                    src={planet.imageUrl} 
                    alt={planet.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-2 right-3 text-[10px] text-white/40 italic">
                    Source: NASA/JPL/Wikimedia
                </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                <p className="text-white/80 leading-relaxed text-sm">{planet.description}</p>
            </div>

            {/* AI Fun Fact */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-lg p-4 border border-indigo-500/20 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        Gemini 星际趣闻
                    </h3>
                    <button onClick={() => fetchFunFact(planet)} className="text-xs text-white/50 hover:text-white" title="刷新">
                        ↻
                    </button>
                </div>
                {loadingFact ? (
                    <div className="h-12 flex items-center justify-center text-indigo-300/50 text-sm">
                        正在接收信号...
                    </div>
                ) : (
                    <p className="text-indigo-100 italic text-sm border-l-2 border-indigo-400 pl-3">
                        "{funFact}"
                    </p>
                )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider border-b border-white/10 pb-2">物理参数</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="直径" value={planet.details.diameter} />
                <InfoItem label="距离太阳" value={planet.details.distanceFromSun} />
                <InfoItem label="公转周期" value={planet.details.orbitalPeriod} />
                <InfoItem label="自转周期" value={planet.details.dayLength} />
                <InfoItem label="平均温度" value={planet.details.temperature} />
                <InfoItem label="卫星数量" value={planet.details.moons.toString()} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-white/90 rounded-bl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-white/10 bg-space-900/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`向 ${planet.name} 提问...`}
                  disabled={isSending}
                  className="flex-1 bg-space-900 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-lg px-4 transition-colors"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white/5 rounded p-3">
    <div className="text-xs text-white/40 mb-1">{label}</div>
    <div className="text-sm font-medium text-white/90">{value}</div>
  </div>
);

export default InfoPanel;