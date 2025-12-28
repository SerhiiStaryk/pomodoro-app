// Create simple notification sounds using Web Audio API
class AudioNotifier {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  private playTone(
    frequency: number,
    duration: number,
    volume: number = 0.3
  ): void {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  playWorkComplete(): void {
    // Play a pleasant completion sound (three ascending notes)
    this.playTone(523.25, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 0.15), 150); // E5
    setTimeout(() => this.playTone(783.99, 0.3), 300); // G5
  }

  playBreakComplete(): void {
    // Play a gentle reminder sound (two notes)
    this.playTone(440, 0.2); // A4
    setTimeout(() => this.playTone(523.25, 0.3), 200); // C5
  }

  playTick(): void {
    // Subtle tick sound
    this.playTone(800, 0.05, 0.1);
  }
}

export const audioNotifier = new AudioNotifier();
