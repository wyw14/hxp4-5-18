export class FoldProgressGauge {
  private container: HTMLElement;
  private currentStep: number = 0;
  private maxSteps: number = 0;
  private progressRing: SVGCircleElement | null = null;
  private stepText: HTMLSpanElement | null = null;
  private percentText: HTMLSpanElement | null = null;
  private remainingText: HTMLSpanElement | null = null;
  private statusText: HTMLSpanElement | null = null;
  private circumference: number = 0;
  private radius: number = 54;
  private strokeWidth: number = 10;

  constructor(container: HTMLElement, maxSteps: number = 0) {
    this.container = container;
    this.maxSteps = maxSteps;
    this.render();
  }

  private render(): void {
    const diameter = (this.radius + this.strokeWidth / 2) * 2;
    this.circumference = 2 * Math.PI * this.radius;

    this.container.innerHTML = `
      <div class="fold-progress-gauge">
        <div class="gauge-container">
          <svg class="progress-ring" width="${diameter}" height="${diameter}" viewBox="0 0 ${diameter} ${diameter}">
            <circle
              class="progress-ring-bg"
              stroke="#e0e0e0"
              stroke-width="${this.strokeWidth}"
              fill="transparent"
              r="${this.radius}"
              cx="${diameter / 2}"
              cy="${diameter / 2}"
            />
            <circle
              class="progress-ring-fg"
              stroke="url(#progressGradient)"
              stroke-width="${this.strokeWidth}"
              stroke-linecap="round"
              fill="transparent"
              r="${this.radius}"
              cx="${diameter / 2}"
              cy="${diameter / 2}"
              stroke-dasharray="${this.circumference}"
              stroke-dashoffset="${this.circumference}"
              transform="rotate(-90 ${diameter / 2} ${diameter / 2})"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea" />
                <stop offset="100%" style="stop-color:#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <div class="gauge-center">
            <span class="gauge-percent">0%</span>
            <span class="gauge-steps">0/0</span>
          </div>
        </div>
        <div class="gauge-info">
          <span class="gauge-remaining">还剩 0 步</span>
          <span class="gauge-status">准备开始</span>
        </div>
      </div>
    `;

    this.progressRing = this.container.querySelector('.progress-ring-fg');
    this.stepText = this.container.querySelector('.gauge-steps');
    this.percentText = this.container.querySelector('.gauge-percent');
    this.remainingText = this.container.querySelector('.gauge-remaining');
    this.statusText = this.container.querySelector('.gauge-status');

    this.updateDisplay();
  }

  update(currentStep: number, maxSteps?: number): void {
    if (maxSteps !== undefined) {
      this.maxSteps = maxSteps;
    }
    this.currentStep = Math.min(currentStep, this.maxSteps);
    this.updateDisplay();
  }

  private updateDisplay(): void {
    const progress = this.maxSteps > 0 ? this.currentStep / this.maxSteps : 0;
    const percent = Math.round(progress * 100);
    const remaining = Math.max(0, this.maxSteps - this.currentStep);
    const offset = this.circumference - progress * this.circumference;

    if (this.progressRing) {
      this.progressRing.style.strokeDashoffset = String(offset);
      this.progressRing.classList.toggle('complete', progress >= 1);
    }

    if (this.stepText) {
      this.stepText.textContent = `${this.currentStep}/${this.maxSteps}`;
    }

    if (this.percentText) {
      this.percentText.textContent = `${percent}%`;
      this.percentText.classList.toggle('complete', progress >= 1);
    }

    if (this.remainingText) {
      if (progress >= 1) {
        this.remainingText.textContent = '🎉 全部完成';
      } else if (remaining === 1) {
        this.remainingText.textContent = '还剩 1 步';
      } else {
        this.remainingText.textContent = `还剩 ${remaining} 步`;
      }
    }

    if (this.statusText) {
      if (progress >= 1) {
        this.statusText.textContent = '✅ 折叠完成';
        this.statusText.className = 'gauge-status status-complete';
      } else if (this.currentStep === 0) {
        this.statusText.textContent = '👆 点击折痕开始';
        this.statusText.className = 'gauge-status status-idle';
      } else {
        this.statusText.textContent = '📝 折叠进行中';
        this.statusText.className = 'gauge-status status-progress';
      }
    }
  }

  reset(maxSteps?: number): void {
    if (maxSteps !== undefined) {
      this.maxSteps = maxSteps;
    }
    this.currentStep = 0;
    this.updateDisplay();
  }

  destroy(): void {
    this.container.innerHTML = '';
    this.progressRing = null;
    this.stepText = null;
    this.percentText = null;
    this.remainingText = null;
    this.statusText = null;
  }
}
