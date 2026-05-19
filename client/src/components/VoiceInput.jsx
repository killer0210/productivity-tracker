import { Microphone, MicrophoneSlash } from '@phosphor-icons/react';
import { useVoice } from '../hooks/useVoice';

export default function VoiceInput({ onTranscript }) {
  const { isListening, startListening, stopListening, supported } = useVoice(onTranscript);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      title={isListening ? 'Stop recording' : 'Voice input'}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors duration-150 ${
        isListening
          ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200'
          : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
      }`}
    >
      {isListening ? <MicrophoneSlash size={13} /> : <Microphone size={13} />}
      {isListening ? 'Stop' : 'Voice'}
    </button>
  );
}
