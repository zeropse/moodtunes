// Animation utilities for smooth UI interactions
export const animationConfig = {
  // Reduced motion support
  respectsReducedMotion:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,

  // Base durations (in ms)
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    veryFast: 100,
  },

  // Easing functions
  easings: {
    easeOut: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
};

// Get animation duration based on user preferences
export function getAnimationDuration(type = "normal") {
  if (animationConfig.respectsReducedMotion) {
    return 0; // No animation for reduced motion
  }
  return animationConfig.durations[type] || animationConfig.durations.normal;
}

// Get easing function based on user preferences
export function getEasing(type = "easeOut") {
  if (animationConfig.respectsReducedMotion) {
    return "linear"; // Simple linear for reduced motion
  }
  return animationConfig.easings[type] || animationConfig.easings.easeOut;
}

// Stagger animation delays for lists
export function getStaggerDelay(index, baseDelay = 50) {
  if (animationConfig.respectsReducedMotion) {
    return 0;
  }
  return index * baseDelay;
}

// Smooth scroll utility
export function smoothScrollTo(element, options = {}) {
  if (!element) return;

  const { behavior = "smooth", block = "start", inline = "nearest" } = options;

  if (animationConfig.respectsReducedMotion) {
    element.scrollIntoView({ behavior: "auto", block, inline });
  } else {
    element.scrollIntoView({ behavior, block, inline });
  }
}

// Intersection Observer for scroll animations
export function createScrollObserver(callback, options = {}) {
  if (
    typeof window === "undefined" ||
    typeof IntersectionObserver === "undefined"
  ) {
    return null;
  }

  const defaultOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.1,
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

// Debounced resize handler
export function createResizeHandler(callback, delay = 250) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
}

// Performance-optimized animation frame handler
export class AnimationFrameHandler {
  constructor() {
    this.callbacks = new Set();
    this.isRunning = false;
    this.frameId = null;
  }

  add(callback) {
    this.callbacks.add(callback);
    if (!this.isRunning) {
      this.start();
    }
  }

  remove(callback) {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
  }

  stop() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.isRunning = false;
  }

  tick() {
    if (!this.isRunning) return;

    this.callbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Animation callback error:", error);
      }
    });

    this.frameId = requestAnimationFrame(() => this.tick());
  }
}

// Global animation frame handler instance
export const globalAnimationHandler = new AnimationFrameHandler();

// Smooth value interpolation
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Clamp value between min and max
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Map value from one range to another
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Smooth step function for easing
export function smoothStep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Spring animation utility
export class SpringAnimation {
  constructor(initialValue = 0, config = {}) {
    this.value = initialValue;
    this.target = initialValue;
    this.velocity = 0;

    this.stiffness = config.stiffness || 0.15;
    this.damping = config.damping || 0.8;
    this.precision = config.precision || 0.01;

    this.isAnimating = false;
    this.onUpdate = config.onUpdate || (() => {});
    this.onComplete = config.onComplete || (() => {});
  }

  setTarget(newTarget) {
    this.target = newTarget;
    if (!this.isAnimating) {
      this.start();
    }
  }

  start() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    globalAnimationHandler.add(() => this.update());
  }

  stop() {
    if (!this.isAnimating) return;
    this.isAnimating = false;
    globalAnimationHandler.remove(() => this.update());
  }

  update() {
    const force = (this.target - this.value) * this.stiffness;
    this.velocity += force;
    this.velocity *= this.damping;
    this.value += this.velocity;

    this.onUpdate(this.value);

    // Check if animation is complete
    const isComplete =
      Math.abs(this.target - this.value) < this.precision &&
      Math.abs(this.velocity) < this.precision;

    if (isComplete) {
      this.value = this.target;
      this.velocity = 0;
      this.stop();
      this.onComplete(this.value);
    }
  }
}

// Particle system for background effects
export class ParticleSystem {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];

    this.config = {
      particleCount: config.particleCount || 100,
      particleSize: config.particleSize || 2,
      particleSpeed: config.particleSpeed || 1,
      particleColor: config.particleColor || "#ffffff",
      particleOpacity: config.particleOpacity || 0.5,
      connectionDistance: config.connectionDistance || 100,
      ...config,
    };

    this.mouse = { x: 0, y: 0 };
    this.isRunning = false;

    this.initParticles();
    this.bindEvents();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        size: Math.random() * this.config.particleSize + 1,
        opacity: Math.random() * this.config.particleOpacity + 0.1,
      });
    }
  }

  bindEvents() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.01;
        particle.vy += (dy / distance) * force * 0.01;
      }

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;
    });
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw particles
    this.particles.forEach((particle) => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = this.config.particleColor;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // Draw connections
    if (this.config.connectionDistance > 0) {
      this.particles.forEach((particle, i) => {
        for (let j = i + 1; j < this.particles.length; j++) {
          const other = this.particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.config.connectionDistance) {
            const opacity =
              (1 - distance / this.config.connectionDistance) * 0.2;
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.strokeStyle = this.config.particleColor;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.stroke();
            this.ctx.restore();
          }
        }
      });
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.updateParticles();
    this.drawParticles();

    requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.initParticles();
  }
}
