import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface IntentionPromptProps {
    appName: string;
    onConfirm: (intention: string) => void;
    onCancel: () => void;
    delay: number; // seconds
}

const IntentionPrompt: React.FC<IntentionPromptProps> = ({ appName, onConfirm, onCancel, delay }) => {
    const [intention, setIntention] = useState('');
    const [timeLeft, setTimeLeft] = useState(delay);
    const [canProceed, setCanProceed] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanProceed(true);
        }
    }, [timeLeft]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canProceed) {
            onConfirm(intention.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-300">
            <AlertTriangle size={48} className="text-yellow-500/60 mb-6" strokeWidth={1} />

            <h2 className="text-2xl font-light mb-2">Opening {appName}</h2>
            <p className="text-white/40 text-sm mb-8">
                What's your intention for using this app?
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
                <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="I need to..."
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all placeholder:text-white/20 font-light resize-none h-24"
                    autoFocus
                />

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 border border-white/20 rounded-full text-white/60 hover:text-white hover:border-white/40 transition-all uppercase tracking-widest text-xs"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={!canProceed}
                        className={`flex-1 py-3 rounded-full uppercase tracking-widest text-xs transition-all ${canProceed
                                ? 'bg-white text-black hover:bg-white/90'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        {canProceed ? 'Continue' : `Wait ${timeLeft}s`}
                    </button>
                </div>
            </form>

            <p className="mt-8 text-white/20 text-xs">
                This pause helps you use apps more intentionally
            </p>
        </div>
    );
};

export default IntentionPrompt;
