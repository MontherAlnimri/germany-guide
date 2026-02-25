'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n/context';

export default function DeadlinesPage() {
  const dict = useDict();
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadDeadlines = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('deadlines').select('*').eq('user_id', user.id).order('due_date', { ascending: true });
    if (data) setDeadlines(data);
    setLoading(false);
  };

  useEffect(() => { loadDeadlines(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) { setFormError(dict.deadlines.titleAndDateRequired); return; }
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('deadlines').insert({ user_id: user.id, title, description: description || null, due_date: dueDate, remind_at: remindAt || null });
    setTitle(''); setDescription(''); setDueDate(''); setRemindAt('');
    setShowForm(false); setSaving(false);
    loadDeadlines();
  };

  const toggleDone = async (id: string, isDone: boolean) => {
    const supabase = createClient();
    await supabase.from('deadlines').update({ is_done: !isDone }).eq('id', id);
    loadDeadlines();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  const pending = deadlines.filter((d) => !d.is_done);
  const completed = deadlines.filter((d) => d.is_done);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.deadlines.title}</h1>
          <p className="text-gray-600 mt-1">{dict.deadlines.titleDesc}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors">{dict.deadlines.addDeadline}</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{dict.deadlines.addNewDeadline}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{formError}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{dict.deadlines.deadlineTitle}</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={dict.deadlines.deadlineTitlePlaceholder} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{dict.deadlines.description}</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={dict.deadlines.descriptionPlaceholder} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{dict.deadlines.dueDate}</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{dict.deadlines.startReminding}</label>
                <input type="date" value={remindAt} onChange={(e) => setRemindAt(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                <p className="text-xs text-gray-500 mt-1">{dict.deadlines.startRemindingHint}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">{dict.common.cancel}</button>
              <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">{saving ? dict.common.loading : dict.common.save}</button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{dict.deadlines.upcoming}</h2>
        {pending.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <p className="text-xl mb-2">{'\uD83C\uDF89'}</p>
            <h3 className="font-medium text-gray-900">{dict.deadlines.noPending}</h3>
            <p className="text-sm text-gray-500 mt-1">{dict.deadlines.noPendingDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((dl) => {
              const days = Math.ceil((new Date(dl.due_date).getTime() - Date.now()) / 86400000);
              let bc = 'bg-green-50 text-green-700';
              let bt = days + dict.deadlines.daysLeft;
              if (days < 0) { bc = 'bg-red-100 text-red-700'; bt = Math.abs(days) + 'd ' + dict.deadlines.overdue; }
              else if (days === 0) { bc = 'bg-amber-100 text-amber-700'; bt = dict.deadlines.today; }
              else if (days <= 7) { bc = 'bg-amber-50 text-amber-600'; }
              return (
                <div key={dl.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <button onClick={() => toggleDone(dl.id, dl.is_done)} className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{dl.title}</h3>
                    {dl.description && <p className="text-sm text-gray-500 mt-0.5">{dl.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">{dict.deadlines.due} {new Date(dl.due_date).toLocaleDateString()}</p>
                  </div>
                  <span className={'text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ' + bc}>{bt}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{dict.deadlines.completedSection}</h2>
          <div className="space-y-2">
            {completed.map((dl) => (
              <div key={dl.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                <button onClick={() => toggleDone(dl.id, dl.is_done)} className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">{'\u2713'}</button>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-500 line-through">{dl.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}