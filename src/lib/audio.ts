// src/lib/audio.ts
const getAudioContext = () => {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
};

let audioCtx: AudioContext | null = null;

export const playSound = (type: 'click' | 'correct' | 'wrong' | 'finish') => {
  try {
      if (!audioCtx) {
          audioCtx = getAudioContext();
      }
      if (audioCtx.state === 'suspended') {
          audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
      } else if (type === 'correct') {
          // Play a nice double chime
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now); // A5
          osc.frequency.setValueAtTime(1108.73, now + 0.1); // C#6
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.5);
      } else if (type === 'wrong') {
          // Soft lower thud
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.25);
      } else if (type === 'finish') {
          // Bright ascending chord ripple
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
          osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
          osc.start(now);
          osc.stop(now + 0.8);
      }
  } catch (e) {
      console.warn("Audio playback failed", e);
  }
};
