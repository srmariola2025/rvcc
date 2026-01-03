import React, { useState, useEffect, useRef } from 'react';
import { SectionId, WorksheetData, SectionScore } from './types';
import { INITIAL_DATA, SECTIONS, READING_TEXT, SECTION_TIMER_DURATION } from './constants';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>(SectionId.WELCOME);
  const [formData, setFormData] = useState<WorksheetData>(INITIAL_DATA);
  const [timeLeft, setTimeLeft] = useState(SECTION_TIMER_DURATION);
  const [completedSections, setCompletedSections] = useState<SectionId[]>([]);
  const [finalScores, setFinalScores] = useState<Record<string, SectionScore>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeSection !== SectionId.WELCOME && activeSection !== SectionId.RESULTS) {
      setTimeLeft(SECTION_TIMER_DURATION);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeSection]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateData = (updates: Partial<WorksheetData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextSection = () => {
    if (!completedSections.includes(activeSection)) {
      setCompletedSections(prev => [...prev, activeSection]);
    }
    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[currentIndex + 1].id as SectionId);
    } else {
      calculateResults();
      setActiveSection(SectionId.RESULTS);
    }
  };

  const calculateResults = () => {
    const scores: Record<string, SectionScore> = {};
    const keys = ['profile', 'timeline', 'learning', 'values', 'reading'];
    keys.forEach(key => {
      scores[key] = { percentage: 85, status: 'success', feedback: 'Muito Bom', corrections: [], suggestions: [] };
    });
    setFinalScores(scores);
  };

  const handleDownloadDoc = () => {
    const { traineeName, traineeEmail, profile, timeline, learning, values, readingAnswers } = formData;
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const content = `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="text-align: center;">FICHA DE TRABALHO</h1>
        <h2 style="text-align: center;">FORMAÇÃO COMPLEMENTAR</h2>
        <p><strong>ÁREA:</strong> Cultura, Língua e Comunicação (LE)</p>
        <p><strong>TEMA:</strong> Saberes Fundamentais (O Elemento)</p>
        <p><strong>Formadora:</strong> Susana Costa</p>
        <p><strong>Aluno:</strong> ${traineeName} &nbsp;&nbsp;&nbsp; <strong>Email:</strong> ${traineeEmail}</p>
        <hr>
        <h3>1. Personal Profile</h3>
        <p>${profile}</p>
        <h3>2. Life Journey Timeline</h3>
        ${timeline.map(t => `<p>${t.year} – ${t.event}</p>`).join('')}
        <h3>3. Formal and Informal Learning</h3>
        <p><strong>At school:</strong> ${learning.school.join(', ')}</p>
        <p><strong>Outside:</strong> ${learning.outside.join(', ')}</p>
        <h3>4. Personal Values</h3>
        <p>${values}</p>
        <h3>5. Reading Comprehension</h3>
        <p>1. ${readingAnswers.q1}</p>
        <p>2. ${readingAnswers.q2}</p>
        <p>3. ${readingAnswers.q3}</p>
        <p>4. ${readingAnswers.q4}</p>
        <p>5. ${readingAnswers.q5}</p>
        <p><strong>Data:</strong> ${dateStr}</p>
      </div>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Worksheet_CLC_${traineeName.replace(/\s+/g, '_')}.doc`;
    link.click();
  };

  const handleSendToTrainer = () => {
    const { traineeName, profile, timeline, learning, values, readingAnswers } = formData;
    const recipient = "suskita16@hotmail.com";
    const subject = encodeURIComponent(`Apresentação do Trabalho de Saberes Fundamentais DR1 – Língua Inglesa ${traineeName}`);
    
    const workSummary = `
--- TRABALHO DE LÍNGUA INGLESA ---
1. Profile: ${profile}
2. Timeline: ${timeline.map(t => `${t.year}: ${t.event}`).join('\n')}
3. Learning: School (${learning.school.join(', ')}), Outside (${learning.outside.join(', ')})
4. Values: ${values}
5. Reading: Q1:${readingAnswers.q1}, Q2:${readingAnswers.q2}, Q3:${readingAnswers.q3}, Q4:${readingAnswers.q4}, Q5:${readingAnswers.q5}
`;

    const body = encodeURIComponent(
      `Prezada Susana Costa,\n\n` +
      `No contexto do RVCC secundário de Língua Inglesa, gostaria de entregar o trabalho relacionado ao Saberes Fundamentais DR1.\n\n` +
      `${workSummary}\n\n` +
      `Atenciosamente,\n` +
      `${traineeName}`
    );
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">English Practice</h1>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Saberes Fundamentais DR1 | <span className="text-blue-600 font-bold">Formadora: Susana Costa</span>
          </p>
        </div>
        {activeSection !== SectionId.WELCOME && activeSection !== SectionId.RESULTS && (
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Tempo</span>
            <span className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-blue-600'}`}>{formatTime(timeLeft)}</span>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-8">
        {activeSection === SectionId.WELCOME && (
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 flex flex-col items-center text-center space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-slate-800">Trabalho de Inglês</h2>
            <div className="bg-blue-50 px-6 py-2 rounded-full text-blue-700 font-bold text-sm uppercase">Formadora: Susana Costa</div>
            <p className="text-slate-500">Insira os seus dados para iniciar o exercício.</p>
            
            <div className="w-full space-y-4">
              <input 
                type="text" placeholder="Nome Completo" 
                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.traineeName} onChange={(e) => updateData({ traineeName: e.target.value })}
              />
              <input 
                type="email" placeholder="E-mail" 
                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.traineeEmail} onChange={(e) => updateData({ traineeEmail: e.target.value })}
              />
            </div>

            <button 
              onClick={() => setActiveSection(SectionId.PROFILE)}
              disabled={!formData.traineeName || !formData.traineeEmail}
              className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all"
            >
              Começar
            </button>
          </div>
        )}

        {activeSection !== SectionId.WELCOME && activeSection !== SectionId.RESULTS && (
          <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{SECTIONS.find(s => s.id === activeSection)?.label}</h3>
            
            <div className="min-h-[300px]">
              {activeSection === SectionId.PROFILE && (
                <textarea 
                  className="w-full h-64 p-4 rounded-xl bg-slate-50 border outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                  placeholder="Escreva sobre si em inglês..."
                  value={formData.profile}
                  onChange={(e) => updateData({ profile: e.target.value })}
                />
              )}
              {activeSection === SectionId.TIMELINE && (
                <div className="space-y-4">
                  {formData.timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <input type="text" placeholder="Ano" className="w-24 p-3 border rounded-lg" value={item.year} onChange={(e) => {
                        const nt = [...formData.timeline]; nt[idx].year = e.target.value; updateData({ timeline: nt });
                      }} />
                      <input type="text" placeholder="Evento" className="flex-1 p-3 border rounded-lg" value={item.event} onChange={(e) => {
                        const nt = [...formData.timeline]; nt[idx].event = e.target.value; updateData({ timeline: nt });
                      }} />
                    </div>
                  ))}
                  <button onClick={() => updateData({ timeline: [...formData.timeline, { year: '', event: '' }] })} className="text-blue-500 font-bold">+ Adicionar</button>
                </div>
              )}
              {activeSection === SectionId.LEARNING && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold mb-2">At School</h4>
                    {formData.learning.school.map((s, i) => (
                      <input key={i} className="w-full p-2 border mb-2 rounded" value={s} onChange={(e) => {
                        const arr = [...formData.learning.school]; arr[i] = e.target.value;
                        updateData({ learning: { ...formData.learning, school: arr } });
                      }} />
                    ))}
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Outside School</h4>
                    {formData.learning.outside.map((s, i) => (
                      <input key={i} className="w-full p-2 border mb-2 rounded" value={s} onChange={(e) => {
                        const arr = [...formData.learning.outside]; arr[i] = e.target.value;
                        updateData({ learning: { ...formData.learning, outside: arr } });
                      }} />
                    ))}
                  </div>
                </div>
              )}
              {activeSection === SectionId.VALUES && (
                <textarea 
                  className="w-full h-64 p-4 border rounded-xl"
                  placeholder="Seus valores..."
                  value={formData.values}
                  onChange={(e) => updateData({ values: e.target.value })}
                />
              )}
              {activeSection === SectionId.READING && (
                <div className="space-y-4">
                  <p className="italic bg-slate-50 p-4 border-l-4 border-blue-500">{READING_TEXT}</p>
                  {['q1', 'q2', 'q3', 'q4', 'q5'].map((q, i) => (
                    <div key={q}>
                      <p className="text-sm font-bold mb-1">Questão {i+1}</p>
                      <input className="w-full p-2 border rounded" value={(formData.readingAnswers as any)[q]} onChange={(e) => updateData({ readingAnswers: { ...formData.readingAnswers, [q]: e.target.value } })} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={nextSection}
              className="w-full mt-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
            >
              {activeSection === SectionId.READING ? 'Finalizar' : 'Próxima'}
            </button>
          </div>
        )}

        {activeSection === SectionId.RESULTS && (
          <div className="space-y-8 animate-fadeIn text-center">
            <h2 className="text-4xl font-bold text-slate-800">Trabalho Concluído!</h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={handleDownloadDoc} className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl">Baixar .doc</button>
              <button onClick={handleSendToTrainer} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl">Enviar por E-mail</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;