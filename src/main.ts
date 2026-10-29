/**
 * Mohamed Amine Arrami - Portfolio Script
 * Plain TypeScript - No frameworks or external libraries
 */

import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initNavbarScrollEffect();
  initScrollSpy();
  initScrollReveal();
  init3DTilt();
  initProjectFeatureSpotlight();
  initTerminalSimulator();
  initCodeShowcase();
  initEmailCopy();
  initScrollBackgroundAnimation();
});

/**
 * Handle mobile navigation drawer toggle and auto-close on link click
 */
function initMobileNav(): void {
  const toggleBtn = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isExpanded));
  });

  // Close nav on click of any nav link
  const links = navLinks.querySelectorAll<HTMLAnchorElement>('.nav-link');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(target) &&
      !toggleBtn.contains(target)
    ) {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Add subtle elevation shadow to navbar on scroll
 */
function initNavbarScrollEffect(): void {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Scroll Reveal Animations (Idea 1)
 * Uses IntersectionObserver to smoothly fade and slide elements in as they scroll into view
 */
function initScrollReveal(): void {
  const reveals = document.querySelectorAll<HTMLElement>('.reveal-init');
  if (reveals.length === 0) return;

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach((el) => observer.observe(el));
}

/**
 * 3D Interactive Card Tilt on Hover (Idea 2)
 * Subtly rotates cards following the mouse coordinates on desktop
 */
function init3DTilt(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  const tiltCards = document.querySelectorAll<HTMLElement>('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle rotation limit (+/- 5.5 degrees)
      const rotateX = -((y - centerY) / centerY) * 5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * Interactive Project Feature Spotlight (Idea 5)
 * Allows tapping/clicking on Restaurant section parts to focus
 */
function initProjectFeatureSpotlight(): void {
  const featureBoxes = document.querySelectorAll<HTMLElement>('.feature-box');
  if (featureBoxes.length === 0) return;

  featureBoxes.forEach((box) => {
    box.addEventListener('click', () => {
      featureBoxes.forEach((b) => b.classList.remove('spotlight'));
      box.classList.add('spotlight');
    });

    box.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        featureBoxes.forEach((b) => b.classList.remove('spotlight'));
        box.classList.add('spotlight');
      }
    });
  });
}

/**
 * Interactive Mini Terminal (Bots & Arduino Simulator - Idea 1)
 */
function initTerminalSimulator(): void {
  const terminalInput = document.getElementById('terminalInput') as HTMLInputElement | null;
  const terminalLogs = document.getElementById('terminalLogs');
  const terminalBody = document.getElementById('terminalBody');
  const chipButtons = document.querySelectorAll<HTMLButtonElement>('.term-chip');

  if (!terminalInput || !terminalLogs || !terminalBody) return;

  let ledState = false;

  const runCommand = (command: string) => {
    const rawCmd = command.trim();
    if (!rawCmd) return;

    const lowerCmd = rawCmd.toLowerCase();

    // Create log entry element
    const entryEl = document.createElement('div');
    entryEl.className = 'log-entry';

    const promptSpan = document.createElement('span');
    promptSpan.className = 'log-prompt';
    promptSpan.textContent = 'maa@epi:~$';

    const cmdSpan = document.createElement('span');
    cmdSpan.className = 'log-cmd';
    cmdSpan.textContent = rawCmd;

    entryEl.appendChild(promptSpan);
    entryEl.appendChild(cmdSpan);

    const outputDiv = document.createElement('div');
    outputDiv.className = 'log-output';

    if (lowerCmd === 'clear') {
      terminalLogs.innerHTML = '';
      terminalInput.value = '';
      return;
    } else if (lowerCmd === '!bot ping') {
      outputDiv.className = 'log-output success';
      outputDiv.textContent = `[Discord Gateway] Heartbeat ACK (WebSocket: 18ms)\n🤖 Bot: Pong! 🏓 Latency: 22ms | Bot Status: Online & Healthy`;
    } else if (lowerCmd === '!bot info' || lowerCmd === '!bot status') {
      outputDiv.className = 'log-output highlight';
      outputDiv.textContent = `🤖 Discord Server Bot\n⚡ Focus: Moderation & Embedded telemetry\n✅ Guilds: Connected | Shard: #1 | Prefix: !\n👤 Developer: Mohamed Amine Arrami (EPI)`;
    } else if (lowerCmd.includes('toggleled')) {
      ledState = !ledState;
      outputDiv.className = 'log-output success';
      outputDiv.textContent = `⚡ [AVR ATmega328P] Pin 13 set to OUTPUT\n💡 Digital Pin 13: ${ledState ? 'HIGH -> Built-in LED is ON! 🟢' : 'LOW -> Built-in LED is OFF! ⚪'}`;
    } else if (lowerCmd.includes('readsensor')) {
      const rawAdc = Math.floor(Math.random() * 200) + 600; // 600-800
      const voltage = ((rawAdc / 1023) * 5).toFixed(2);
      outputDiv.className = 'log-output highlight';
      outputDiv.textContent = `⚡ [Analog Pin A0] ADC conversion complete\n📡 Raw ADC: ${rawAdc} / 1023 | Voltage: ${voltage}V | Clock: 16MHz\n✅ Embedded sensor bus status: OK`;
    } else if (lowerCmd === 'help') {
      outputDiv.textContent = `Available commands:\n • !bot ping            (Test Discord bot latency)\n • !bot info            (Inspect bot server specs)\n • arduino.toggleLed(13) (Toggle digital pin 13)\n • arduino.readSensor()  (Read analog ADC pin)\n • clear                 (Clear terminal output)`;
    } else {
      outputDiv.textContent = `Command not found: "${rawCmd}". Type 'help' or click any quick command chip below.`;
    }

    entryEl.appendChild(outputDiv);
    terminalLogs.appendChild(entryEl);

    terminalInput.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  };

  terminalInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(terminalInput.value);
    }
  });

  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        runCommand(cmd);
      }
    });
  });
}

/**
 * Interactive Code Snippet Drawer for Skills (Idea 3)
 */
function initCodeShowcase(): void {
  const codeTabs = document.querySelectorAll<HTMLButtonElement>('.code-tab-btn');
  const skillCards = document.querySelectorAll<HTMLElement>('.skill-bar-card[data-lang], .skill-card[data-lang]');
  const filenameEl = document.getElementById('codeFilename');
  const codeContentEl = document.getElementById('codeSnippetContent');
  const copyBtn = document.getElementById('copyCodeBtn');
  const copyBtnIcon = document.getElementById('copyCodeIcon');
  const copyBtnText = document.getElementById('copyCodeText');

  if (!filenameEl || !codeContentEl || !copyBtn) return;

  interface SnippetData {
    filename: string;
    rawCode: string;
    highlightedHtml: string;
  }

  const snippets: Record<string, SnippetData> = {
    c: {
      filename: 'arduino_blink.c',
      rawCode: `// Mohamed Amine Arrami - Arduino Embedded C
#include <avr/io.h>
#define LED_PIN 13

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Turn LED on
  delay(500);
  digitalWrite(LED_PIN, LOW);  // Turn LED off
  delay(500);
}`,
      highlightedHtml: `<span class="tok-cmt">// Mohamed Amine Arrami - Arduino Embedded C</span>
<span class="tok-kw">#include</span> <span class="tok-str">&lt;avr/io.h&gt;</span>
<span class="tok-kw">#define</span> <span class="tok-var">LED_PIN</span> <span class="tok-num">13</span>

<span class="tok-typ">void</span> <span class="tok-fn">setup</span>() {
  <span class="tok-fn">pinMode</span>(<span class="tok-var">LED_PIN</span>, <span class="tok-var">OUTPUT</span>);
}

<span class="tok-typ">void</span> <span class="tok-fn">loop</span>() {
  <span class="tok-fn">digitalWrite</span>(<span class="tok-var">LED_PIN</span>, <span class="tok-var">HIGH</span>); <span class="tok-cmt">// Turn LED on</span>
  <span class="tok-fn">delay</span>(<span class="tok-num">500</span>);
  <span class="tok-fn">digitalWrite</span>(<span class="tok-var">LED_PIN</span>, <span class="tok-var">LOW</span>);  <span class="tok-cmt">// Turn LED off</span>
  <span class="tok-fn">delay</span>(<span class="tok-num">500</span>);
}`
    },
    cpp: {
      filename: 'sensor_reader.cpp',
      rawCode: `// Mohamed Amine Arrami - Embedded C++ Sensor Driver
#include <Arduino.h>

class AnalogSensor {
private:
  uint8_t pin;
public:
  AnalogSensor(uint8_t p) : pin(p) {}
  
  int readValue() {
    return analogRead(pin);
  }
};

AnalogSensor tempSensor(A0);`,
      highlightedHtml: `<span class="tok-cmt">// Mohamed Amine Arrami - Embedded C++ Sensor Driver</span>
<span class="tok-kw">#include</span> <span class="tok-str">&lt;Arduino.h&gt;</span>

<span class="tok-kw">class</span> <span class="tok-typ">AnalogSensor</span> {
<span class="tok-kw">private</span>:
  <span class="tok-typ">uint8_t</span> <span class="tok-var">pin</span>;
<span class="tok-kw">public</span>:
  <span class="tok-fn">AnalogSensor</span>(<span class="tok-typ">uint8_t</span> <span class="tok-var">p</span>) : <span class="tok-var">pin</span>(<span class="tok-var">p</span>) {}
  
  <span class="tok-typ">int</span> <span class="tok-fn">readValue</span>() {
    <span class="tok-kw">return</span> <span class="tok-fn">analogRead</span>(<span class="tok-var">pin</span>);
  }
};

<span class="tok-typ">AnalogSensor</span> <span class="tok-var">tempSensor</span>(<span class="tok-var">A0</span>);`
    },
    js: {
      filename: 'discord_bot.js',
      rawCode: `// Mohamed Amine Arrami - Discord Server Bot (Node.js)
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.reply('Pong! 🏓 Bot is online and responsive.');
  }
});`,
      highlightedHtml: `<span class="tok-cmt">// Mohamed Amine Arrami - Discord Server Bot (Node.js)</span>
<span class="tok-kw">const</span> { <span class="tok-typ">Client</span>, <span class="tok-typ">GatewayIntentBits</span> } = <span class="tok-fn">require</span>(<span class="tok-str">'discord.js'</span>);
<span class="tok-kw">const</span> <span class="tok-var">client</span> = <span class="tok-kw">new</span> <span class="tok-typ">Client</span>({
  <span class="tok-var">intents</span>: [<span class="tok-typ">GatewayIntentBits</span>.<span class="tok-var">Guilds</span>, <span class="tok-typ">GatewayIntentBits</span>.<span class="tok-var">GuildMessages</span>]
});

<span class="tok-var">client</span>.<span class="tok-fn">on</span>(<span class="tok-str">'messageCreate'</span>, <span class="tok-var">message</span> =&gt; {
  <span class="tok-kw">if</span> (<span class="tok-var">message</span>.<span class="tok-var">content</span> === <span class="tok-str">'!ping'</span>) {
    <span class="tok-var">message</span>.<span class="tok-fn">reply</span>(<span class="tok-str">'Pong! 🏓 Bot is online and responsive.'</span>);
  }
});`
    },
    py: {
      filename: 'bot_commands.py',
      rawCode: `# Mohamed Amine Arrami - Discord Bot in Python
import discord
from discord.ext import commands

bot = commands.Bot(command_prefix='!', intents=discord.Intents.default())

@bot.command()
async def ping(ctx):
    latency = round(bot.latency * 1000)
    await ctx.send(f'Pong! 🏓 Latency: {latency}ms')`,
      highlightedHtml: `<span class="tok-cmt"># Mohamed Amine Arrami - Discord Bot in Python</span>
<span class="tok-kw">import</span> <span class="tok-var">discord</span>
<span class="tok-kw">from</span> <span class="tok-var">discord.ext</span> <span class="tok-kw">import</span> <span class="tok-var">commands</span>

<span class="tok-var">bot</span> = <span class="tok-var">commands</span>.<span class="tok-fn">Bot</span>(<span class="tok-var">command_prefix</span>=<span class="tok-str">'!'</span>, <span class="tok-var">intents</span>=<span class="tok-var">discord</span>.<span class="tok-typ">Intents</span>.<span class="tok-fn">default</span>())

<span class="tok-var">@bot</span>.<span class="tok-fn">command</span>()
<span class="tok-kw">async def</span> <span class="tok-fn">ping</span>(<span class="tok-var">ctx</span>):
    <span class="tok-var">latency</span> = <span class="tok-fn">round</span>(<span class="tok-var">bot</span>.<span class="tok-var">latency</span> * <span class="tok-num">1000</span>)
    <span class="tok-kw">await</span> <span class="tok-var">ctx</span>.<span class="tok-fn">send</span>(<span class="tok-str">f'Pong! 🏓 Latency: {latency}ms'</span>)`
    }
  };

  let currentLang = 'c';

  const selectLanguage = (lang: string) => {
    if (!snippets[lang]) return;
    currentLang = lang;

    // Update active tab buttons
    codeTabs.forEach((tab) => {
      if (tab.getAttribute('data-target-lang') === lang) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update active skill cards
    skillCards.forEach((card) => {
      if (card.getAttribute('data-lang') === lang) {
        card.classList.add('active-skill');
      } else {
        card.classList.remove('active-skill');
      }
    });

    // Update filename badge and code content
    const data = snippets[lang];
    filenameEl.textContent = data.filename;
    codeContentEl.innerHTML = data.highlightedHtml;
  };

  // Set default snippet
  selectLanguage('c');

  // Tab click handlers
  codeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target-lang');
      if (target) selectLanguage(target);
    });
  });

  // Skill cards click handlers
  skillCards.forEach((card) => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-lang');
      if (target) selectLanguage(target);
    });

    card.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = card.getAttribute('data-lang');
        if (target) selectLanguage(target);
      }
    });
  });

  // Copy code handler
  let copyTimeout: number | undefined;
  copyBtn.addEventListener('click', async () => {
    const raw = snippets[currentLang]?.rawCode;
    if (!raw) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(raw);
      } else {
        const ta = document.createElement('textarea');
        ta.value = raw;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      copyBtn.classList.add('copied');
      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      if (copyBtnIcon) {
        copyBtnIcon.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
      }

      if (copyTimeout) window.clearTimeout(copyTimeout);
      copyTimeout = window.setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (copyBtnText) copyBtnText.textContent = 'Copy Code';
        if (copyBtnIcon) {
          copyBtnIcon.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }
      }, 2000);
    } catch {
      // Fallback
    }
  });
}

/**
 * Update active link in navigation according to currently viewed section
 */
function initScrollSpy(): void {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * Handle copy email address to clipboard with checkmark micro-animation and spring toast (Idea 6)
 */
function initEmailCopy(): void {
  const copyBtn = document.getElementById('copyEmailBtn') as HTMLButtonElement | null;
  const copyBtnIcon = document.getElementById('copyBtnIcon');
  const copyBtnText = document.getElementById('copyBtnText');
  const emailTextEl = document.getElementById('emailText');
  const toastEl = document.getElementById('toast');

  if (!copyBtn || !copyBtnIcon || !copyBtnText || !emailTextEl || !toastEl) return;

  const originalIconHTML = copyBtnIcon.innerHTML;
  const originalText = copyBtnText.textContent || 'Copy Address';
  const emailToCopy = emailTextEl.textContent?.trim() || 'maarrami405@gmail.com';

  const checkmarkIconSVG = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;

  let toastTimeout: number | undefined;
  let resetBtnTimeout: number | undefined;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = emailToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // Micro-interaction: Change button appearance
      copyBtn.classList.add('btn-copied');
      copyBtnIcon.innerHTML = checkmarkIconSVG;
      copyBtnText.textContent = 'Copied!';

      // Show spring toast
      toastEl.classList.add('visible');

      if (toastTimeout) window.clearTimeout(toastTimeout);
      if (resetBtnTimeout) window.clearTimeout(resetBtnTimeout);

      toastTimeout = window.setTimeout(() => {
        toastEl.classList.remove('visible');
      }, 2600);

      resetBtnTimeout = window.setTimeout(() => {
        copyBtn.classList.remove('btn-copied');
        copyBtnIcon.innerHTML = originalIconHTML;
        copyBtnText.textContent = originalText;
      }, 2400);
    } catch {
      window.location.href = `mailto:${emailToCopy}`;
    }
  });
}

/**
 * Dynamic Ambient Background that morphs and drifts as the user scrolls
 */
function initScrollBackgroundAnimation(): void {
  const orbLeft1 = document.querySelector<HTMLElement>('.orbital-left-1');
  const orbLeft2 = document.querySelector<HTMLElement>('.orbital-left-2');
  const orbRight1 = document.querySelector<HTMLElement>('.orbital-right-1');
  const orbRight2 = document.querySelector<HTMLElement>('.orbital-right-2');
  const orbGlow = document.querySelector<HTMLElement>('.orbital-glow');

  // Fallback support if legacy ids are present
  const orb1 = document.getElementById('orb1');
  const orb2 = document.getElementById('orb2');
  const orb3 = document.getElementById('orb3');
  const bgGrid = document.getElementById('bgGrid');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let ticking = false;

  const updateBackground = () => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Parallax on Lendex Orbital background circles
    if (orbLeft1) {
      const shiftY = progress * 160;
      const shiftX = progress * 40;
      orbLeft1.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
    }

    if (orbLeft2) {
      const shiftY = -progress * 110;
      const shiftX = -progress * 30;
      orbLeft2.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
    }

    if (orbRight1) {
      const shiftY = progress * 210;
      const shiftX = -progress * 60;
      orbRight1.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
    }

    if (orbRight2) {
      const shiftY = -progress * 150;
      const scale = 1 + progress * 0.08;
      orbRight2.style.transform = `translate3d(0, ${shiftY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    }

    if (orbGlow) {
      const glowY = progress * 320;
      const glowScale = 1 + progress * 0.2;
      orbGlow.style.transform = `translate3d(0, ${glowY.toFixed(1)}px, 0) scale(${glowScale.toFixed(2)})`;
    }

    // Legacy orb support
    if (orb1 && orb2 && orb3 && bgGrid) {
      const x1 = -progress * 220;
      const y1 = progress * 320;
      orb1.style.transform = `translate3d(${x1.toFixed(1)}px, ${y1.toFixed(1)}px, 0)`;

      const x2 = progress * 260;
      const y2 = -progress * 380;
      orb2.style.transform = `translate3d(${x2.toFixed(1)}px, ${y2.toFixed(1)}px, 0)`;

      const x3 = -progress * 200;
      const y3 = -progress * 180;
      orb3.style.transform = `translate3d(${x3.toFixed(1)}px, ${y3.toFixed(1)}px, 0)`;

      const gridY = -progress * 70;
      bgGrid.style.transform = `translate3d(0, ${gridY.toFixed(1)}px, 0)`;
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateBackground);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateBackground();
}
